"""LangGraph ReAct agent for insurance assistance."""

import logging
from typing import Dict, Any, List, Optional, Annotated
import uuid
from datetime import datetime
import json
from fastapi import UploadFile

from langgraph.graph import StateGraph, END
from langchain.agents import create_agent
from langgraph_supervisor import create_supervisor
from langchain_core.tools import tool
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, ToolMessage
from langchain.chat_models import init_chat_model
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver

from app.agents.prompts import (
    SUPERVISOR_SYSTEM_PROMPT,
    CURATION_AGENT_PROMPT,
    POLICY_AGENT_PROMPT,
    DISPUTE_AGENT_PROMPT,
)
from app.agents.tools import dispute_settlement, general_similarity_search
from app.core.checkpointer import AsyncPostgresPool, get_postgres_saver
from app.core.database import AsyncSessionLocal
from app.core.config import settings
from app.schemas.chat import ChatResponse

logger = logging.getLogger(__name__)

@tool
def dispute_settlement_tool(policy_id: str, complaint_text: str, claim_doc_url: Optional[str] = None, provider_email: Optional[str] = None) -> Dict[str, Any]:
    """Escalate a customer dispute to the insurance provider.
    
    Args:
        policy_id: The policy ID associated with the dispute
        complaint_text: Description of the complaint
        claim_doc_url: Optional URL to supporting documentation
        provider_email: Optional email address for the provider
    
    Returns:
        Dictionary confirming dispute escalation and email delivery
    """
    return dispute_settlement(policy_id, complaint_text, claim_doc_url, provider_email)


class BaseAgent:
    """Base class for specialized insurance agents.
    
    Provides common interface for specialized agents that handle different
    insurance-related tasks. Each agent can optionally use a ReAct graph
    for LLM-powered tool execution.
    
    Attributes:
        checkpointer: Optional AsyncPostgresSaver for state persistence
        graph: Optional ReAct graph for LLM+tools execution
    """
    def __init__(self, checkpointer: AsyncPostgresSaver | None = None, graph=None):
        """Initialize the base agent.
        
        Args:
            checkpointer: Optional checkpointer for persisting agent state
            graph: Optional compiled ReAct agent graph
        """
        self.checkpointer = checkpointer
        self.graph = graph

    async def run(self, *args, **kwargs) -> Dict[str, Any]:
        """Execute the agent with given inputs.
        
        Must be implemented by subclasses.
        
        Raises:
            NotImplementedError: Always; subclasses must implement
        """
        raise NotImplementedError()


class CurationAgent(BaseAgent):
    """Specializes in policy curation and recommendations.
    
    Recommends suitable insurance policies based on user requirements,
    filtering by type, coverage, premium, and other criteria.
    Uses a ReAct graph with curation-focused tools and prompts.
    """
    async def run(self, requirements: Dict[str, Any], config: Dict[str, Any]) -> Dict[str, Any]:
        """Curate policies based on user requirements.
        
        Args:
            requirements: User requirements for policy filtering
            config: Agent config with thread_id and user context
        
        Returns:
            Dictionary with curated policies and filter guidance
        """
        if self.graph:
            input_data = {"input": requirements}
            out = self.graph.invoke(input_data, config)
            return out



class PolicyAgent(BaseAgent):
    """Specializes in answering policy-specific queries.
    
    Handles questions about specific insurance policies, including details,
    coverage information, and premium calculations. Identifies policy numbers
    from user input and retrieves detailed policy information.
    """
    async def run(self, message: str, attachments: Optional[List[str]], config: Dict[str, Any]) -> Dict[str, Any]:
        """Get details on a specific insurance policy.
        
        Args:
            message: User message potentially containing policy number
            attachments: Optional attached documents/images
            config: Agent config with thread_id and user context
        
        Returns:
            Dictionary with policy details or request for policy number
        """
        if self.graph:
            input_data = {"messages": [HumanMessage(content=message)], "attachments": attachments or []}
            out = self.graph.invoke(input_data, config)
            return out



class DisputeAgent(BaseAgent):
    """Specializes in handling disputes and complaints.
    
    Manages customer disputes and complaints, escalating them to the insurance
    provider via email with supporting documentation. Handles dispute evidence
    submission and follow-up communication.
    """
    async def run(self, message: str, attachments: Optional[List[str]], config: Dict[str, Any]) -> Dict[str, Any]:
        """Process a dispute or complaint.
        
        Args:
            message: User's complaint or dispute description
            attachments: Optional supporting documents/images
            config: Agent config with thread_id and user context
        
        Returns:
            Dictionary confirming dispute escalation
        """
        if self.graph:
            input_data = {"messages": [HumanMessage(content=message)], "attachments": attachments or []}
            return self.graph.invoke(input_data, config)
        import re
        m = re.search(r"(POL-?\d+)", message, re.IGNORECASE)
        policy_id = m.group(1) if m else "unknown"
        claim_doc = attachments[0] if attachments and len(attachments) > 0 else None
        return dispute_settlement(policy_id, message, claim_doc)

class SupervisorAgentManager:
    """Orchestrates specialized agents with LLM-driven routing.
    
    Manages a supervisor that routes user queries to specialized agents
    (curation, policy, dispute, analysis) based on intent. Uses LangGraph
    supervisor when available, with fallback to procedural routing.
    
    Attributes:
        llm: Language model for supervision and routing decisions
        memory: Optional checkpointer for persisting agent state
        curation_agent: Policy curation specialist
        policy_agent: Policy-specific queries specialist
        dispute_agent: Dispute/complaint handling specialist
        analysis_agent: Document/image analysis specialist
        react_agent: Fallback general-purpose ReAct agent
        supervisor: LangGraph supervisor (if available)
    """

    def __init__(self, memory=None):

        self.llm = init_chat_model(
            model="azure_openai:gpt-4o-mini",
            azure_endpoint=settings.ENDPOINT,
            api_key=settings.SUBSCRIPTION_KEY,
            api_version=settings.API_VERSION,
            temperature=0.7,
        )
        
        self.memory = memory  # Set memory/checkpointer (may be None initially)
        # Instantiate specialized agents (logical wrappers)
        self.curation_agent = CurationAgent(checkpointer=self.memory)
        self.policy_agent = PolicyAgent(checkpointer=self.memory)
        self.dispute_agent = DisputeAgent(checkpointer=self.memory)

        # Create ReAct graphs for each specialist and attach to agent wrappers
        try:
            self.curation_graph = create_agent(model=self.llm, system_prompt=CURATION_AGENT_PROMPT)
            self.policy_graph = create_agent(model=self.llm, tools=[general_similarity_search], system_prompt=POLICY_AGENT_PROMPT)
            self.dispute_graph = create_agent(model=self.llm, tools=[dispute_settlement_tool], system_prompt=DISPUTE_AGENT_PROMPT)

            # Attach graphs to agent wrappers
            self.curation_agent.graph = self.curation_graph
            self.policy_agent.graph = self.policy_graph
            self.dispute_agent.graph = self.dispute_graph


            # Build agents map for supervisor
            agents_map = {
                "curation": self.curation_graph,
                "policy": self.policy_graph,
                # "dispute": self.dispute_graph,
            }

            # Create langgraph supervisor to orchestrate routing and execution
            try:
                # Compile supervisor with memory checkpointer if available
                self.supervisor = create_supervisor(
                    model=self.llm,
                    agents=agents_map,
                    system_prompt=SUPERVISOR_SYSTEM_PROMPT,
                    response_format=ChatResponse,
                    output_mode="full_history",
                )
                if self.memory:
                    self.supervisor = self.supervisor.compile(checkpointer=self.memory)
                else:
                    self.supervisor = self.supervisor.compile()
            except Exception:
                self.supervisor = None
        except Exception as e:
            logger.warning("Failed to create ReAct graphs or supervisor, falling back to procedural routing", exc_info=True)
            self.curation_graph = None
            self.policy_graph = None
            self.dispute_graph = None
            self.supervisor = None


    async def invoke_agent(self, user_message: str, thread_id: Optional[str] = None, attachments: Optional[List[UploadFile]] = None, user_profile: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Route user message to appropriate agent and return response.
        
        Uses LangGraph supervisor if available for intelligent routing,
        otherwise falls back to ReAct agent reasoning.
        
        Args:
            user_message: The user's input query or request
            thread_id: Optional conversation thread ID for context continuity
            attachments: Optional documents/images attached to message
            user_profile: Optional user profile data for context
        
        Returns:
            Dictionary containing:
            - 'thread_id': Conversation thread ID
            - 'assistant_response': Agent's response text
        """
        # Ensure thread id
        if not thread_id:
            thread_id = str(uuid.uuid4())
        config = {"configurable": {"thread_id": thread_id}}
        if user_profile:
            config["configurable"]["user_profile"] = user_profile

        # If a langgraph supervisor exists, let it orchestrate and return final result
        if self.supervisor is not None:
            try:
                payload = {"input": user_message, "user_profile": user_profile or {}, "attachments": attachments or []}
                output = self.supervisor.invoke(payload, config)
                # Try to extract assistant text from commonly used keys
                if isinstance(output, dict):
                    assistant_text = output.get("assistant_response") or output.get("text") or output.get("result")
                    return {"thread_id": thread_id, "assistant_response": assistant_text or ""}
                return {"thread_id": thread_id, "assistant_response": str(output)}
            except Exception:
                logger.exception("Supervisor invoke failed")


# Global agent instance (supervisor)
_agent_manager: Optional[SupervisorAgentManager] = None


async def get_agent_manager() -> SupervisorAgentManager:
    """Get or create the global supervisor agent manager instance.
    
    Initializes the AsyncPostgresPool, creates a PostgreSQL saver for
    checkpointing agent state, and instantiates the SupervisorAgentManager
    on first call. Subsequent calls return the cached instance.
    
    Returns:
        The global SupervisorAgentManager instance
        
    Raises:
        RuntimeError: If initialization fails
    """
    global _agent_manager
    if _agent_manager is None:
        # Initialize the AsyncPostgresPool
        await AsyncPostgresPool.initialize()
        # Get the memory saver and setup tables
        memory = await get_postgres_saver()
        # Create the agent manager with the memory saver
        _agent_manager = SupervisorAgentManager(memory=memory)
    return _agent_manager


async def run_agent(
    user_message: str,
    thread_id: Optional[str] = None,
    attachments: Optional[List[UploadFile]] = None,
    user_profile: Optional[Dict[str, Any]] = None,
    is_dispute: Optional[bool] = False,
    is_policy_check: Optional[bool] = False,
    is_my_policies_chat: Optional[bool] = False,
) -> Dict[str, Any]:
    """Execute the supervisor agent with user input and return response.
    
    High-level entry point for agent execution. Retrieves the singleton
    SupervisorAgentManager and invokes it with the provided parameters.
    This is the main interface for the chat service and API endpoints.
    
    Args:
        user_message: The user's input message or query
        thread_id: Optional thread ID for maintaining conversation context
        attachments: Optional list of document/image URLs to attach
        user_profile: Optional dictionary with user profile/preferences
    
    Returns:
        Dictionary with agent response including:
        - 'thread_id': Conversation thread identifier
        - 'assistant_response': The agent's response text
    
    Example:
        response = await run_agent(
            user_message="Show me home insurance policies",
            user_profile={"location": "NY", "family_size": 4}
        )
    """
    if is_dispute:
        # If the message is related to a dispute, directly invoke the dispute agent
        dispute_agent = DisputeAgent()
        config = {"configurable": {"thread_id": thread_id, "user_profile": user_profile or {}}}
        # TODO call the document analysis functionality here to extract relevant info from attachments and include it as a user message or context for the dispute agent
        return await dispute_agent.run(user_message, attachments, config)
    elif is_policy_check or is_my_policies_chat:
        # If the message is related to a policy check, directly invoke the policy agent
        policy_agent = PolicyAgent()
        config = {"configurable": {"thread_id": thread_id, "user_profile": user_profile or {}}}
        return await policy_agent.run(user_message, attachments, config)

    agent = await get_agent_manager()
    return await agent.invoke_agent(user_message, thread_id, attachments, user_profile)

"""LangGraph ReAct agent for insurance assistance."""

import logging
from typing import Dict, Any, List, Optional, Annotated
import uuid
from datetime import datetime
import json
import re
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
def dispute_settlement_tool(
    policy_id: str,
    complaint_text: str,
    claim_doc_url: Optional[str] = None,
    provider_email: Optional[str] = None,
) -> Dict[str, Any]:
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

    def _parse_llm_json(self, content: str) -> Dict[str, Any]:
        """Robusly parse JSON from LLM output, handling markdown blocks and double braces."""
        if not content:
            return {}

        # Remove markdown code blocks if present
        content = content.strip()
        if content.startswith("```"):
            match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", content)
            if match:
                content = match.group(1).strip()

        # Handle cases where LLM might follow prompt's double braces literally ({{ ... }})
        # or other garbage around the JSON
        match = re.search(r"({[\s\S]*})", content)
        if match:
            content = match.group(1).strip()
            # If it starts with {{ and ends with }}, try to strip one layer
            if content.startswith("{{") and content.endswith("}}"):
                content = content[1:-1].strip()

        try:
            return json.loads(content)
        except json.JSONDecodeError:
            # Handle unescaped newlines which are common in LLM outputs
            try:
                # Replace literal newlines with \n escape sequence
                content_escaped = content.replace("\n", "\\n").replace("\r", "\\r")
                return json.loads(content_escaped)
            except Exception:
                pass

            # Try one more aggressive cleanup: remove anything before first { and after last }
            try:
                start_idx = content.find("{")
                end_idx = content.rfind("}")
                if start_idx != -1 and end_idx != -1:
                    content_clean = content[start_idx : end_idx + 1]
                    try:
                        return json.loads(content_clean)
                    except json.JSONDecodeError:
                        # Even clean content might need escaping
                        content_clean_escaped = content_clean.replace(
                            "\n", "\\n"
                        ).replace("\r", "\\r")
                        return json.loads(content_clean_escaped)
            except Exception:
                pass

            logger.error(f"Failed to parse JSON from LLM: {content[:100]}...")
            # Return original string instead of a dict to prevent infinite recursion in _extract_response
            return content

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

    async def run(
        self, requirements: Dict[str, Any], config: Dict[str, Any]
    ) -> Dict[str, Any]:
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
            # LangGraph ReAct agent returns state; extractor will handle it
            return out
        return {"assistant_response": "Curation service unavailable", "guidance": False}


class PolicyAgent(BaseAgent):
    """Specializes in answering policy-specific queries.

    Handles questions about specific insurance policies, including details,
    coverage information, and premium calculations. Identifies policy numbers
    from user input and retrieves detailed policy information.
    """

    async def run(
        self, message: str, attachments: Optional[List[str]], config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Get details on a specific insurance policy.

        Args:
            message: User message potentially containing policy number
            attachments: Optional attached documents/images
            config: Agent config with thread_id and user context

        Returns:
            Dictionary with policy details or request for policy number
        """
        if self.graph:
            input_data = {
                "messages": [HumanMessage(content=message)],
                "attachments": attachments or [],
            }
            out = self.graph.invoke(input_data, config)
            # LangGraph ReAct agent returns state; extractor will handle it
            return out
        return {"assistant_response": "Policy service unavailable", "guidance": False}


class DisputeAgent(BaseAgent):
    """Specializes in handling disputes and complaints.

    Manages customer disputes and complaints, escalating them to the insurance
    provider via email with supporting documentation. Handles dispute evidence
    submission and follow-up communication.
    """

    async def run(
        self, message: str, attachments: Optional[List[str]], config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Process a dispute or complaint.

        Args:
            message: User's complaint or dispute description
            attachments: Optional supporting documents/images
            config: Agent config with thread_id and user context

        Returns:
            Dictionary confirming dispute escalation
        """
        if self.graph:
            input_data = {
                "messages": [HumanMessage(content=message)],
                "attachments": attachments or [],
            }
            out = self.graph.invoke(input_data, config)
            return out
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
            print("Creating curation_graph...")
            self.curation_graph = create_agent(
                model=self.llm, system_prompt=CURATION_AGENT_PROMPT
            )
            print("Creating policy_graph...")
            self.policy_graph = create_agent(
                model=self.llm,
                tools=[general_similarity_search],
                system_prompt=POLICY_AGENT_PROMPT,
            )
            print("Creating dispute_graph...")
            self.dispute_graph = create_agent(
                model=self.llm,
                tools=[dispute_settlement_tool],
                system_prompt=DISPUTE_AGENT_PROMPT,
            )

            print("Successfully created ReAct graphs for agents")

            # Attach graphs to agent wrappers
            self.curation_agent.graph = self.curation_graph
            self.policy_agent.graph = self.policy_graph
            self.dispute_agent.graph = self.dispute_graph
            print("Attached ReAct graphs to agent wrappers")

            # Ensure agents have names for the supervisor
            # Note: create_supervisor expects agents as a list and checks for .name attribute
            self.curation_graph.name = "curation_agent"
            self.policy_graph.name = "policy_agent"
            # self.dispute_graph.name = "dispute_agent"

            agents = [self.curation_graph, self.policy_graph]

            # Create langgraph supervisor to orchestrate routing and execution
            try:
                # Compile supervisor with memory checkpointer if available
                self.supervisor = create_supervisor(
                    model=self.llm,
                    agents=agents,
                    system_prompt=SUPERVISOR_SYSTEM_PROMPT,
                    # response_format=ChatResponse,  # Removing to improve initialization success
                    output_mode="full_history",
                )
                print("Compiling supervisor...")
                if self.memory:
                    self.supervisor = self.supervisor.compile(checkpointer=self.memory)
                else:
                    self.supervisor = self.supervisor.compile()
            except Exception as e:
                logger.error(f"Failed to compile supervisor: {str(e)}", exc_info=True)
                self.supervisor = None
        except Exception as e:
            logger.warning(
                f"Failed to create ReAct graphs or supervisor: {str(e)}", exc_info=True
            )
            self.curation_graph = None
            self.policy_graph = None
            self.dispute_graph = None
            self.supervisor = None

    def _extract_response(self, output: Any) -> Dict[str, Any]:
        """Extract assistant response and guidance from various output formats."""
        content = ""

        # If it's a string directly
        if isinstance(output, str):
            content = output
        # If it's a list of messages (LangGraph state)
        elif isinstance(output, list):
            for msg in reversed(output):
                if isinstance(msg, AIMessage):
                    content = msg.content
                    break
        # If it's a dictionary (LangGraph state or direct return)
        elif isinstance(output, dict):
            # Check for messages key first (LangGraph state)
            if "messages" in output and isinstance(output["messages"], list):
                for msg in reversed(output["messages"]):
                    if isinstance(msg, AIMessage):
                        content = msg.content
                        break
            else:
                # Direct JSON keys
                if "assistant_response" in output:
                    # We might still need to check if assistant_response is a nested JSON string
                    content = output.get("assistant_response", "")
                else:
                    # Maybe it's a string in 'output' or 'text'
                    content = (
                        output.get("output")
                        or output.get("text")
                        or output.get("result")
                        or ""
                    )

        # If we got content as a string, parse it as JSON if possible
        if isinstance(content, str) and content.strip():
            # Only try to parse as JSON if it looks like JSON
            trimmed = content.strip()
            if trimmed.startswith("{") or trimmed.startswith("{{"):
                parsed = self.curation_agent._parse_llm_json(content)
                if isinstance(parsed, dict) and "assistant_response" in parsed:
                    # Recursively handle nesting or double braces in nested content
                    nested_content = parsed.get("assistant_response")

                    # Prevent infinite recursion: only recurse if nested_content is different and looks like JSON
                    if isinstance(nested_content, str) and nested_content != content:
                        nested_trimmed = nested_content.strip()
                        if nested_trimmed.startswith("{") or nested_trimmed.startswith(
                            "{{"
                        ):
                            nested_result = self._extract_response(nested_content)
                            return {
                                "assistant_response": nested_result[
                                    "assistant_response"
                                ],
                                "guidance": nested_result.get(
                                    "guidance", parsed.get("guidance", False)
                                ),
                            }

                    return {
                        "assistant_response": parsed.get("assistant_response", ""),
                        "guidance": parsed.get("guidance", False),
                    }

            return {"assistant_response": content, "guidance": False}

        return {
            "assistant_response": str(output) if output is not None else "",
            "guidance": False,
        }

    async def invoke_agent(
        self,
        user_message: str,
        thread_id: Optional[str] = None,
        attachments: Optional[List[UploadFile]] = None,
        user_profile: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
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
                print("Invoking supervisor with message:", user_message)
                payload = {
                    "messages": [HumanMessage(content=user_message)],
                    "user_profile": user_profile or {},
                    "attachments": attachments or [],
                }
                output = await self.supervisor.ainvoke(payload, config)
                print(f"Supervisor output: {output}")

                extracted = self._extract_response(output)
                return {
                    "thread_id": thread_id,
                    "assistant_response": extracted["assistant_response"],
                    "guidance": extracted["guidance"],
                }
            except Exception:
                logger.exception("Supervisor invoke failed")

        # Fallback: simple keyword-based routing to agents
        try:
            agent_result = None
            if any(
                keyword in user_message.lower()
                for keyword in ["recommend", "suggest", "curate"]
            ):
                print("Routing to CurationAgent based on keywords")
                agent_result = await self.curation_agent.run(
                    {"message": user_message}, config
                )
            elif any(
                keyword in user_message.lower()
                for keyword in ["details", "coverage", "premium", "policy number"]
            ):
                print("Routing to PolicyAgent based on keywords")
                agent_result = await self.policy_agent.run(
                    user_message, attachments, config
                )
            elif any(
                keyword in user_message.lower()
                for keyword in ["dispute", "complaint", "issue", "problem"]
            ):
                print("Routing to DisputeAgent based on keywords")
                agent_result = await self.dispute_agent.run(
                    user_message, attachments, config
                )
            else:
                print(
                    "No keywords matched; defaulting to PolicyAgent for general queries"
                )
                agent_result = await self.policy_agent.run(
                    user_message, attachments, config
                )

            extracted = self._extract_response(agent_result)
            return {
                "thread_id": thread_id,
                "assistant_response": extracted["assistant_response"],
                "guidance": extracted["guidance"],
            }
        except Exception as e:
            logger.error(f"Error in agent execution: {str(e)}", exc_info=True)
            return {
                "thread_id": thread_id,
                "assistant_response": "Sorry, there was an error processing your request.",
            }


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
        print("Initialized SupervisorAgentManager with PostgreSQL checkpointer memory")
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
        print("Routing to DisputeAgent based on is_dispute flag")
        dispute_agent = DisputeAgent()
        config = {
            "configurable": {"thread_id": thread_id, "user_profile": user_profile or {}}
        }
        # TODO call the document analysis functionality here to extract relevant info from attachments and include it as a user message or context for the dispute agent
        return await dispute_agent.run(user_message, attachments, config)
    elif is_policy_check or is_my_policies_chat:
        print(
            "Routing to PolicyAgent based on is_policy_check or is_my_policies_chat flag"
        )
        # If the message is related to a policy check, directly invoke the policy agent
        policy_agent = PolicyAgent()
        config = {
            "configurable": {"thread_id": thread_id, "user_profile": user_profile or {}}
        }
        return await policy_agent.run(user_message, attachments, config)

    print("Routing to SupervisorAgentManager for general query handling")
    agent = await get_agent_manager()
    print("Retrieved SupervisorAgentManager instance:", agent)
    print("Invoking SupervisorAgentManager with user message:", user_message)
    return await agent.invoke_agent(user_message, thread_id, attachments, user_profile)

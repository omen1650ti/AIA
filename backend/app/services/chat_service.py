"""Chat service for handling insurance agent interactions."""

import logging
import json
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    ConversationHistoryRequest,
    ConversationHistoryResponse,
)
from app.agents.core import run_agent, get_agent_manager
from app.core.database import AsyncSessionLocal
from app.models.conversation import ConversationThread, ConversationMessage
from sqlalchemy import select
from app.api.v1.endpoints.plans import get_plan_by_id

logger = logging.getLogger(__name__)


class ChatService:
    """Service for managing multi-turn conversations with the insurance agent.

    Handles chat request processing, conversation thread management, message
    persistence, and agent invocation. Maintains conversation history and
    thread context across multiple messages.

    Features:
        - Automatic thread creation and verification
        - Message history persistence
        - User profile tracking
        - Attachment handling
        - Agent invocation and response storage
    """

    @classmethod
    async def check_policies(
        cls, old_policy_id: uuid.UUID, new_policy_id: uuid.UUID, db: AsyncSession
    ) -> ChatResponse:
        """Check policy details based on provided policy IDs.

        This method is a placeholder for the actual policy checking logic.
        It should interact with the relevant data sources or services to
        retrieve and return policy information based on the given IDs.

        Args:
            policy_ids: List of policy UUIDs to check

        Returns:
            ChatResponse with policy details or relevant information

        Note:
            The implementation of this method should be done according to the specific requirements of the policy checking functionality, including
            data retrieval, formatting of the response, and error handling.
        """
        # Placeholder implementation - replace with actual logic
        policy_info_list = []
        old_policy_info = await get_plan_by_id(old_policy_id, db)
        new_policy_info = await get_plan_by_id(new_policy_id, db)
        if old_policy_info:
            policy_info_list.append(f"Old Policy: {old_policy_info}")

        if new_policy_info:
            policy_info_list.append(f"New Policy: {new_policy_info}")

        try:
            policy_details = "Policy Details:\n" + "\n".join(
                [f"- {info}" for info in policy_info_list]
            )
            response = run_agent(
                user_message=policy_details,
                thread_id="policy_check_thread",
                user_profile={},
                is_policy_check=True,
            )

            return ChatResponse(
                thread_id="policy_check_thread",
                assistant_response=response.get("assistant_response", ""),
            )
        except Exception as e:
            logger.error(f"Error checking policies: {str(e)}", exc_info=True)
            return ChatResponse(
                thread_id="policy_check_thread",
                assistant_response="Error checking policies.",
            )

    @staticmethod
    async def process_message(request: ChatRequest) -> ChatResponse:
        """Process a user chat message and return agent's response.

        Orchestrates the full message processing pipeline:
        1. Create or verify conversation thread
        2. Store user message in history
        3. Analyze attachments if provided (images/documents)
        4. Store user profile if provided
        5. Invoke the supervisor agent with message and attachment context
        6. Store agent response in history
        7. Return response with thread ID and message history

        Args:
            request: ChatRequest containing:
            - message: User's input message
            - thread_id: Optional existing thread ID
            - attachments: Optional list of document/image URLs (analyzed first)
            - user_profile: Optional user data (age, location, preferences, etc.)
            - is_dispute: Optional flag indicating if message is related to a dispute/complaint

        Returns:
            ChatResponse containing:
            - thread_id: Conversation thread identifier
            - assistant_response: Agent's response text
            - guidance: Boolean indicating if response is guidance for frontend actions


        Note:
            Attachments are automatically analyzed and their content is added
            as context to the LLM before making the agent call.
            Handles failures gracefully, returning error response if any step fails.
        """
        try:
            # Use existing thread_id or create new one
            thread_id = request.thread_id

            # If thread_id is provided, verify it exists
            if thread_id:
                thread_exists = await ChatService._thread_exists(thread_id)
                if not thread_exists:
                    logger.warning(f"Thread {thread_id} not found, creating new one")
                    thread_id = None

            # Create new thread if needed
            if not thread_id:
                thread_id = str(uuid.uuid4())
                await ChatService._create_thread(thread_id)
                logger.info(f"Created new thread: {thread_id}")

            # Store user message
            await ChatService._store_message(thread_id, "user", request.message, "text")

            # No attachment preprocessing: pass the raw user message to the agent
            augmented_message = request.message

            # If user_profile provided, store it as a profile message
            if getattr(request, "user_profile", None):
                try:
                    await ChatService._store_message(
                        thread_id, "system", json.dumps(request.user_profile), "profile"
                    )
                except Exception:
                    logger.exception("Failed to store user profile")

            # Run the agent with augmented message (agent will analyze attachments via tool call)
            result = await run_agent(
                user_message=augmented_message,
                thread_id=thread_id,
                user_profile=request.user_profile,
                is_dispute=request.is_dispute,
                is_my_policies_chat=request.is_my_policies_chat,  # Indicate this is a my-policies related chat for agent context
            )

            print(f"Agent returned result: {result}")

            # Store assistant response
            await ChatService._store_message(
                thread_id, "assistant", result.get("assistant_response", ""), "text"
            )

            # Build response with thread_id, assistant_response and guidance
            response = ChatResponse(
                thread_id=thread_id,
                assistant_response=result.get("assistant_response", ""),
                guidance=result.get("guidance", False),
            )

            logger.info(f"Message processed successfully for thread {thread_id}")
            return response

        except Exception as e:
            logger.error(f"Error processing message: {str(e)}", exc_info=True)
            return ChatResponse(
                thread_id=request.thread_id or "unknown",
                assistant_response="",
            )

    @staticmethod
    async def _thread_exists(thread_id: str) -> bool:
        """Check if a conversation thread exists in the database.

        Queries the conversation_threads table to verify thread existence
        before attempting to add messages to it.

        Args:
            thread_id: The thread ID to verify

        Returns:
            True if thread exists in database, False otherwise

        Note:
            Returns False if database query fails; errors are logged.
        """
        try:
            async with AsyncSessionLocal() as session:
                query = select(ConversationThread).where(
                    ConversationThread.thread_id == thread_id
                )
                result = await session.execute(query)
                return result.scalar_one_or_none() is not None
        except Exception as e:
            logger.error(f"Error checking thread existence: {str(e)}")
            return False

    @staticmethod
    async def _create_thread(thread_id: str) -> bool:
        """Create a new conversation thread in the database.

        Initializes a new ConversationThread record with metadata including
        creation timestamp and agent type. Thread starts in active state.

        Args:
            thread_id: Unique identifier for the thread (typically UUID)

        Returns:
            True if thread created successfully, False otherwise

        Side Effects:
            Creates database record; logs success/failure
        """
        try:
            async with AsyncSessionLocal() as session:
                thread = ConversationThread(
                    thread_id=thread_id,
                    is_active=True,
                    context_data={
                        "created_at": datetime.utcnow().isoformat(),
                        "agent_type": "insurance",
                    },
                )
                session.add(thread)
                await session.commit()
                logger.info(f"Thread created: {thread_id}")
                return True
        except Exception as e:
            logger.error(f"Error creating thread: {str(e)}", exc_info=True)
            return False

    @staticmethod
    async def _store_message(
        thread_id: str, role: str, content: str, message_type: str = "text"
    ) -> bool:
        """Store a message in the conversation history.

        Persists a message to the conversation_messages table and updates
        the thread's updated_at timestamp. Supports different message types
        for granular conversation tracking.

        Args:
            thread_id: The conversation thread ID
            role: Message role - 'user', 'assistant', 'system', or 'tool'
            content: The message content (text, JSON, etc.)
            message_type: Type of message (default: 'text'):
                - 'text': Regular text messages
                - 'tool_call': Tool invocation by agent
                - 'tool_result': Tool execution result
                - 'profile': User profile data (stored as JSON)

        Returns:
            True if stored successfully, False otherwise

        Side Effects:
            Updates thread's updated_at timestamp
            Logs errors if storage fails
        """
        try:
            async with AsyncSessionLocal() as session:
                message = ConversationMessage(
                    thread_id=thread_id,
                    role=role,
                    content=content,
                    message_type=message_type,
                    context_data={
                        "stored_at": datetime.utcnow().isoformat(),
                    },
                )
                session.add(message)

                # Update thread timestamp
                thread_query = select(ConversationThread).where(
                    ConversationThread.thread_id == thread_id
                )
                result = await session.execute(thread_query)
                thread = result.scalar_one_or_none()
                if thread:
                    thread.updated_at = datetime.utcnow()

                await session.commit()
                return True
        except Exception as e:
            logger.error(f"Error storing message: {str(e)}", exc_info=True)
            return False

    @staticmethod
    async def get_conversation_history(
        request: ConversationHistoryRequest,
    ) -> ConversationHistoryResponse:
        """Retrieve conversation history for a thread.

        Fetches all messages from a conversation thread in chronological order,
        with optional pagination support.

        Args:
            request: ConversationHistoryRequest containing:
            - thread_id: The thread to retrieve history for
            - limit: Optional maximum number of messages (None = all)

        Returns:
            ConversationHistoryResponse containing:
            - thread_id: The requested thread ID
            - status: 'success' or 'error'
            - history: List of messages with id, role, content, type, and timestamp
            - error: Error message if status is 'error'

        Note:
            Messages are returned in chronological order (oldest first).
            Returns empty list if thread has no messages.
        """
        try:
            async with AsyncSessionLocal() as session:
                query = (
                    select(ConversationMessage)
                    .where(ConversationMessage.thread_id == request.thread_id)
                    .order_by(ConversationMessage.created_at)
                )

                if request.limit:
                    query = query.limit(request.limit)

                result = await session.execute(query)
                messages = result.scalars().all()

                history = [
                    {
                        "id": str(msg.id),
                        "role": msg.role,
                        "content": msg.content,
                        "message_type": msg.message_type,
                        "created_at": msg.created_at.isoformat(),
                    }
                    for msg in messages
                ]

                return ConversationHistoryResponse(
                    thread_id=request.thread_id,
                    status="success",
                    history=history,
                )

        except Exception as e:
            logger.error(
                f"Error retrieving conversation history: {str(e)}", exc_info=True
            )
            return ConversationHistoryResponse(
                thread_id=request.thread_id,
                status="error",
                error=str(e),
            )

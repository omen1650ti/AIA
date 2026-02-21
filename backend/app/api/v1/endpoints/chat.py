"""Chat endpoint for insurance agent interactions."""

from typing import Annotated
import uuid
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    ConversationHistoryRequest,
    ConversationHistoryResponse,
)
from app.services.chat_service import ChatService

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Process a chat message and get agent response.

    Args:
        request: ChatRequest containing message and optional thread_id

    Returns:
        ChatResponse with agent's response
    """
    response = await ChatService.process_message(request)

    if not response:
        raise HTTPException(status_code=500, detail="Error processing message")

    return response


@router.post("/policy-checker", response_model=ChatResponse)
async def policy_checker(
    old_policy_id: uuid.UUID,
    new_policy_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ChatResponse:
    """
    Check policy details based on provided policy IDs.

    Args:
        old_policy_id: Old policy UUID to check
        new_policy_id: New policy UUID to check
        db: Database session

    Returns:
        ChatResponse with policy details or relevant information
    """
    response = await ChatService.check_policies(old_policy_id, new_policy_id, db)

    if not response:
        raise HTTPException(status_code=500, detail="Error checking policies")

    return response


@router.post("/conversation/history", response_model=ConversationHistoryResponse)
async def get_conversation_history(
    request: ConversationHistoryRequest,
) -> ConversationHistoryResponse:
    """
    Get conversation history for a specific thread.

    Args:
        request: ConversationHistoryRequest with thread_id

    Returns:
        ConversationHistoryResponse with conversation messages
    """
    response = await ChatService.get_conversation_history(request)

    if not response:
        raise HTTPException(
            status_code=500, detail="Error retrieving conversation history"
        )

    return response

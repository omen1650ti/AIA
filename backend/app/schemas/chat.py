from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from fastapi import UploadFile
from fastapi import UploadFile


class ChatMessage(BaseModel):
    """Represents a single message in a conversation.
    
    Attributes:
        role: The message originator ('user', 'assistant', 'system')
        content: The text content of the message
    """


class ChatRequest(BaseModel):
    """Request payload for the chat endpoint.
    
    Accepts user messages with optional thread context, user identification,
    attachments, and profile data for personalization.
    
    Attributes:
        message: The user's input query or statement
        thread_id: Optional ID to continue existing conversation (creates new if not provided)
        attachments: Optional list of document/images for analysis
        user_profile: Optional user data (age, location, preferences, risk profile, etc.)
    """
    message: str = Field(..., description="The user's message")
    thread_id: Optional[str] = Field(None, description="Optional thread ID for conversation continuity")
    attachments: Optional[List[UploadFile]] = Field(None, description="Optional list of attachment files (images/documents)")
    user_profile: Optional[Dict[str, Any]] = Field(None, description="Optional user profile data submitted via form/popup")
    is_dispute: Optional[bool] = Field(False, description="Indicates if the message is related to a dispute/complaint")
    is_my_policies_chat: Optional[bool] = Field(False, description="Indicates if the message is related to my policies chat for better agent context")


class MessageDetail(BaseModel):
    """Detailed representation of a conversation message.
    
    Provides message role, content, and type for structured message handling.
    
    Attributes:
        role: Who sent the message ('user', 'assistant', 'system', 'tool')
        content: The message payload text
        type: Message category ('text', 'tool_call', 'tool_result', 'profile', 'attachment_analysis')
    """
    role: str
    content: str
    type: str


class ChatResponse(BaseModel):
    """Response payload from the chat endpoint.
    
    Contains the agent's response along with thread identifier.
    
    Attributes:
        thread_id: The conversation thread (new or existing)
        assistant_response: The agent's response text
    """
    thread_id: str = Field(..., description="The thread ID (new or existing)")
    assistant_response: str = Field(..., description="The agent's response")
    guidance: Optional[bool] = Field(False, description="Indicates if response is guidance for frontend actions (e.g. policy filters)")


class ConversationHistoryRequest(BaseModel):
    """Request payload for retrieving conversation history.
    
    Attributes:
        thread_id: The conversation thread ID to retrieve history for
        limit: Optional maximum number of messages to return (None = all)
    """
    thread_id: str = Field(..., description="The thread ID")
    limit: Optional[int] = Field(None, description="Optional limit on number of items")


class ConversationHistoryResponse(BaseModel):
    """Response payload containing conversation history.
    
    Returns all messages from a conversation thread with metadata.
    
    Attributes:
        thread_id: The requested conversation thread ID
        status: 'success' or error status
        history: List of messages with role, content, type, and timestamp
        error: Error message if status indicates error
    """
    thread_id: str
    status: str
    history: List[Dict[str, Any]] = []
    error: Optional[str] = None

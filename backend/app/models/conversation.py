from sqlalchemy import Column, String, DateTime, JSON, Boolean
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.models.base import Base


class ConversationThread(Base):
    """Model representing a conversation thread for multi-turn agent interactions.
    
    Each thread maintains a unique conversation context with optional user association.
    Threads persist across sessions and support resuming conversations later.
    
    Attributes:
        id: Primary key UUID
        thread_id: Unique thread identifier (typically UUID string)
        created_at: Thread creation timestamp
        updated_at: Last message timestamp (auto-updated)
        is_active: Boolean flag indicating if thread is active/open
        context_data: JSON field for additional thread metadata (agent type, tags, etc.)
    
    Schema:
        - conversation_threads table in PostgreSQL
        - Indexed on thread_id for fast lookups
    """
    
    __tablename__ = "conversation_threads"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    thread_id = Column(String(255), unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True)
    context_data = Column(JSON, nullable=True)  # Store additional conversation metadata
    
    def __repr__(self):
        return f"<ConversationThread(thread_id={self.thread_id}, created_at={self.created_at})>"


class ConversationMessage(Base):
    """Model representing a single message in a conversation.
    
    Stores messages from users, agents, and tool interactions maintaining
    full message history for conversation context and debugging.
    
    Attributes:
        id: Primary key UUID
        thread_id: Foreign reference to parent ConversationThread
        role: Message sender role ('user', 'assistant', 'system', 'tool')
        content: Message text content (can include JSON for tool calls)
        message_type: Categorization of message ('text', 'tool_call', 'tool_result', 'profile')
        created_at: Message creation timestamp
        context_data: JSON field for message-specific metadata (tokens, duration, etc.)
    
    Schema:
        - conversation_messages table in PostgreSQL
        - Indexed on thread_id for efficient thread message queries
        - Ordered chronologically by created_at
    """
    
    __tablename__ = "conversation_messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    thread_id = Column(String(255), nullable=False, index=True)
    role = Column(String(50), nullable=False)  # 'user', 'assistant', 'tool'
    content = Column(String, nullable=False)
    message_type = Column(String(50), default='text')  # 'text', 'tool_call', 'tool_result'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    context_data = Column(JSON, nullable=True)
    
    def __repr__(self):
        return f"<ConversationMessage(thread_id={self.thread_id}, role={self.role})>"

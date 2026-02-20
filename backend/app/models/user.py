
import uuid
from sqlalchemy import String, ForeignKey, Float, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional
from app.models.base import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    username: Mapped[str] = mapped_column(String, unique=True, index=True)

    plan_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("plans.id"),
        nullable=True
    )

    status: Mapped[str] = mapped_column(String, default="pending")
    corrections: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    plan: Mapped["Plan"] = relationship(back_populates="users")


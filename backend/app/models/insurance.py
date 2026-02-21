import uuid
from sqlalchemy import String, ForeignKey, Float, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional
from app.models.base import Base



class InsuranceProvider(Base):
    __tablename__ = "insurance_providers"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )

    name: Mapped[str] = mapped_column(String, index=True)
    additional_details: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    plans: Mapped[List["Plan"]] = relationship(back_populates="provider")


class Plan(Base):
    __tablename__ = "plans"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )

    name: Mapped[Optional[str]] = mapped_column(String, index=True)

    insurance_provider_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("insurance_providers.id")
    )

    details: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    base_price: Mapped[float] = mapped_column(Float)
    jsonb_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    provider: Mapped["InsuranceProvider"] = relationship(back_populates="plans")
    riders: Mapped[List["Rider"]] = relationship(back_populates="plan")
    users: Mapped[List["User"]] = relationship(back_populates="plan")


class Rider(Base):
    __tablename__ = "riders"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )

    plan_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("plans.id")
    )

    rider_json: Mapped[dict] = mapped_column(JSON)

    plan: Mapped["Plan"] = relationship(back_populates="riders")

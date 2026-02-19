from sqlalchemy import String, Integer, ForeignKey, Float, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional
from app.models.base import Base

class InsuranceProvider(Base):
    __tablename__ = "insurance_providers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    additional_details: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    plans: Mapped[List["Plan"]] = relationship(back_populates="provider")

class Plan(Base):
    __tablename__ = "plans"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    insurance_provider_id: Mapped[int] = mapped_column(ForeignKey("insurance_providers.id"))
    details: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    base_price: Mapped[float] = mapped_column(Float)

    provider: Mapped["InsuranceProvider"] = relationship(back_populates="plans")
    riders: Mapped[List["Rider"]] = relationship(back_populates="plan")
    users: Mapped[List["User"]] = relationship(back_populates="plan") # Type forward reference will be resolved

class Rider(Base):
    __tablename__ = "riders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    plan_id: Mapped[int] = mapped_column(ForeignKey("plans.id"))
    rider_name: Mapped[str] = mapped_column(String)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    price: Mapped[float] = mapped_column(Float)

    plan: Mapped["Plan"] = relationship(back_populates="riders")

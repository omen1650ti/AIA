from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Any
import uuid

# --- Rider Schemas ---
class RiderBase(BaseModel):
    rider_name: str
    description: Optional[str] = None
    price: float

class RiderCreate(RiderBase):
    pass

class RiderUpdate(BaseModel):
    rider_name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None

class Rider(RiderBase):
    id: uuid.UUID
    plan_id: uuid.UUID
    model_config = ConfigDict(from_attributes=True)

# --- Plan Schemas ---
class PlanBase(BaseModel):
    details: Optional[str] = None
    base_price: float
    jsonb_data: Optional[Dict[str, Any]] = None

class PlanCreate(PlanBase):
    insurance_provider_id: uuid.UUID

class PlanUpdate(BaseModel):
    details: Optional[str] = None
    base_price: Optional[float] = None
    insurance_provider_id: Optional[uuid.UUID] = None
    jsonb_data: Optional[Dict[str, Any]] = None

class Plan(PlanBase):
    id: uuid.UUID
    insurance_provider_id: uuid.UUID
    riders: List[Rider] = []
    model_config = ConfigDict(from_attributes=True)

# --- Provider Schemas ---
class ProviderBase(BaseModel):
    name: str
    additional_details: Optional[Dict[str, Any]] = None

class ProviderCreate(ProviderBase):
    pass

class ProviderUpdate(BaseModel):
    name: Optional[str] = None
    additional_details: Optional[Dict[str, Any]] = None

class Provider(ProviderBase):
    id: uuid.UUID
    plans: List[Plan] = []
    model_config = ConfigDict(from_attributes=True)

from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Any

# --- Rider Schemas ---
class RiderBase(BaseModel):
    rider_name: str
    description: Optional[str] = None
    price: float

class RiderCreate(RiderBase):
    pass

class Rider(RiderBase):
    id: int
    plan_id: int
    model_config = ConfigDict(from_attributes=True)

# --- Plan Schemas ---
class PlanBase(BaseModel):
    details: Optional[str] = None
    base_price: float

class PlanCreate(PlanBase):
    insurance_provider_id: int

class Plan(PlanBase):
    id: int
    insurance_provider_id: int
    riders: List[Rider] = []
    model_config = ConfigDict(from_attributes=True)

# --- Provider Schemas ---
class ProviderBase(BaseModel):
    name: str
    additional_details: Optional[Dict[str, Any]] = None

class ProviderCreate(ProviderBase):
    pass

class Provider(ProviderBase):
    id: int
    plans: List[Plan] = []
    model_config = ConfigDict(from_attributes=True)

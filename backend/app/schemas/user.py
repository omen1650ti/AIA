from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any
import uuid

class UserBase(BaseModel):
    username: str
    status: Optional[str] = "pending"
    corrections: Optional[Dict[str, Any]] = None

class UserCreate(UserBase):
    plan_id: Optional[uuid.UUID] = None

class UserUpdate(BaseModel):
    username: Optional[str] = None
    status: Optional[str] = None
    corrections: Optional[Dict[str, Any]] = None
    plan_id: Optional[uuid.UUID] = None

class User(UserBase):
    id: uuid.UUID
    plan_id: Optional[uuid.UUID] = None
    model_config = ConfigDict(from_attributes=True)

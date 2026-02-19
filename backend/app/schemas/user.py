from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any

class UserBase(BaseModel):
    username: str
    status: Optional[str] = "pending"
    corrections: Optional[Dict[str, Any]] = None

class UserCreate(UserBase):
    plan_id: Optional[int] = None

class User(UserBase):
    id: int
    plan_id: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)

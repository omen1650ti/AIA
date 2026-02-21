from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
import uuid

from app.core.database import get_db
from app.models.user import User
from app.schemas.user import User as UserSchema, UserCreate, UserUpdate

router = APIRouter()

@router.post("/", response_model=UserSchema)
async def create_user(
    user: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    db_user = User(**user.model_dump())
    db.add(db_user)
    await db.commit()
    
    # Re-query with eager loading for consistency and safety
    query = select(User).options(selectinload(User.plan)).where(User.id == db_user.id)
    result = await db.execute(query)
    return result.scalars().first()

@router.patch("/id/{user_id}", response_model=UserSchema)
async def update_user(
    user_id: uuid.UUID,
    user_update: UserUpdate,
    db: AsyncSession = Depends(get_db)
):
    db_user = await db.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    await db.commit()
    
    # Re-query with eager loading for consistency and safety
    query = select(User).options(selectinload(User.plan)).where(User.id == db_user.id)
    result = await db.execute(query)
    return result.scalars().first()

@router.get("/", response_model=List[UserSchema])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    query = select(User).options(selectinload(User.plan)).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/id/{user_id}", response_model=UserSchema)
async def get_user_by_id(
    user_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    query = select(User).options(selectinload(User.plan)).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/username/{username}", response_model=UserSchema)
async def get_user_by_username(
    username: str,
    db: AsyncSession = Depends(get_db)
):
    query = select(User).options(selectinload(User.plan)).where(User.username == username)
    result = await db.execute(query)
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

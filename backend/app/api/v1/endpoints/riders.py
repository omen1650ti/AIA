from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.core.database import get_db
from app.models.insurance import Rider
from app.schemas.insurance import Rider as RiderSchema, RiderCreate, RiderUpdate

router = APIRouter()

@router.post("/", response_model=RiderSchema)
async def create_rider(
    rider: RiderCreate,
    db: AsyncSession = Depends(get_db)
):
    db_rider = Rider(**rider.model_dump())
    db.add(db_rider)
    await db.commit()
    await db.refresh(db_rider)
    return db_rider

@router.patch("/id/{rider_id}", response_model=RiderSchema)
async def update_rider(
    rider_id: int,
    rider_update: RiderUpdate,
    db: AsyncSession = Depends(get_db)
):
    db_rider = await db.get(Rider, rider_id)
    if not db_rider:
        raise HTTPException(status_code=404, detail="Rider not found")
    
    update_data = rider_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_rider, key, value)
    
    await db.commit()
    await db.refresh(db_rider)
    return db_rider

@router.get("/", response_model=List[RiderSchema])
async def get_all_riders(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    query = select(Rider).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/id/{rider_id}", response_model=RiderSchema)
async def get_rider_by_id(
    rider_id: int,
    db: AsyncSession = Depends(get_db)
):
    rider = await db.get(Rider, rider_id)
    if not rider:
        raise HTTPException(status_code=404, detail="Rider not found")
    return rider

@router.get("/name/{name}", response_model=RiderSchema)
async def get_rider_by_name(
    name: str,
    db: AsyncSession = Depends(get_db)
):
    query = select(Rider).where(Rider.rider_name == name)
    result = await db.execute(query)
    rider = result.scalars().first()
    if not rider:
        raise HTTPException(status_code=404, detail="Rider not found")
    return rider

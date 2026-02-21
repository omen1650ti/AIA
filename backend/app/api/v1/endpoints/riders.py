from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
import uuid

from app.core.database import get_db
from app.models.insurance import Rider, Plan
from app.schemas.insurance import Rider as RiderSchema, RiderCreate, RiderUpdate

router = APIRouter()

@router.post("/", response_model=RiderSchema)
async def create_rider(
    rider: RiderCreate,
    db: AsyncSession = Depends(get_db)
):
    # Robust validation: check if plan exists
    plan_check = await db.execute(select(Plan.id).where(Plan.id == rider.plan_id))
    if not plan_check.scalar():
        raise HTTPException(
            status_code=404, 
            detail=f"Insurance Plan with id {rider.plan_id} does not exist."
        )

    try:
        db_rider = Rider(**rider.model_dump())
        db.add(db_rider)
        await db.commit()
        await db.refresh(db_rider)
        return db_rider
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/id/{rider_id}", response_model=RiderSchema)
async def update_rider(
    rider_id: uuid.UUID,
    rider_update: RiderUpdate,
    db: AsyncSession = Depends(get_db)
):
    db_rider = await db.get(Rider, rider_id)
    if not db_rider:
        raise HTTPException(status_code=404, detail="Rider not found")
    
    update_data = rider_update.model_dump(exclude_unset=True)
    
    # Validate plan_id if it's being updated
    if "plan_id" in update_data:
        plan_check = await db.execute(select(Plan.id).where(Plan.id == update_data["plan_id"]))
        if not plan_check.scalar():
            raise HTTPException(
                status_code=404, 
                detail=f"Insurance Plan with id {update_data['plan_id']} does not exist."
            )

    try:
        for key, value in update_data.items():
            setattr(db_rider, key, value)
        
        await db.commit()
        await db.refresh(db_rider)
        return db_rider
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[RiderSchema])
async def get_all_riders(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    query = select(Rider).options(selectinload(Rider.plan)).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/id/{rider_id}", response_model=RiderSchema)
async def get_rider_by_id(
    rider_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    query = select(Rider).options(selectinload(Rider.plan)).where(Rider.id == rider_id)
    result = await db.execute(query)
    rider = result.scalars().first()
    if not rider:
        raise HTTPException(status_code=404, detail="Rider not found")
    return rider

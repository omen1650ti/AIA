from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
import uuid

from app.core.database import get_db
from app.models.insurance import Plan, Rider
from app.schemas.insurance import Plan as PlanSchema, PlanCreate, PlanUpdate, Rider as RiderSchema

router = APIRouter()

@router.post("/", response_model=PlanSchema)
async def create_plan(
    plan: PlanCreate,
    db: AsyncSession = Depends(get_db)
):
    db_plan = Plan(**plan.model_dump())
    db.add(db_plan)
    await db.commit()
    
    # Re-query with eager loading to avoid MissingGreenlet error during serialization
    query = select(Plan).options(selectinload(Plan.riders)).where(Plan.id == db_plan.id)
    result = await db.execute(query)
    return result.scalars().first()

@router.patch("/id/{plan_id}", response_model=PlanSchema)
async def update_plan(
    plan_id: uuid.UUID,
    plan_update: PlanUpdate,
    db: AsyncSession = Depends(get_db)
):
    db_plan = await db.get(Plan, plan_id)
    if not db_plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    update_data = plan_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_plan, key, value)
    
    await db.commit()
    
    # Re-query with eager loading to avoid MissingGreenlet error during serialization
    query = select(Plan).options(selectinload(Plan.riders)).where(Plan.id == db_plan.id)
    result = await db.execute(query)
    return result.scalars().first()

@router.get("/", response_model=List[PlanSchema])
async def get_all_plans(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    query = select(Plan).options(selectinload(Plan.riders)).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/id/{plan_id}", response_model=PlanSchema)
async def get_plan_by_id(
    plan_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    query = select(Plan).options(selectinload(Plan.riders)).where(Plan.id == plan_id)
    result = await db.execute(query)
    plan = result.scalars().first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan

@router.get("/name/{name}", response_model=PlanSchema)
async def get_plan_by_name(
    name: str,
    db: AsyncSession = Depends(get_db)
):
    query = select(Plan).options(selectinload(Plan.riders)).where(Plan.name == name)
    result = await db.execute(query)
    plan = result.scalars().first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan
@router.get("/id/{plan_id}/riders", response_model=List[RiderSchema])
async def get_plan_riders(
    plan_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    query = select(Rider).where(Rider.plan_id == plan_id)
    result = await db.execute(query)
    riders = result.scalars().all()
    if not riders:
        # Check if plan exists to distinguish between "no riders" and "plan not found"
        plan = await db.get(Plan, plan_id)
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
    return riders

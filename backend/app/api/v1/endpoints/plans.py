from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.core.database import get_db
from app.models.insurance import Plan
from app.schemas.insurance import Plan as PlanSchema, PlanCreate, PlanUpdate

router = APIRouter()

@router.post("/", response_model=PlanSchema)
async def create_plan(
    plan: PlanCreate,
    db: AsyncSession = Depends(get_db)
):
    db_plan = Plan(**plan.model_dump())
    db.add(db_plan)
    await db.commit()
    await db.refresh(db_plan)
    return db_plan

@router.patch("/id/{plan_id}", response_model=PlanSchema)
async def update_plan(
    plan_id: int,
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
    await db.refresh(db_plan)
    return db_plan

@router.get("/", response_model=List[PlanSchema])
async def get_all_plans(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    query = select(Plan).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/id/{plan_id}", response_model=PlanSchema)
async def get_plan_by_id(
    plan_id: int,
    db: AsyncSession = Depends(get_db)
):
    plan = await db.get(Plan, plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan

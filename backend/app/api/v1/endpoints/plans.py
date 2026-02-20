from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, asc
from sqlalchemy.orm import selectinload
from typing import List, Optional
import uuid

from app.core.database import get_db
from app.models.insurance import Plan, Rider
from app.schemas.insurance import Plan as PlanSchema, PlanCreate, PlanUpdate, Rider as RiderSchema

router = APIRouter()

@router.get("/", response_model=List[PlanSchema])
async def get_all_plans(
    skip: int = 0,
    limit: int = 100,
    plan_name: Optional[str] = None,
    room_rent_type: Optional[str] = None,
    min_waiting_period: Optional[int] = None,
    max_waiting_period: Optional[int] = None,
    min_ncb: Optional[float] = None,
    max_ncb: Optional[float] = None,
    min_child_age: Optional[int] = None,
    max_child_age: Optional[int] = None,
    min_claim_settlement: Optional[float] = None,
    min_cashless_hospitals: Optional[int] = None,
    # Feature flags
    free_checkup: Optional[bool] = None,
    maternity_cover: Optional[bool] = None,
    ayush: Optional[bool] = None,
    air_evacuation: Optional[bool] = None,
    home_hospitalization: Optional[bool] = None,
    e_consultation: Optional[bool] = None,
    baby_addition: Optional[bool] = None,
    newborn_baby_cover: Optional[bool] = None,
    daily_cash_allowance: Optional[bool] = None,
    animal_bite_vaccination: Optional[bool] = None,
    # Sorting
    sort_by: Optional[str] = Query(None, enum=["waiting_period", "ncb", "child_age", "claim_settlement", "cashless_hospitals", "plan_name"]),
    sort_order: str = Query("asc", enum=["asc", "desc"]),
    db: AsyncSession = Depends(get_db)
):
    query = select(Plan).options(selectinload(Plan.riders))

    # --- Filtering ---
    if plan_name:
        query = query.where(Plan.name.ilike(f"%{plan_name}%"))
    
    if room_rent_type:
        query = query.where(Plan.jsonb_data['room_rent_type'].as_string() == room_rent_type)
    
    if min_waiting_period is not None:
        query = query.where(Plan.jsonb_data['existing_waiting_period_yrs'].as_integer() >= min_waiting_period)
    if max_waiting_period is not None:
        query = query.where(Plan.jsonb_data['existing_waiting_period_yrs'].as_integer() <= max_waiting_period)
        
    if min_ncb is not None:
        query = query.where(Plan.jsonb_data['ncb_percent_per_year'].as_float() >= min_ncb)
    if max_ncb is not None:
        query = query.where(Plan.jsonb_data['ncb_percent_per_year'].as_float() <= max_ncb)

    if min_child_age is not None:
        query = query.where(Plan.jsonb_data['max_child_age'].as_integer() >= min_child_age)
    if max_child_age is not None:
        query = query.where(Plan.jsonb_data['max_child_age'].as_integer() <= max_child_age)

    if min_claim_settlement is not None:
        query = query.where(Plan.jsonb_data['claim_settlement_ratio_percent'].as_float() >= min_claim_settlement)

    if min_cashless_hospitals is not None:
        query = query.where(Plan.jsonb_data['cashless_hospitals'].as_integer() >= min_cashless_hospitals)

    # Features Filtering
    feature_map = {
        "free_checkup": free_checkup,
        "maternity_cover": maternity_cover,
        "ayush": ayush,
        "air_evacuation": air_evacuation,
        "home_hospitalization": home_hospitalization,
        "e_consultation": e_consultation,
        "baby_addition_to_policy": baby_addition,
        "newborn_baby_cover": newborn_baby_cover,
        "daily_cash_allowance": daily_cash_allowance,
        "animal_bite_vaccination": animal_bite_vaccination
    }
    
    for feature_key, val in feature_map.items():
        if val is not None:
            query = query.where(
                Plan.jsonb_data['features'][feature_key].as_boolean() == val
            )

    # --- Sorting ---
    if sort_by:
        sort_attr = None
        if sort_by == "waiting_period":
            sort_attr = Plan.jsonb_data['existing_waiting_period_yrs'].as_integer()
        elif sort_by == "ncb":
            sort_attr = Plan.jsonb_data['ncb_percent_per_year'].as_float()
        elif sort_by == "child_age":
            sort_attr = Plan.jsonb_data['max_child_age'].as_integer()
        elif sort_by == "claim_settlement":
            sort_attr = Plan.jsonb_data['claim_settlement_ratio_percent'].as_float()
        elif sort_by == "cashless_hospitals":
            sort_attr = Plan.jsonb_data['cashless_hospitals'].as_integer()
        elif sort_by == "plan_name":
            sort_attr = Plan.name

        if sort_attr is not None:
            if sort_order == "desc":
                query = query.order_by(desc(sort_attr))
            else:
                query = query.order_by(asc(sort_attr))

    query = query.offset(skip).limit(limit)
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
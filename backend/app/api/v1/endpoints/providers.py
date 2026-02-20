from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
import uuid

from app.core.database import get_db
from app.models.insurance import InsuranceProvider, Plan
from app.schemas.insurance import Provider as ProviderSchema, ProviderCreate, ProviderUpdate

router = APIRouter()

@router.post("/", response_model=ProviderSchema)
async def create_provider(
    provider: ProviderCreate,
    db: AsyncSession = Depends(get_db)
):
    db_provider = InsuranceProvider(**provider.model_dump())
    db.add(db_provider)
    await db.commit()
    
    # Re-query with eager loading to avoid MissingGreenlet error during serialization
    query = select(InsuranceProvider).options(
        selectinload(InsuranceProvider.plans).selectinload(Plan.riders)
    ).where(InsuranceProvider.id == db_provider.id)
    result = await db.execute(query)
    return result.scalars().first()

@router.patch("/id/{provider_id}", response_model=ProviderSchema)
async def update_provider(
    provider_id: uuid.UUID,
    provider_update: ProviderUpdate,
    db: AsyncSession = Depends(get_db)
):
    db_provider = await db.get(InsuranceProvider, provider_id)
    if not db_provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    update_data = provider_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_provider, key, value)
    
    await db.commit()
    
    # Re-query with eager loading to avoid MissingGreenlet error during serialization
    query = select(InsuranceProvider).options(
        selectinload(InsuranceProvider.plans).selectinload(Plan.riders)
    ).where(InsuranceProvider.id == db_provider.id)
    result = await db.execute(query)
    return result.scalars().first()

@router.get("/", response_model=List[ProviderSchema])
async def get_all_providers(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    query = select(InsuranceProvider).options(
        selectinload(InsuranceProvider.plans).selectinload(Plan.riders)
    ).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/id/{provider_id}", response_model=ProviderSchema)
async def get_provider_by_id(
    provider_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    query = select(InsuranceProvider).options(
        selectinload(InsuranceProvider.plans).selectinload(Plan.riders)
    ).where(InsuranceProvider.id == provider_id)
    result = await db.execute(query)
    provider = result.scalars().first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    return provider

@router.get("/name/{name}", response_model=ProviderSchema)
async def get_provider_by_name(
    name: str,
    db: AsyncSession = Depends(get_db)
):
    query = select(InsuranceProvider).options(
        selectinload(InsuranceProvider.plans).selectinload(Plan.riders)
    ).where(InsuranceProvider.name == name)
    result = await db.execute(query)
    provider = result.scalars().first()
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    return provider

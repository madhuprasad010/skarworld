from typing import Optional, List
from pydantic import BaseModel
from datetime import date, datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_auth, AuthContext
from app.models.opportunity import Opportunity
from app.schemas.common import ApiResponse, MessageResponse

router = APIRouter(prefix="/opportunities", tags=["Pipeline & Opportunities"])


class OpportunityCreate(BaseModel):
    title: str
    lead_id: str
    value: float
    currency: str = "USD"
    stage: str = "discovery"
    win_probability: int = 50
    expected_close_date: date
    assigned_to: Optional[str] = None
    notes: Optional[str] = None


class OpportunityUpdate(BaseModel):
    title: Optional[str] = None
    value: Optional[float] = None
    stage: Optional[str] = None
    win_probability: Optional[int] = None
    expected_close_date: Optional[date] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None


class OpportunityResponse(BaseModel):
    id: str
    tenant_id: str
    title: str
    lead_id: str
    value: float
    currency: str
    stage: str
    win_probability: int
    expected_close_date: date
    assigned_to: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime


@router.get("", response_model=ApiResponse[List[OpportunityResponse]])
async def list_opportunities(
    stage: Optional[str] = None,
    auth: AuthContext = Depends(get_current_auth),
    db: AsyncSession = Depends(get_db),
):
    query = select(Opportunity).where(Opportunity.tenant_id == auth.tenant_id)
    if stage and stage != "all":
        query = query.where(Opportunity.stage == stage)

    result = await db.execute(query.order_by(Opportunity.created_at.desc()))
    opps = result.scalars().all()
    return ApiResponse(
        data=[OpportunityResponse.model_validate(o, from_attributes=True) for o in opps]
    )


@router.post("", response_model=OpportunityResponse, status_code=status.HTTP_201_CREATED)
async def create_opportunity(
    opp_in: OpportunityCreate,
    auth: AuthContext = Depends(get_current_auth),
    db: AsyncSession = Depends(get_db),
):
    opp = Opportunity(
        **opp_in.model_dump(),
        tenant_id=auth.tenant_id,
    )
    db.add(opp)
    await db.commit()
    await db.refresh(opp)
    return OpportunityResponse.model_validate(opp, from_attributes=True)


@router.patch("/{opp_id}/stage", response_model=OpportunityResponse)
async def update_opportunity_stage(
    opp_id: str,
    stage: str = Query(...),
    auth: AuthContext = Depends(get_current_auth),
    db: AsyncSession = Depends(get_db),
):
    query = select(Opportunity).where(Opportunity.id == opp_id, Opportunity.tenant_id == auth.tenant_id)
    result = await db.execute(query)
    opp = result.scalar_one_or_none()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    opp.stage = stage
    await db.commit()
    await db.refresh(opp)
    return OpportunityResponse.model_validate(opp, from_attributes=True)

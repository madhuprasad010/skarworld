from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_auth, AuthContext
from app.models.lead import Lead
from app.schemas.leads import LeadCreate, LeadUpdate, LeadResponse
from app.schemas.common import ApiResponse, ResponseMeta, MessageResponse

router = APIRouter(prefix="/leads", tags=["Leads"])


@router.get("", response_model=ApiResponse[List[LeadResponse]])
async def list_leads(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None,
    source: Optional[str] = None,
    industry: Optional[str] = None,
    auth: AuthContext = Depends(get_current_auth),
    db: AsyncSession = Depends(get_db),
):
    query = select(Lead).where(Lead.tenant_id == auth.tenant_id)

    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            or_(
                Lead.first_name.ilike(search_pattern),
                Lead.last_name.ilike(search_pattern),
                Lead.company.ilike(search_pattern),
                Lead.email.ilike(search_pattern),
            )
        )

    if status and status != "all":
        query = query.where(Lead.status == status)

    if source and source != "all":
        query = query.where(Lead.source == source)

    if industry and industry != "all":
        query = query.where(Lead.industry == industry)

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_res = await db.execute(count_query)
    total = total_res.scalar() or 0

    # Paginate
    query = query.order_by(Lead.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    leads = result.scalars().all()

    total_pages = max(1, (total + per_page - 1) // per_page)
    meta = ResponseMeta(page=page, per_page=per_page, total=total, total_pages=total_pages)

    return ApiResponse(
        data=[LeadResponse.model_validate(l, from_attributes=True) for l in leads],
        meta=meta,
    )


@router.post("", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
async def create_lead(
    lead_in: LeadCreate,
    auth: AuthContext = Depends(get_current_auth),
    db: AsyncSession = Depends(get_db),
):
    lead = Lead(
        **lead_in.model_dump(),
        tenant_id=auth.tenant_id,
    )
    db.add(lead)
    await db.commit()
    await db.refresh(lead)
    return LeadResponse.model_validate(lead, from_attributes=True)


@router.get("/{lead_id}", response_model=LeadResponse)
async def get_lead(
    lead_id: str,
    auth: AuthContext = Depends(get_current_auth),
    db: AsyncSession = Depends(get_db),
):
    query = select(Lead).where(Lead.id == lead_id, Lead.tenant_id == auth.tenant_id)
    result = await db.execute(query)
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return LeadResponse.model_validate(lead, from_attributes=True)


@router.put("/{lead_id}", response_model=LeadResponse)
async def update_lead(
    lead_id: str,
    lead_in: LeadUpdate,
    auth: AuthContext = Depends(get_current_auth),
    db: AsyncSession = Depends(get_db),
):
    query = select(Lead).where(Lead.id == lead_id, Lead.tenant_id == auth.tenant_id)
    result = await db.execute(query)
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    update_data = lead_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(lead, field, value)

    await db.commit()
    await db.refresh(lead)
    return LeadResponse.model_validate(lead, from_attributes=True)


@router.delete("/{lead_id}", response_model=MessageResponse)
async def delete_lead(
    lead_id: str,
    auth: AuthContext = Depends(get_current_auth),
    db: AsyncSession = Depends(get_db),
):
    query = select(Lead).where(Lead.id == lead_id, Lead.tenant_id == auth.tenant_id)
    result = await db.execute(query)
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    await db.delete(lead)
    await db.commit()
    return MessageResponse(message="Lead deleted successfully")

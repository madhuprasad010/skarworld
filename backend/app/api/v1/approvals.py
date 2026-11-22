from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_auth, AuthContext
from app.models.approval import Approval
from app.schemas.common import ApiResponse, MessageResponse

router = APIRouter(prefix="/approvals", tags=["Deal Approvals & Governance"])


class ApprovalDecision(BaseModel):
    decision: str  # approved, rejected, changes_requested
    comments: Optional[str] = None
    modified_terms: Optional[str] = None


class ApprovalResponse(BaseModel):
    id: str
    tenant_id: str
    type: str
    status: str
    customer: str
    opportunity: Optional[str] = None
    requested_action: str
    proposed_terms: str
    estimated_value: float
    currency: str
    requested_by: str
    deadline: Optional[datetime] = None
    conversation_context: Optional[str] = None
    ai_recommendation: Optional[Dict[str, Any]] = None
    decided_by: Optional[str] = None
    decided_at: Optional[datetime] = None
    decision_notes: Optional[str] = None
    audit_trail: List[Dict[str, Any]] = []
    created_at: datetime
    updated_at: datetime


@router.get("", response_model=ApiResponse[List[ApprovalResponse]])
async def list_approvals(
    status: Optional[str] = None,
    auth: AuthContext = Depends(get_current_auth),
    db: AsyncSession = Depends(get_db),
):
    query = select(Approval).where(Approval.tenant_id == auth.tenant_id)
    if status and status != "all":
        query = query.where(Approval.status == status)

    result = await db.execute(query.order_by(Approval.created_at.desc()))
    approvals = result.scalars().all()
    return ApiResponse(
        data=[ApprovalResponse.model_validate(a, from_attributes=True) for a in approvals]
    )


@router.post("/{approval_id}/decide", response_model=ApprovalResponse)
async def decide_approval(
    approval_id: str,
    decision_in: ApprovalDecision,
    auth: AuthContext = Depends(get_current_auth),
    db: AsyncSession = Depends(get_db),
):
    query = select(Approval).where(Approval.id == approval_id, Approval.tenant_id == auth.tenant_id)
    result = await db.execute(query)
    approval = result.scalar_one_or_none()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")

    approval.status = decision_in.decision
    approval.decided_by = auth.user_id
    approval.decided_at = datetime.now(timezone.utc)
    approval.decision_notes = decision_in.comments

    # Append to audit trail
    trail = list(approval.audit_trail or [])
    trail.append({
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "action": f"decision_{decision_in.decision}",
        "actor": auth.user_id,
        "role": auth.role,
        "notes": decision_in.comments,
    })
    approval.audit_trail = trail

    await db.commit()
    await db.refresh(approval)
    return ApprovalResponse.model_validate(approval, from_attributes=True)

from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.dependencies import get_current_auth, AuthContext
from app.schemas.common import ApiResponse, MessageResponse

router = APIRouter(prefix="/campaigns", tags=["Outbound Campaigns"])


class CampaignCreate(BaseModel):
    name: str
    description: Optional[str] = None
    type: str = "email"
    target_audience: Optional[str] = None
    objectives: Optional[str] = None
    message_template: Optional[str] = None


@router.get("")
async def list_campaigns(auth: AuthContext = Depends(get_current_auth)):
    return ApiResponse(
        data=[
            {
                "id": "camp-1",
                "name": "Q4 Enterprise AI Outreach",
                "status": "active",
                "channels": ["email", "whatsapp"],
                "sent": 1450,
                "delivered": 1420,
                "opened": 890,
                "clicked": 420,
                "converted": 68,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        ]
    )


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_campaign(
    camp_in: CampaignCreate,
    auth: AuthContext = Depends(get_current_auth),
):
    return ApiResponse(
        data={
            "id": f"camp-{datetime.now().timestamp()}",
            "tenant_id": auth.tenant_id,
            "status": "draft",
            **camp_in.model_dump(),
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
    )

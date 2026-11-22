from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_auth, AuthContext
from app.schemas.common import ApiResponse, MessageResponse

router = APIRouter(prefix="/settings", tags=["Workspace Settings & Audit"])


@router.get("/profile")
async def get_workspace_profile(auth: AuthContext = Depends(get_current_auth)):
    return ApiResponse(
        data={
            "name": "Skarworld Enterprise",
            "industry": "B2B SaaS & Automation",
            "website": "https://skarworld.com",
            "currency": "USD",
            "timezone": "America/New_York",
            "tenant_id": auth.tenant_id,
        }
    )


@router.get("/audit-log")
async def get_audit_log(auth: AuthContext = Depends(get_current_auth)):
    return ApiResponse(
        data=[
            {
                "id": "log-1",
                "timestamp": "2026-11-22T18:00:00Z",
                "user": "Alex Rivera",
                "action": "API Key Regenerated",
                "resource": "API Gateway",
                "details": "Triggered via security admin console",
            }
        ]
    )

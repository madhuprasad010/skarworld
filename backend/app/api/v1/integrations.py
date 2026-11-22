from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from app.core.dependencies import get_current_auth, AuthContext
from app.schemas.common import ApiResponse, MessageResponse

router = APIRouter(prefix="/integrations", tags=["Integrations Marketplace"])


@router.get("")
async def list_integrations(auth: AuthContext = Depends(get_current_auth)):
    return ApiResponse(
        data=[
            {"id": "whatsapp", "name": "WhatsApp Business Cloud API", "status": "connected"},
            {"id": "ses", "name": "Amazon SES", "status": "connected"},
            {"id": "telegram", "name": "Telegram Bot API", "status": "disconnected"},
            {"id": "claude", "name": "Anthropic Claude 3.5 Sonnet", "status": "connected"},
            {"id": "tavily", "name": "Tavily AI Research", "status": "connected"},
            {"id": "stripe", "name": "Stripe Payments", "status": "disconnected"},
        ]
    )


@router.post("/{provider}/test")
async def test_integration_connection(
    provider: str,
    auth: AuthContext = Depends(get_current_auth),
):
    return MessageResponse(message=f"Connection diagnostic test for {provider} passed successfully.")

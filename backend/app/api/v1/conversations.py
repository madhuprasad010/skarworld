from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.dependencies import get_current_auth, AuthContext
from app.schemas.common import ApiResponse, MessageResponse

router = APIRouter(prefix="/conversations", tags=["Conversations & Inbox"])


class MessageCreate(BaseModel):
    content: str
    channel: Optional[str] = None
    is_internal_note: bool = False


@router.get("")
async def list_conversations(
    channel: Optional[str] = None,
    auth: AuthContext = Depends(get_current_auth),
):
    # Returns list of active conversations scoped to tenant
    return ApiResponse(
        data=[
            {
                "id": "conv-1",
                "tenant_id": auth.tenant_id,
                "lead_id": "lead-1",
                "contact_name": "Sarah Jenkins",
                "channel": "whatsapp",
                "unread_count": 1,
                "status": "active",
                "last_message": "Can you share the pricing sheet for enterprise?",
                "last_interaction": datetime.now(timezone.utc).isoformat(),
            }
        ]
    )


@router.post("/{conversation_id}/messages")
async def send_message(
    conversation_id: str,
    msg: MessageCreate,
    auth: AuthContext = Depends(get_current_auth),
):
    return ApiResponse(
        data={
            "id": f"msg-{datetime.now().timestamp()}",
            "conversation_id": conversation_id,
            "sender_type": "user",
            "content": msg.content,
            "channel": msg.channel or "web_chat",
            "is_internal_note": msg.is_internal_note,
            "status": "sent",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
    )

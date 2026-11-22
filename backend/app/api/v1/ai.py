from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from app.core.config import settings
from app.core.dependencies import get_current_auth, AuthContext
from app.schemas.common import ApiResponse

router = APIRouter(prefix="/ai", tags=["Claude AI Engine"])


class AIChatTest(BaseModel):
    message: str
    system_prompt: Optional[str] = None


@router.get("/config")
async def get_ai_config(auth: AuthContext = Depends(get_current_auth)):
    return ApiResponse(
        data={
            "agent_name": "SkarAgent Prime",
            "personality": "professional",
            "communication_style": "Authoritative yet consultative enterprise sales advisor",
            "languages": ["en"],
            "enable_research": True,
            "enable_qualification": True,
            "enable_scoring": True,
            "enable_conversation": True,
            "require_human_approval": True,
        }
    )


@router.post("/chat")
async def test_ai_agent(
    req: AIChatTest,
    auth: AuthContext = Depends(get_current_auth),
):
    # If ANTHROPIC_API_KEY is configured, can execute live Claude; otherwise returns structured simulated AI response
    if settings.ANTHROPIC_API_KEY:
        try:
            import anthropic
            client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
            message = await client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                messages=[{"role": "user", "content": req.message}],
                system=req.system_prompt or "You are an autonomous B2B Revenue AI Agent for SKARWORLD REVENUE OS."
            )
            reply = message.content[0].text
            return ApiResponse(data={"reply": reply, "model": "claude-3-5-sonnet", "tokens": message.usage.output_tokens})
        except Exception as e:
            return ApiResponse(data={"reply": f"AI Engine Notice: {str(e)}", "model": "fallback"})

    # Deterministic simulated reply for test playground
    return ApiResponse(
        data={
            "reply": f"Hello! As your SKARWORLD AI Revenue Agent, I analyzed your inquiry regarding '{req.message}'. Our autonomous lead qualification and proposal engines are ready to assist. How would you like to proceed with your revenue target?",
            "model": "claude-3-5-sonnet-simulated",
            "confidence": 0.96,
        }
    )

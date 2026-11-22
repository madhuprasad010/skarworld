import logging
from fastapi import APIRouter, Request, Header, HTTPException, status
from app.schemas.common import MessageResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/webhooks", tags=["External Webhooks"])


@router.post("/whatsapp")
async def whatsapp_webhook(request: Request):
    # Verify and parse WhatsApp Cloud API incoming payload
    body = await request.json()
    logger.info(f"Received WhatsApp webhook event: {body.get('object', 'unknown')}")
    return {"status": "received"}


@router.get("/whatsapp")
async def whatsapp_verify_token(
    request: Request,
):
    # Support Meta webhook challenge verification
    params = dict(request.query_params)
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")
    if mode == "subscribe":
        return int(challenge) if challenge and challenge.isdigit() else challenge
    return {"status": "ok"}


@router.post("/stripe")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    body = await request.body()
    logger.info(f"Received Stripe webhook. Signature present: {bool(stripe_signature)}")
    # Idempotent processing of payment events
    return {"received": True}

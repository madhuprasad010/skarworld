from sqlalchemy import Column, String, Numeric, DateTime, JSON, Text
from app.core.database import Base
from app.models.base import TimestampMixin, TenantScopedMixin, generate_uuid


class Approval(Base, TimestampMixin, TenantScopedMixin):
    __tablename__ = "approvals"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    type = Column(String(50), nullable=False)
    status = Column(String(20), default="pending", nullable=False, index=True)
    customer = Column(String(255), nullable=False)
    opportunity_id = Column(String(64), nullable=True)
    opportunity = Column(String(255), nullable=True)
    requested_action = Column(Text, nullable=False)
    proposed_terms = Column(Text, nullable=False)
    estimated_value = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(10), default="USD", nullable=False)
    requested_by = Column(String(255), nullable=False)
    deadline = Column(DateTime(timezone=True), nullable=True)
    conversation_context = Column(Text, nullable=True)
    ai_recommendation = Column(JSON, nullable=True)
    decided_by = Column(String(255), nullable=True)
    decided_at = Column(DateTime(timezone=True), nullable=True)
    decision_notes = Column(Text, nullable=True)
    audit_trail = Column(JSON, default=list, nullable=False)

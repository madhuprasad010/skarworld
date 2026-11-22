from sqlalchemy import Column, String, Integer, DateTime, JSON, Text
from app.core.database import Base
from app.models.base import TimestampMixin, TenantScopedMixin, generate_uuid


class Lead(Base, TimestampMixin, TenantScopedMixin):
    __tablename__ = "leads"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=True, index=True)
    phone = Column(String(50), nullable=True)
    company = Column(String(255), nullable=True, index=True)
    job_title = Column(String(150), nullable=True)
    website = Column(String(255), nullable=True)
    industry = Column(String(100), nullable=True)
    location = Column(String(150), nullable=True)
    source = Column(String(50), default="website", nullable=False)
    status = Column(String(50), default="new", nullable=False, index=True)
    stage = Column(String(50), default="new", nullable=False)
    score = Column(Integer, default=50, nullable=False)
    score_trend = Column(String(10), default="neutral", nullable=False)
    assigned_to = Column(String(64), nullable=True)
    tags = Column(JSON, default=list, nullable=False)
    notes = Column(Text, nullable=True)
    last_interaction = Column(DateTime(timezone=True), nullable=True)
    next_follow_up = Column(DateTime(timezone=True), nullable=True)
    ai_research = Column(JSON, nullable=True)

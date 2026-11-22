from sqlalchemy import Column, String, DateTime, Text, Boolean
from app.core.database import Base
from app.models.base import TimestampMixin, TenantScopedMixin, generate_uuid


class Task(Base, TimestampMixin, TenantScopedMixin):
    __tablename__ = "tasks"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(String(50), default="follow_up", nullable=False)
    priority = Column(String(20), default="medium", nullable=False)
    status = Column(String(20), default="pending", nullable=False, index=True)
    due_date = Column(DateTime(timezone=True), nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    lead_id = Column(String(64), nullable=True, index=True)
    assigned_to = Column(String(64), nullable=True)

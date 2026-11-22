from sqlalchemy import Column, String, Numeric, Integer, Date, Text
from app.core.database import Base
from app.models.base import TimestampMixin, TenantScopedMixin, generate_uuid


class Opportunity(Base, TimestampMixin, TenantScopedMixin):
    __tablename__ = "opportunities"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    lead_id = Column(String(64), nullable=False, index=True)
    value = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(10), default="USD", nullable=False)
    stage = Column(String(50), default="discovery", nullable=False, index=True)
    win_probability = Column(Integer, default=50, nullable=False)
    expected_close_date = Column(Date, nullable=False)
    assigned_to = Column(String(64), nullable=True)
    notes = Column(Text, nullable=True)

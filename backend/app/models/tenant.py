from sqlalchemy import Column, String, Boolean, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class Tenant(Base, TimestampMixin):
    __tablename__ = "tenants"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    domain = Column(String(255), nullable=True)
    industry = Column(String(100), nullable=True)
    currency = Column(String(10), default="USD", nullable=False)
    timezone = Column(String(50), default="UTC", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    settings = Column(JSON, default=dict, nullable=False)

    users = relationship("User", back_populates="tenant", cascade="all, delete-orphan")

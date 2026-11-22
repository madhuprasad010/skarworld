from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin, TenantScopedMixin, generate_uuid


class User(Base, TimestampMixin, TenantScopedMixin):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(50), default="sales_rep", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    avatar_url = Column(String(512), nullable=True)

    tenant_id = Column(String(64), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    tenant = relationship("Tenant", back_populates="users")

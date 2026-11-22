from sqlalchemy import Column, String, Numeric, Boolean, JSON, Text
from app.core.database import Base
from app.models.base import TimestampMixin, TenantScopedMixin, generate_uuid


class Product(Base, TimestampMixin, TenantScopedMixin):
    __tablename__ = "products"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    sku = Column(String(100), nullable=True)
    category = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    pricing_model = Column(String(50), default="monthly", nullable=False)
    price = Column(Numeric(12, 2), nullable=True)
    currency = Column(String(10), default="USD", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    features = Column(JSON, default=list, nullable=False)
    faqs = Column(JSON, default=list, nullable=False)
    ai_instructions = Column(Text, nullable=True)

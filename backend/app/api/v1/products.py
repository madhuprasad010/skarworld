from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_auth, AuthContext
from app.models.product import Product
from app.schemas.common import ApiResponse, MessageResponse

router = APIRouter(prefix="/products", tags=["Products & Offerings"])


class ProductCreate(BaseModel):
    name: str
    sku: Optional[str] = None
    category: str
    description: Optional[str] = None
    pricing_model: str = "monthly"
    price: Optional[float] = None
    currency: str = "USD"
    is_active: bool = True
    features: List[str] = []
    faqs: List[Dict[str, str]] = []
    ai_instructions: Optional[str] = None


class ProductResponse(BaseModel):
    id: str
    tenant_id: str
    name: str
    sku: Optional[str] = None
    category: str
    description: Optional[str] = None
    pricing_model: str
    price: Optional[float] = None
    currency: str
    is_active: bool
    features: List[str]
    faqs: List[Dict[str, str]]
    ai_instructions: Optional[str] = None
    created_at: datetime
    updated_at: datetime


@router.get("", response_model=ApiResponse[List[ProductResponse]])
async def list_products(
    category: Optional[str] = None,
    auth: AuthContext = Depends(get_current_auth),
    db: AsyncSession = Depends(get_db),
):
    query = select(Product).where(Product.tenant_id == auth.tenant_id)
    if category and category != "all":
        query = query.where(Product.category == category)

    result = await db.execute(query.order_by(Product.name.asc()))
    products = result.scalars().all()
    return ApiResponse(
        data=[ProductResponse.model_validate(p, from_attributes=True) for p in products]
    )


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    prod_in: ProductCreate,
    auth: AuthContext = Depends(get_current_auth),
    db: AsyncSession = Depends(get_db),
):
    product = Product(
        **prod_in.model_dump(),
        tenant_id=auth.tenant_id,
    )
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return ProductResponse.model_validate(product, from_attributes=True)

from typing import Generic, TypeVar, Optional, List
from pydantic import BaseModel

T = TypeVar("T")


class ResponseMeta(BaseModel):
    page: int = 1
    per_page: int = 20
    total: int = 0
    total_pages: int = 1


class ApiResponse(BaseModel, Generic[T]):
    data: T
    meta: Optional[ResponseMeta] = None


class MessageResponse(BaseModel):
    message: str
    success: bool = True

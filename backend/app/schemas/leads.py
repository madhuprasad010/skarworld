from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr


class LeadCreate(BaseModel):
    first_name: str
    last_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    source: str = "website"
    status: str = "new"
    stage: str = "new"
    tags: List[str] = []
    notes: Optional[str] = None
    assigned_to: Optional[str] = None


class LeadUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    source: Optional[str] = None
    status: Optional[str] = None
    stage: Optional[str] = None
    score: Optional[int] = None
    tags: Optional[List[str]] = None
    notes: Optional[str] = None
    assigned_to: Optional[str] = None


class LeadResponse(BaseModel):
    id: str
    tenant_id: str
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    source: str
    status: str
    stage: str
    score: int
    score_trend: str
    tags: List[str]
    notes: Optional[str] = None
    assigned_to: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    last_interaction: Optional[datetime] = None
    next_follow_up: Optional[datetime] = None
    ai_research: Optional[Dict[str, Any]] = None

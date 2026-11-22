from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_auth, AuthContext
from app.models.task import Task
from app.schemas.common import ApiResponse, MessageResponse

router = APIRouter(prefix="/tasks", tags=["Tasks"])


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    type: str = "follow_up"
    priority: str = "medium"
    due_date: datetime
    lead_id: Optional[str] = None
    assigned_to: Optional[str] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[datetime] = None
    completed: Optional[bool] = None
    assigned_to: Optional[str] = None


class TaskResponse(BaseModel):
    id: str
    tenant_id: str
    title: str
    description: Optional[str] = None
    type: str
    priority: str
    status: str
    due_date: datetime
    completed: bool
    lead_id: Optional[str] = None
    assigned_to: Optional[str] = None
    created_at: datetime
    updated_at: datetime


@router.get("", response_model=ApiResponse[List[TaskResponse]])
async def list_tasks(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    auth: AuthContext = Depends(get_current_auth),
    db: AsyncSession = Depends(get_db),
):
    query = select(Task).where(Task.tenant_id == auth.tenant_id)
    if status and status != "all":
        query = query.where(Task.status == status)
    if priority and priority != "all":
        query = query.where(Task.priority == priority)

    result = await db.execute(query.order_by(Task.due_date.asc()))
    tasks = result.scalars().all()
    return ApiResponse(
        data=[TaskResponse.model_validate(t, from_attributes=True) for t in tasks]
    )


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_in: TaskCreate,
    auth: AuthContext = Depends(get_current_auth),
    db: AsyncSession = Depends(get_db),
):
    task = Task(
        **task_in.model_dump(),
        tenant_id=auth.tenant_id,
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return TaskResponse.model_validate(task, from_attributes=True)


@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def toggle_task_complete(
    task_id: str,
    completed: bool = Query(...),
    auth: AuthContext = Depends(get_current_auth),
    db: AsyncSession = Depends(get_db),
):
    query = select(Task).where(Task.id == task_id, Task.tenant_id == auth.tenant_id)
    result = await db.execute(query)
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.completed = completed
    task.status = "completed" if completed else "pending"
    await db.commit()
    await db.refresh(task)
    return TaskResponse.model_validate(task, from_attributes=True)


@router.delete("/{task_id}", response_model=MessageResponse)
async def delete_task(
    task_id: str,
    auth: AuthContext = Depends(get_current_auth),
    db: AsyncSession = Depends(get_db),
):
    query = select(Task).where(Task.id == task_id, Task.tenant_id == auth.tenant_id)
    result = await db.execute(query)
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    await db.delete(task)
    await db.commit()
    return MessageResponse(message="Task deleted")

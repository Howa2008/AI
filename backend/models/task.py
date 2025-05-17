"""Task models for the Omnia AI platform."""
from datetime import datetime
from typing import Dict, List, Optional, Union, Any
from enum import Enum
from pydantic import BaseModel, Field, validator
from .base import BaseDBModel


class TaskStatus(str, Enum):
    """Status values for tasks."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class TaskPriority(int, Enum):
    """Priority levels for tasks."""
    LOW = 0
    MEDIUM = 1
    HIGH = 2
    CRITICAL = 3


class TaskCreate(BaseModel):
    """Task creation model."""
    title: str
    description: str
    inputs: Dict[str, Any] = {}
    agent_id: str
    priority: TaskPriority = TaskPriority.MEDIUM
    user_id: str


class TaskResponse(BaseDBModel):
    """Task response model."""
    title: str
    description: str
    inputs: Dict[str, Any] = {}
    outputs: Dict[str, Any] = {}
    agent_id: str
    status: TaskStatus = TaskStatus.PENDING
    priority: TaskPriority = TaskPriority.MEDIUM
    user_id: str
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error: Optional[str] = None

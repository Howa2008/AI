"""Base models for the Omnia AI platform."""
from datetime import datetime
from typing import Dict, List, Optional, Union, Any
import uuid
from pydantic import BaseModel, Field, validator


class BaseDBModel(BaseModel):
    """Base model for all database models."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @validator("updated_at", pre=True, always=True)
    def default_updated_at(cls, v, *, values, **kwargs):
        return datetime.utcnow()
        
    class Config:
        """Configuration for the model."""
        populate_by_name = True
        arbitrary_types_allowed = True

"""User models for the Omnia AI platform."""
from datetime import datetime
from typing import Dict, List, Optional, Union, Any
from pydantic import BaseModel, Field, EmailStr, validator
from .base import BaseDBModel


class UserCreate(BaseModel):
    """User creation model."""
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None


class UserResponse(BaseDBModel):
    """User response model."""
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    is_active: bool = True


class UserLogin(BaseModel):
    """User login model."""
    email: EmailStr
    password: str

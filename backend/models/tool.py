"""Tool models for the Omnia AI platform."""
from datetime import datetime
from typing import Dict, List, Optional, Union, Any
from enum import Enum
from pydantic import BaseModel, Field, validator
from .base import BaseDBModel


class ToolType(str, Enum):
    """Types of tools in the system."""
    BROWSER = "browser"
    LOCAL_APP = "local_app"
    API = "api"
    SYSTEM = "system"
    CUSTOM = "custom"


class ToolExecutionEnvironment(str, Enum):
    """Execution environments for tools."""
    CLOUD = "cloud"
    LOCAL = "local"
    SANDBOX = "sandbox"


class ToolInput(BaseModel):
    """Tool input parameter specification."""
    name: str
    type: str
    description: str
    required: bool = False
    default: Optional[Any] = None


class ToolOutput(BaseModel):
    """Tool output specification."""
    type: str
    description: str


class ToolCreate(BaseModel):
    """Tool creation model."""
    name: str
    description: str
    type: ToolType
    execution_environment: ToolExecutionEnvironment
    inputs: List[ToolInput] = []
    outputs: List[ToolOutput] = []
    config: Dict[str, Any] = {}
    creator_id: str


class ToolResponse(BaseDBModel):
    """Tool response model."""
    name: str
    description: str
    type: ToolType
    execution_environment: ToolExecutionEnvironment
    inputs: List[ToolInput] = []
    outputs: List[ToolOutput] = []
    config: Dict[str, Any] = {}
    creator_id: str
    is_active: bool = True

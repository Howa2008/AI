"""Agent models for the Omnia AI platform."""
from datetime import datetime
from typing import Dict, List, Optional, Union, Any
from enum import Enum
from pydantic import BaseModel, Field, validator
from .base import BaseDBModel


class AgentType(str, Enum):
    """Types of agents in the system."""
    CLOUD = "cloud"
    LOCAL = "local"
    HYBRID = "hybrid"


class AgentCapability(str, Enum):
    """Capabilities that agents can have."""
    TEXT_GENERATION = "text_generation"
    CODE_GENERATION = "code_generation"
    IMAGE_UNDERSTANDING = "image_understanding"
    LOCAL_EXECUTION = "local_execution"
    WEB_BROWSING = "web_browsing"
    FILE_MANAGEMENT = "file_management"
    APP_CONTROL = "app_control"
    DATA_ANALYSIS = "data_analysis"


class AgentCreate(BaseModel):
    """Agent creation model."""
    name: str
    description: Optional[str] = None
    type: AgentType
    capabilities: List[AgentCapability] = []
    config: Dict[str, Any] = {}
    owner_id: str


class AgentResponse(BaseDBModel):
    """Agent response model."""
    name: str
    description: Optional[str] = None
    type: AgentType
    capabilities: List[AgentCapability] = []
    config: Dict[str, Any] = {}
    owner_id: str
    is_active: bool = True

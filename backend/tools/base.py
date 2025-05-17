"""Base tool implementation for the Omnia AI platform."""
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
import logging
import asyncio
import uuid
from datetime import datetime

logger = logging.getLogger(__name__)


class ToolContext:
    """Context for a tool execution."""
    
    def __init__(self, tool_id: str, inputs: Dict[str, Any]):
        """Initialize the tool context."""
        self.tool_id = tool_id
        self.inputs = inputs
        self.execution_id = str(uuid.uuid4())
        self.started_at = datetime.utcnow()
        self.completed_at = None
        self.error = None


class BaseTool(ABC):
    """Base tool implementation."""
    
    def __init__(self, tool_id: str, name: str, config: Dict[str, Any]):
        """Initialize the tool."""
        self.tool_id = tool_id
        self.name = name
        self.config = config
    
    @abstractmethod
    async def execute(self, context: ToolContext) -> Dict[str, Any]:
        """Execute the tool."""
        pass
    
    async def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Run the tool."""
        context = ToolContext(self.tool_id, inputs)
        
        try:
            outputs = await self.execute(context)
            context.completed_at = datetime.utcnow()
            return {
                "tool_id": self.tool_id,
                "tool_name": self.name,
                "execution_id": context.execution_id,
                "status": "success",
                "outputs": outputs,
                "started_at": context.started_at.isoformat(),
                "completed_at": context.completed_at.isoformat(),
            }
        except Exception as e:
            logger.exception(f"Error executing tool {self.name}")
            context.error = str(e)
            context.completed_at = datetime.utcnow()
            return {
                "tool_id": self.tool_id,
                "tool_name": self.name,
                "execution_id": context.execution_id,
                "status": "error",
                "error": str(e),
                "started_at": context.started_at.isoformat(),
                "completed_at": context.completed_at.isoformat(),
            }

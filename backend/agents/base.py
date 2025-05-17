"""Base agent implementation for the Omnia AI platform."""
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
import logging
import asyncio
import uuid
from datetime import datetime

logger = logging.getLogger(__name__)


class AgentContext:
    """Context for an agent execution."""
    
    def __init__(self, task_id: str, inputs: Dict[str, Any], memory: Dict[str, Any] = None):
        """Initialize the agent context."""
        self.task_id = task_id
        self.inputs = inputs
        self.memory = memory or {}
        self.outputs = {}
        self.started_at = datetime.utcnow()
        self.completed_at = None
        self.error = None


class BaseAgent(ABC):
    """Base agent implementation."""
    
    def __init__(self, agent_id: str, name: str, config: Dict[str, Any]):
        """Initialize the agent."""
        self.agent_id = agent_id
        self.name = name
        self.config = config
        self.is_running = False
    
    @abstractmethod
    async def initialize(self):
        """Initialize the agent."""
        pass
    
    @abstractmethod
    async def execute(self, context: AgentContext) -> Dict[str, Any]:
        """Execute the agent."""
        pass
    
    @abstractmethod
    async def shutdown(self):
        """Shutdown the agent."""
        pass
    
    async def run(self, task_id: str, inputs: Dict[str, Any], memory: Dict[str, Any] = None) -> Dict[str, Any]:
        """Run the agent."""
        if self.is_running:
            raise RuntimeError("Agent is already running")
        
        self.is_running = True
        context = AgentContext(task_id, inputs, memory)
        
        try:
            await self.initialize()
            outputs = await self.execute(context)
            context.outputs = outputs
            context.completed_at = datetime.utcnow()
            return outputs
        except Exception as e:
            logger.exception(f"Error executing agent {self.name}")
            context.error = str(e)
            return {"error": str(e)}
        finally:
            await self.shutdown()
            self.is_running = False

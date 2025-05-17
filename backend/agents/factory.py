"""Agent factory for the Omnia AI platform."""
from typing import Dict, Any, Optional
import logging
from .base import BaseAgent
from .cloud_agent import CloudAgent
from .local_agent import LocalAgent
from models.agent import AgentType

logger = logging.getLogger(__name__)


class AgentFactory:
    """Factory for creating agents."""
    
    @staticmethod
    def create_agent(agent_type: AgentType, agent_id: str, name: str, 
                     config: Dict[str, Any]) -> Optional[BaseAgent]:
        """Create an agent based on the agent type."""
        if agent_type == AgentType.CLOUD:
            return CloudAgent(agent_id, name, config)
        elif agent_type == AgentType.LOCAL:
            return LocalAgent(agent_id, name, config)
        elif agent_type == AgentType.HYBRID:
            # In a real implementation, this would create a hybrid agent
            # that combines cloud and local capabilities
            logger.warning(f"Hybrid agent type not fully implemented, using cloud agent instead")
            return CloudAgent(agent_id, name, config)
        else:
            logger.error(f"Unknown agent type: {agent_type}")
            return None

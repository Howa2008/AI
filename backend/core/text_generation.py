"""Text generation utilities for the Omnia AI platform."""
from typing import Dict, List, Any, Optional
import logging
import asyncio
from .model_loader import ModelLoader

logger = logging.getLogger(__name__)


class TextGenerationService:
    """Service for text generation."""
    
    def __init__(self):
        """Initialize the text generation service."""
        self.model_loader = ModelLoader()
        self.default_model_id = "gpt2"  # In a real implementation, use a more powerful model
    
    async def initialize(self):
        """Initialize the text generation service."""
        await self.model_loader.load_model(self.default_model_id, model_type="causal_lm")
    
    async def generate_text(self, prompt: str, max_length: int = 100) -> Optional[str]:
        """Generate text from a prompt."""
        return await self.model_loader.generate_text(self.default_model_id, prompt, max_length)
    
    async def generate_response(self, messages: List[Dict[str, str]], 
                               max_length: int = 100) -> Optional[str]:
        """Generate a response to a conversation."""
        # Format messages as a conversation prompt
        prompt = ""
        for message in messages:
            role = message.get("role", "user")
            content = message.get("content", "")
            
            if role == "user":
                prompt += f"User: {content}\n"
            elif role == "assistant":
                prompt += f"Assistant: {content}\n"
            elif role == "system":
                prompt += f"System: {content}\n"
            else:
                prompt += f"{role}: {content}\n"
        
        prompt += "Assistant: "
        
        # Generate response
        response = await self.generate_text(prompt, max_length)
        
        # In a real implementation, post-process the response to ensure it's well-formed
        
        return response

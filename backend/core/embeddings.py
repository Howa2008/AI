"""Embedding utilities for the Omnia AI platform."""
from typing import Dict, List, Any, Optional, Union
import logging
import numpy as np
from .model_loader import ModelLoader

logger = logging.getLogger(__name__)


class EmbeddingService:
    """Service for text embeddings."""
    
    def __init__(self):
        """Initialize the embedding service."""
        self.model_loader = ModelLoader()
        self.default_model_id = "sentence-transformers/all-MiniLM-L6-v2"
    
    async def initialize(self):
        """Initialize the embedding service."""
        await self.model_loader.load_model(self.default_model_id, model_type="embedding")
    
    async def get_embedding(self, text: str) -> Optional[List[float]]:
        """Get embedding for a text."""
        return await self.model_loader.get_embedding(self.default_model_id, text)
    
    async def get_embeddings(self, texts: List[str]) -> Optional[List[List[float]]]:
        """Get embeddings for multiple texts."""
        return await self.model_loader.get_embedding(self.default_model_id, texts)
    
    async def compute_similarity(self, text1: str, text2: str) -> float:
        """Compute similarity between two texts."""
        embedding1 = await self.get_embedding(text1)
        embedding2 = await self.get_embedding(text2)
        
        if embedding1 is None or embedding2 is None:
            return 0.0
        
        # Compute cosine similarity
        embedding1 = np.array(embedding1)
        embedding2 = np.array(embedding2)
        
        dot_product = np.dot(embedding1, embedding2)
        norm1 = np.linalg.norm(embedding1)
        norm2 = np.linalg.norm(embedding2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return dot_product / (norm1 * norm2)
    
    async def find_most_similar(self, query: str, candidates: List[str]) -> Dict[str, Any]:
        """Find the most similar text among candidates."""
        query_embedding = await self.get_embedding(query)
        candidate_embeddings = await self.get_embeddings(candidates)
        
        if query_embedding is None or candidate_embeddings is None:
            return {"most_similar": None, "score": 0.0, "all_scores": []}
        
        # Compute similarities
        query_embedding = np.array(query_embedding)
        candidate_embeddings = np.array(candidate_embeddings)
        
        similarities = []
        for i, candidate_embedding in enumerate(candidate_embeddings):
            dot_product = np.dot(query_embedding, candidate_embedding)
            norm1 = np.linalg.norm(query_embedding)
            norm2 = np.linalg.norm(candidate_embedding)
            
            if norm1 == 0 or norm2 == 0:
                similarity = 0.0
            else:
                similarity = dot_product / (norm1 * norm2)
            
            similarities.append((candidates[i], similarity))
        
        # Sort by similarity
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        return {
            "most_similar": similarities[0][0] if similarities else None,
            "score": similarities[0][1] if similarities else 0.0,
            "all_scores": [{"text": text, "score": score} for text, score in similarities]
        }

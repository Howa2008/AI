from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime
import sys

# Add the current directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import API routes
from api.auth import router as auth_router
from api.agents import router as agents_router
from api.tools import router as tools_router
from api.tasks import router as tasks_router

# Import core services
from core.model_loader import ModelLoader
from core.embeddings import EmbeddingService
from core.text_generation import TextGenerationService

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'omnia_ai')]

# Create the main app without a prefix
app = FastAPI(title="Omnia AI Platform API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Create core services
model_loader = ModelLoader()
embedding_service = EmbeddingService()
text_generation_service = TextGenerationService()

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Add base routes to the router
@api_router.get("/")
async def root():
    return {"message": "Omnia AI Platform API"}

@api_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# AI-specific endpoints
class GenerateTextRequest(BaseModel):
    prompt: str
    max_length: int = 100

class GenerateTextResponse(BaseModel):
    text: str
    model_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

@api_router.post("/ai/generate", response_model=GenerateTextResponse)
async def generate_text(request: GenerateTextRequest):
    """Generate text using the default AI model."""
    # Initialize the service if needed
    await text_generation_service.initialize()
    
    # Generate text
    generated_text = await text_generation_service.generate_text(
        request.prompt, request.max_length
    )
    
    if generated_text is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate text"
        )
    
    return GenerateTextResponse(
        text=generated_text,
        model_id=text_generation_service.default_model_id
    )

class ComputeSimilarityRequest(BaseModel):
    text1: str
    text2: str

class ComputeSimilarityResponse(BaseModel):
    similarity: float
    model_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

@api_router.post("/ai/similarity", response_model=ComputeSimilarityResponse)
async def compute_similarity(request: ComputeSimilarityRequest):
    """Compute similarity between two texts."""
    # Initialize the service if needed
    await embedding_service.initialize()
    
    # Compute similarity
    similarity = await embedding_service.compute_similarity(
        request.text1, request.text2
    )
    
    return ComputeSimilarityResponse(
        similarity=similarity,
        model_id=embedding_service.default_model_id
    )

# Include all routers
api_router.include_router(auth_router)
api_router.include_router(agents_router)
api_router.include_router(tools_router)
api_router.include_router(tasks_router)

# Include the router in the main app
app.include_router(api_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Dependency to get the database
async def get_db():
    return db

# Events
@app.on_event("startup")
async def startup_db_client():
    """Initialize services on startup."""
    logger.info("Starting up Omnia AI Platform")
    # Initialize AI services
    try:
        await embedding_service.initialize()
        await text_generation_service.initialize()
        logger.info("AI services initialized")
    except Exception as e:
        logger.exception(f"Error initializing AI services: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    """Shutdown services."""
    logger.info("Shutting down Omnia AI Platform")
    client.close()

"""Agent API for the Omnia AI platform."""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from models.agent import AgentCreate, AgentResponse, AgentType, AgentCapability
from api.auth import get_current_active_user

# Create router
router = APIRouter(prefix="/agents", tags=["agents"])


@router.post("/", response_model=AgentResponse)
async def create_agent(agent: AgentCreate, db = Depends(lambda: None), current_user = Depends(get_current_active_user)):
    """Create a new agent."""
    agent_dict = agent.dict()
    agent_dict["owner_id"] = current_user["username"]  # In a real app, this would be the user ID
    inserted_id = await db.agents.insert_one(agent_dict).inserted_id
    agent_dict["id"] = str(inserted_id)
    
    return AgentResponse(**agent_dict)


@router.get("/", response_model=List[AgentResponse])
async def get_agents(db = Depends(lambda: None), current_user = Depends(get_current_active_user)):
    """Get all agents for the current user."""
    agents = await db.agents.find({"owner_id": current_user["username"]}).to_list(1000)
    return [AgentResponse(**agent) for agent in agents]


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(agent_id: str, db = Depends(lambda: None), current_user = Depends(get_current_active_user)):
    """Get a specific agent by ID."""
    agent = await db.agents.find_one({"id": agent_id, "owner_id": current_user["username"]})
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found",
        )
    return AgentResponse(**agent)


@router.delete("/{agent_id}", response_model=AgentResponse)
async def delete_agent(agent_id: str, db = Depends(lambda: None), current_user = Depends(get_current_active_user)):
    """Delete an agent."""
    agent = await db.agents.find_one({"id": agent_id, "owner_id": current_user["username"]})
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found",
        )
    
    await db.agents.delete_one({"id": agent_id})
    return AgentResponse(**agent)

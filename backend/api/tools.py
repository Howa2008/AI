"""Tool API for the Omnia AI platform."""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from models.tool import ToolCreate, ToolResponse, ToolType, ToolExecutionEnvironment
from api.auth import get_current_active_user

# Create router
router = APIRouter(prefix="/tools", tags=["tools"])


@router.post("/", response_model=ToolResponse)
async def create_tool(tool: ToolCreate, db = Depends(lambda: None), current_user = Depends(get_current_active_user)):
    """Create a new tool."""
    tool_dict = tool.dict()
    tool_dict["creator_id"] = current_user["username"]  # In a real app, this would be the user ID
    inserted_id = await db.tools.insert_one(tool_dict).inserted_id
    tool_dict["id"] = str(inserted_id)
    
    return ToolResponse(**tool_dict)


@router.get("/", response_model=List[ToolResponse])
async def get_tools(db = Depends(lambda: None), current_user = Depends(get_current_active_user)):
    """Get all tools."""
    # Tools can be shared across users, so we don't filter by creator_id
    tools = await db.tools.find({"is_active": True}).to_list(1000)
    return [ToolResponse(**tool) for tool in tools]


@router.get("/{tool_id}", response_model=ToolResponse)
async def get_tool(tool_id: str, db = Depends(lambda: None), current_user = Depends(get_current_active_user)):
    """Get a specific tool by ID."""
    tool = await db.tools.find_one({"id": tool_id, "is_active": True})
    if not tool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tool not found",
        )
    return ToolResponse(**tool)


@router.delete("/{tool_id}", response_model=ToolResponse)
async def delete_tool(tool_id: str, db = Depends(lambda: None), current_user = Depends(get_current_active_user)):
    """Delete a tool (mark as inactive)."""
    tool = await db.tools.find_one({"id": tool_id, "creator_id": current_user["username"]})
    if not tool:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tool not found or you don't have permission",
        )
    
    # Mark as inactive instead of deleting
    await db.tools.update_one({"id": tool_id}, {"$set": {"is_active": False}})
    tool["is_active"] = False
    return ToolResponse(**tool)

"""Task API for the Omnia AI platform."""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from models.task import TaskCreate, TaskResponse, TaskStatus, TaskPriority
from api.auth import get_current_active_user

# Create router
router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("/", response_model=TaskResponse)
async def create_task(task: TaskCreate, db = Depends(lambda: None), current_user = Depends(get_current_active_user)):
    """Create a new task."""
    # Verify agent exists
    agent = await db.agents.find_one({"id": task.agent_id})
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found",
        )
    
    task_dict = task.dict()
    task_dict["user_id"] = current_user["username"]  # In a real app, this would be the user ID
    task_dict["status"] = TaskStatus.PENDING
    task_dict["outputs"] = {}
    task_dict["created_at"] = datetime.utcnow()
    task_dict["updated_at"] = datetime.utcnow()
    
    inserted_id = await db.tasks.insert_one(task_dict).inserted_id
    task_dict["id"] = str(inserted_id)
    
    # In a real implementation, this would trigger the task to be executed by the agent
    # For now, we'll just return the task
    
    return TaskResponse(**task_dict)


@router.get("/", response_model=List[TaskResponse])
async def get_tasks(db = Depends(lambda: None), current_user = Depends(get_current_active_user)):
    """Get all tasks for the current user."""
    tasks = await db.tasks.find({"user_id": current_user["username"]}).to_list(1000)
    return [TaskResponse(**task) for task in tasks]


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str, db = Depends(lambda: None), current_user = Depends(get_current_active_user)):
    """Get a specific task by ID."""
    task = await db.tasks.find_one({"id": task_id, "user_id": current_user["username"]})
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return TaskResponse(**task)


@router.delete("/{task_id}", response_model=TaskResponse)
async def cancel_task(task_id: str, db = Depends(lambda: None), current_user = Depends(get_current_active_user)):
    """Cancel a task."""
    task = await db.tasks.find_one({"id": task_id, "user_id": current_user["username"]})
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    
    # Only pending or running tasks can be cancelled
    if task["status"] not in [TaskStatus.PENDING, TaskStatus.RUNNING]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel a task with status {task['status']}",
        )
    
    # Update task status
    await db.tasks.update_one({"id": task_id}, {"$set": {"status": TaskStatus.CANCELLED}})
    task["status"] = TaskStatus.CANCELLED
    
    return TaskResponse(**task)

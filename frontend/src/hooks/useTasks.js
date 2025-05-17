import { useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../api';

// Hook for managing tasks
export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await taskAPI.getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.response?.data?.detail || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single task by ID
  const fetchTask = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await taskAPI.getTask(taskId);
      return data;
    } catch (err) {
      console.error(`Error fetching task ${taskId}:`, err);
      setError(err.response?.data?.detail || 'Failed to fetch task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new task
  const createTask = useCallback(async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await taskAPI.createTask(taskData);
      setTasks(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.response?.data?.detail || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel a task
  const cancelTask = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await taskAPI.cancelTask(taskId);
      
      // Update the task in the list
      setTasks(prev => 
        prev.map(task => task.id === taskId ? data : task)
      );
      
      return data;
    } catch (err) {
      console.error(`Error cancelling task ${taskId}:`, err);
      setError(err.response?.data?.detail || 'Failed to cancel task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    fetchTask,
    createTask,
    cancelTask,
  };
};

import { useState, useEffect, useCallback } from 'react';
import { agentAPI } from '../api';

// Hook for managing agents
export const useAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all agents
  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await agentAPI.getAgents();
      setAgents(data);
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError(err.response?.data?.detail || 'Failed to fetch agents');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single agent by ID
  const fetchAgent = useCallback(async (agentId) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await agentAPI.getAgent(agentId);
      return data;
    } catch (err) {
      console.error(`Error fetching agent ${agentId}:`, err);
      setError(err.response?.data?.detail || 'Failed to fetch agent');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new agent
  const createAgent = useCallback(async (agentData) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await agentAPI.createAgent(agentData);
      setAgents(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error creating agent:', err);
      setError(err.response?.data?.detail || 'Failed to create agent');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete an agent
  const deleteAgent = useCallback(async (agentId) => {
    try {
      setLoading(true);
      setError(null);
      
      await agentAPI.deleteAgent(agentId);
      setAgents(prev => prev.filter(agent => agent.id !== agentId));
    } catch (err) {
      console.error(`Error deleting agent ${agentId}:`, err);
      setError(err.response?.data?.detail || 'Failed to delete agent');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch agents on component mount
  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return {
    agents,
    loading,
    error,
    fetchAgents,
    fetchAgent,
    createAgent,
    deleteAgent,
  };
};

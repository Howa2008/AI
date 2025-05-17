import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAgents } from '../hooks/useAgents';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import AgentCard from '../components/AgentCard';
import { AgentType, AgentCapability } from '../utils/constants';

export default function AgentsPage() {
  const { agents, loading, error, deleteAgent } = useAgents();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  
  // Filter and search agents
  const filteredAgents = agents.filter(agent => {
    // Search by name or description
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.description && agent.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by type
    const matchesType = !filterType || agent.type === filterType;
    
    return matchesSearch && matchesType;
  });
  
  // Actions for PageHeader
  const actions = (
    <Link
      to="/agents/new"
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      Create Agent
    </Link>
  );
  
  // Handle agent deletion
  const handleDeleteAgent = async (agentId) => {
    if (window.confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      try {
        await deleteAgent(agentId);
      } catch (err) {
        console.error(`Error deleting agent ${agentId}:`, err);
      }
    }
  };
  
  return (
    <Layout>
      <PageHeader 
        title="AI Agents"
        description="Create and manage your intelligent AI agents"
        actions={actions}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label htmlFor="search" className="sr-only">
              Search agents
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search agents"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="filter-type" className="sr-only">
              Filter by type
            </label>
            <select
              id="filter-type"
              name="filter-type"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="cloud">Cloud</option>
              <option value="local">Local</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          
          <div className="text-right">
            <span className="text-sm text-gray-500">
              {filteredAgents.length} {filteredAgents.length === 1 ? 'agent' : 'agents'} found
            </span>
          </div>
        </div>
        
        {/* Agent List */}
        {loading ? (
          <div className="text-center py-10">
            <svg 
              className="animate-spin h-10 w-10 text-blue-500 mx-auto" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-3 text-gray-500">Loading agents...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <p className="font-bold">Error</p>
            <p className="block sm:inline">{error}</p>
          </div>
        ) : filteredAgents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map(agent => (
              <AgentCard 
                key={agent.id} 
                agent={agent} 
                onDelete={handleDeleteAgent} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="mt-2 text-gray-500">
              {searchTerm || filterType ? 'No agents match your search criteria' : 'No agents yet'}
            </p>
            <div className="mt-4">
              <Link
                to="/agents/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create your first agent
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

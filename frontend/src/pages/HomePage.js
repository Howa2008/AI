import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAgents } from '../hooks/useAgents';
import { useTasks } from '../hooks/useTasks';
import { agentAPI, toolAPI, taskAPI } from '../api';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import AgentCard from '../components/AgentCard';
import TaskCard from '../components/TaskCard';
import { formatDate } from '../utils';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const { agents, loading: agentsLoading } = useAgents();
  const { tasks, loading: tasksLoading, cancelTask } = useTasks();
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalTools: 0,
    totalTasks: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, we would fetch these from a separate API endpoint
        // For now, we'll use the existing data
        setStats({
          totalAgents: agents.length,
          totalTools: 0, // We'll fetch this separately
          totalTasks: tasks.length,
          completedTasks: tasks.filter(task => task.status === 'completed').length,
        });
        
        try {
          const tools = await toolAPI.getTools();
          setStats(prev => ({
            ...prev,
            totalTools: tools.length,
          }));
        } catch (err) {
          console.error('Error fetching tools:', err);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (!agentsLoading && !tasksLoading) {
      fetchStats();
    }
  }, [agents, tasks, agentsLoading, tasksLoading]);

  // Handle task cancellation
  const handleCancelTask = async (taskId) => {
    try {
      await cancelTask(taskId);
    } catch (err) {
      console.error(`Error cancelling task ${taskId}:`, err);
    }
  };
  
  // Filter agents and tasks for the dashboard
  const recentAgents = agents.slice(0, 3);
  const recentTasks = tasks.slice(0, 3);

  return (
    <Layout>
      <PageHeader 
        title={`Welcome${user ? `, ${user.username}` : ''}`}
        description="Omnia AI Platform Dashboard"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAuthenticated ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Agents
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {stats.totalAgents}
                  </dd>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Tools
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {stats.totalTools}
                  </dd>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Tasks
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {stats.totalTasks}
                  </dd>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed Tasks
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {stats.completedTasks}
                  </dd>
                </div>
              </div>
            </div>
            
            {/* Recent Agents */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Agents</h2>
                <Link 
                  to="/agents" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View all
                </Link>
              </div>
              
              {agentsLoading ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">Loading agents...</p>
                </div>
              ) : recentAgents.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recentAgents.map(agent => (
                    <AgentCard 
                      key={agent.id} 
                      agent={agent} 
                      onDelete={() => {}} 
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white shadow-sm rounded-lg p-6 text-center">
                  <p className="text-gray-500 mb-4">No agents yet</p>
                  <Link
                    to="/agents/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Create Agent
                  </Link>
                </div>
              )}
            </div>
            
            {/* Recent Tasks */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Tasks</h2>
                <Link 
                  to="/tasks" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View all
                </Link>
              </div>
              
              {tasksLoading ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">Loading tasks...</p>
                </div>
              ) : recentTasks.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recentTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onCancel={handleCancelTask} 
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white shadow-sm rounded-lg p-6 text-center">
                  <p className="text-gray-500 mb-4">No tasks yet</p>
                  <Link
                    to="/tasks/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Create Task
                  </Link>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-12">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                <span className="block bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  Omnia AI Platform
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-500">
                The ultimate AI agent platform combining cloud intelligence with local computer control.
              </p>
              <div className="mt-10 flex justify-center">
                <Link
                  to="/login"
                  className="mx-3 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="mx-3 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Register
                </Link>
                <Link
                  to="/demo"
                  className="mx-3 inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  Try Demo
                </Link>
              </div>
            </div>
            
            {/* Feature Section */}
            <div className="mt-20">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
                Powerful Features
              </h2>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white shadow-md rounded-lg p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Intelligent Agents</h3>
                  <p className="text-gray-600">
                    Create powerful AI agents that can understand complex tasks and autonomously execute them.
                  </p>
                </div>
                
                <div className="bg-white shadow-md rounded-lg p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Powerful Tools</h3>
                  <p className="text-gray-600">
                    Integrate with a wide range of tools and APIs, allowing agents to interact with the digital world.
                  </p>
                </div>
                
                <div className="bg-white shadow-md rounded-lg p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Control</h3>
                  <p className="text-gray-600">
                    Unique ability to control local applications and systems while maintaining privacy and security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

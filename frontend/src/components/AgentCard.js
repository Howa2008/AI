import React from 'react';
import { getAgentTypeColor, formatCapabilities } from '../utils';
import { Link } from 'react-router-dom';

export default function AgentCard({ agent, onDelete }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{agent.name}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAgentTypeColor(agent.type)}`}>
            {agent.type}
          </span>
        </div>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {agent.description || 'No description provided.'}
        </p>
        
        {agent.capabilities && agent.capabilities.length > 0 && (
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Capabilities</h4>
            <p className="mt-1 text-sm text-gray-600">
              {formatCapabilities(agent.capabilities)}
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-between items-center">
        <Link
          to={`/agents/${agent.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          View Details
        </Link>
        
        <div className="flex space-x-2">
          <button
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            onClick={() => {/* Open edit modal */}}
          >
            Edit
          </button>
          <button
            className="text-sm font-medium text-red-600 hover:text-red-500"
            onClick={() => onDelete(agent.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

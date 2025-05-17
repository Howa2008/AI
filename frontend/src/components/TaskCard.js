import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getStatusColor, getPriorityColor, truncateText } from '../utils';

export default function TaskCard({ task, onCancel }) {
  const isPending = task.status === 'pending';
  const isRunning = task.status === 'running';
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{task.title}</h3>
          <div className="flex flex-col gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {['Low', 'Medium', 'High', 'Critical'][task.priority]} Priority
            </span>
          </div>
        </div>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {truncateText(task.description, 120)}
        </p>
        
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <span className="text-gray-500">Agent:</span>{' '}
            <span className="font-medium">{task.agent_id}</span>
          </div>
          <div>
            <span className="text-gray-500">Created:</span>{' '}
            <span className="font-medium">{formatDate(task.created_at)}</span>
          </div>
          {task.started_at && (
            <div>
              <span className="text-gray-500">Started:</span>{' '}
              <span className="font-medium">{formatDate(task.started_at)}</span>
            </div>
          )}
          {task.completed_at && (
            <div>
              <span className="text-gray-500">Completed:</span>{' '}
              <span className="font-medium">{formatDate(task.completed_at)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-between items-center">
        <Link
          to={`/tasks/${task.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          View Details
        </Link>
        
        <div className="flex space-x-2">
          {(isPending || isRunning) && (
            <button
              className="text-sm font-medium text-red-600 hover:text-red-500"
              onClick={() => onCancel(task.id)}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

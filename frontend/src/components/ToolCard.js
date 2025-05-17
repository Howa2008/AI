import React from 'react';
import { Link } from 'react-router-dom';
import { getToolTypeColor } from '../utils';

export default function ToolCard({ tool, onDelete }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{tool.name}</h3>
          <div className="flex flex-col gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getToolTypeColor(tool.type)}`}>
              {tool.type}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
              {tool.execution_environment}
            </span>
          </div>
        </div>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {tool.description || 'No description provided.'}
        </p>
        
        {tool.inputs && tool.inputs.length > 0 && (
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Inputs</h4>
            <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
              {tool.inputs.slice(0, 2).map((input, idx) => (
                <li key={idx} className="truncate">
                  <span className="font-medium">{input.name}</span>
                  {input.required && <span className="text-red-500">*</span>}
                  {input.description && <span className="text-gray-500"> - {input.description}</span>}
                </li>
              ))}
              {tool.inputs.length > 2 && (
                <li className="italic text-gray-500">
                  +{tool.inputs.length - 2} more inputs
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-between items-center">
        <Link
          to={`/tools/${tool.id}`}
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
            onClick={() => onDelete(tool.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

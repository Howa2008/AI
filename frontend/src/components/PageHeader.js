import React from 'react';

export default function PageHeader({ title, description, actions }) {
  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="mt-2 text-sm text-gray-500">{description}</p>
            )}
          </div>
          {actions && <div className="mt-4 sm:mt-0">{actions}</div>}
        </div>
      </div>
    </div>
  );
}

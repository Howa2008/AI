// Date formatting
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Status badge color mapping
export const getStatusColor = (status) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    running: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

// Priority badge color mapping
export const getPriorityColor = (priority) => {
  const priorityColors = {
    0: 'bg-gray-100 text-gray-800', // Low
    1: 'bg-blue-100 text-blue-800', // Medium
    2: 'bg-yellow-100 text-yellow-800', // High
    3: 'bg-red-100 text-red-800', // Critical
  };
  
  return priorityColors[priority] || 'bg-gray-100 text-gray-800';
};

// Agent type badge color mapping
export const getAgentTypeColor = (type) => {
  const typeColors = {
    cloud: 'bg-blue-100 text-blue-800',
    local: 'bg-green-100 text-green-800',
    hybrid: 'bg-purple-100 text-purple-800',
  };
  
  return typeColors[type] || 'bg-gray-100 text-gray-800';
};

// Tool type badge color mapping
export const getToolTypeColor = (type) => {
  const typeColors = {
    browser: 'bg-blue-100 text-blue-800',
    local_app: 'bg-green-100 text-green-800',
    api: 'bg-yellow-100 text-yellow-800',
    system: 'bg-red-100 text-red-800',
    custom: 'bg-purple-100 text-purple-800',
  };
  
  return typeColors[type] || 'bg-gray-100 text-gray-800';
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Parse JSON safely
export const parseJSON = (json, fallback = {}) => {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
};

// Format capabilities as a readable string
export const formatCapabilities = (capabilities = []) => {
  if (!capabilities || capabilities.length === 0) return 'None';
  
  // Replace underscores with spaces and capitalize
  return capabilities
    .map(cap => cap.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
    .join(', ');
};

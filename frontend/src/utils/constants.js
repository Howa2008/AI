// Agent Types
export const AgentType = {
  CLOUD: 'cloud',
  LOCAL: 'local',
  HYBRID: 'hybrid',
};

// Agent Capabilities
export const AgentCapability = {
  TEXT_GENERATION: 'text_generation',
  CODE_GENERATION: 'code_generation',
  IMAGE_UNDERSTANDING: 'image_understanding',
  LOCAL_EXECUTION: 'local_execution',
  WEB_BROWSING: 'web_browsing',
  FILE_MANAGEMENT: 'file_management',
  APP_CONTROL: 'app_control',
  DATA_ANALYSIS: 'data_analysis',
};

// Tool Types
export const ToolType = {
  BROWSER: 'browser',
  LOCAL_APP: 'local_app',
  API: 'api',
  SYSTEM: 'system',
  CUSTOM: 'custom',
};

// Tool Execution Environments
export const ToolExecutionEnvironment = {
  CLOUD: 'cloud',
  LOCAL: 'local',
  SANDBOX: 'sandbox',
};

// Task Statuses
export const TaskStatus = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

// Task Priorities
export const TaskPriority = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  CRITICAL: 3,
};

// User Roles
export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
};

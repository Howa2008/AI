import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('omniaai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

// Agent API
export const agentAPI = {
  createAgent: async (agentData) => {
    const response = await api.post('/agents', agentData);
    return response.data;
  },
  
  getAgents: async () => {
    const response = await api.get('/agents');
    return response.data;
  },
  
  getAgent: async (agentId) => {
    const response = await api.get(`/agents/${agentId}`);
    return response.data;
  },
  
  deleteAgent: async (agentId) => {
    const response = await api.delete(`/agents/${agentId}`);
    return response.data;
  },
};

// Tool API
export const toolAPI = {
  createTool: async (toolData) => {
    const response = await api.post('/tools', toolData);
    return response.data;
  },
  
  getTools: async () => {
    const response = await api.get('/tools');
    return response.data;
  },
  
  getTool: async (toolId) => {
    const response = await api.get(`/tools/${toolId}`);
    return response.data;
  },
  
  deleteTool: async (toolId) => {
    const response = await api.delete(`/tools/${toolId}`);
    return response.data;
  },
};

// Task API
export const taskAPI = {
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },
  
  getTask: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },
  
  cancelTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },
};

// AI API
export const aiAPI = {
  generateText: async (prompt, maxLength = 100) => {
    const response = await api.post('/ai/generate', {
      prompt,
      max_length: maxLength,
    });
    return response.data;
  },
  
  computeSimilarity: async (text1, text2) => {
    const response = await api.post('/ai/similarity', {
      text1,
      text2,
    });
    return response.data;
  },
};

export default {
  authAPI,
  agentAPI,
  toolAPI,
  taskAPI,
  aiAPI,
};

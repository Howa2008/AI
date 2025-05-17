import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api';

// Create auth context
const AuthContext = createContext(null);

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem('omniaai_token');
    const userData = localStorage.getItem('omniaai_user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Error parsing user data from localStorage', err);
      }
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { access_token, token_type } = await authAPI.login(email, password);
      
      // For demonstration purposes, we'll set a dummy user
      // In a real app, we'd make a request to get the user profile
      const dummyUser = {
        email,
        username: email.split('@')[0],
        full_name: 'Omnia AI User',
      };
      
      // Store token and user data
      localStorage.setItem('omniaai_token', access_token);
      localStorage.setItem('omniaai_user', JSON.stringify(dummyUser));
      
      setUser(dummyUser);
      return dummyUser;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.register(userData);
      
      // After registration, log the user in
      return await login(userData.email, userData.password);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('omniaai_token');
    localStorage.removeItem('omniaai_user');
    setUser(null);
  };

  // Context value
  const contextValue = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

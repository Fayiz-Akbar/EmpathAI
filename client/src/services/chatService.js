import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Injects the auth token into every outgoing request.
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('empathAI_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// We'll use mock data since the backend might not exist or we want to test UI first.

/**
 * Creates a new chat session for the given user.
 */
export const createSession = async (userId, title) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `sess_${Date.now()}`,
        user_id: userId,
        title: title || 'New Conversation'
      });
    }, 500);
  });
};

/**
 * Sends a user message and receives AI response (mock).
 */
export const sendMessage = async (sessionId, message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: 'Message processed successfully',
        data: {
          session_id: sessionId,
          message: message,
          response: `I hear you saying "${message}". That sounds like it could be challenging, but I'm here to support you. How does that make you feel?`,
          emotion: 'empathetic',
          timestamp: new Date().toISOString()
        }
      });
    }, 1500); // 1.5s delay to show typing indicator
  });
};

/**
 * Fetches chat history for a given session (mock).
 */
export const getHistory = async (sessionId) => {
  console.log('Fetching mock history for session:', sessionId);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        // Mock empty or existing history. For now, we'll return empty so the welcome state shows.
      ]);
    }, 500);
  });
};

/**
 * Fetches mock emotion history for the Dashboard Analytics.
 */
export const getEmotionHistory = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { date: 'Mon', happiness: 65, stress: 80 },
        { date: 'Tue', happiness: 70, stress: 75 },
        { date: 'Wed', happiness: 68, stress: 60 },
        { date: 'Thu', happiness: 75, stress: 55 },
        { date: 'Fri', happiness: 85, stress: 40 },
        { date: 'Sat', happiness: 90, stress: 30 },
        { date: 'Sun', happiness: 88, stress: 35 },
      ]);
    }, 800);
  });
};

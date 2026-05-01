import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Creates a new chat session for the given user.
 * @param {string} userId - The authenticated user's ID.
 * @param {string} [title] - Optional session title.
 * @returns {Promise<Object>} The created session object.
 */
export const createSession = async (userId, title) => {
  const response = await apiClient.post('/chat/session', {
    user_id: userId,
    title,
  });
  return response.data;
};

/**
 * Sends a user message and receives AI response.
 * @param {string} sessionId - The active chat session ID.
 * @param {string} message - The user's message text.
 * @returns {Promise<Object>} The server response with AI reply.
 */
export const sendMessage = async (sessionId, message) => {
  const response = await apiClient.post('/chat/message', {
    session_id: sessionId,
    message,
  });
  return response.data;
};

/**
 * Fetches chat history for a given session.
 * @param {string} sessionId - The chat session ID.
 * @returns {Promise<Object>} Array of chat messages.
 */
export const getHistory = async (sessionId) => {
  const response = await apiClient.get(`/chat/history/${sessionId}`);
  return response.data;
};

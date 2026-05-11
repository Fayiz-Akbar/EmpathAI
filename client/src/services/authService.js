import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Registers a new user account.
 * @param {Object} credentials - The registration data.
 * @param {string} credentials.name - User's full name.
 * @param {string} credentials.email - User's email address.
 * @param {string} credentials.password - User's chosen password.
 * @returns {Promise<Object>} The server response data.
 */
export const registerUser = async ({ name, email, password }) => {
  const response = await apiClient.post('/auth/register', { name, email, password });
  return response.data;
};

/**
 * Authenticates an existing user.
 * @param {Object} credentials - The login data.
 * @param {string} credentials.email - User's email address.
 * @param {string} credentials.password - User's password.
 * @returns {Promise<Object>} The server response data containing token and user info.
 */
export const loginUser = async ({ email, password }) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

/**
 * Checks if the user is currently authenticated.
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('empathAI_token');
};

/**
 * Retrieves the current user from localStorage.
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('empathAI_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

/**
 * Logs the user out by clearing stored data.
 */
export const logout = () => {
  localStorage.removeItem('empathAI_token');
  localStorage.removeItem('empathAI_user');
  localStorage.removeItem('empathAI_sessionId');
};

/**
 * Updates the user's theme preference on the server.
 * @param {string} theme - 'light' or 'dark'
 */
export const updateTheme = async (theme) => {
  const token = localStorage.getItem('empathAI_token');
  if (!token) return null;
  const response = await apiClient.put('/auth/theme', { theme }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

/**
 * Updates the theme in localStorage user object.
 * @param {string} theme - 'light' or 'dark'
 */
export const updateLocalUserTheme = (theme) => {
  const user = getCurrentUser();
  if (user) {
    user.theme = theme;
    localStorage.setItem('empathAI_user', JSON.stringify(user));
  }
};


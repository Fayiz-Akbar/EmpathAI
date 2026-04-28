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

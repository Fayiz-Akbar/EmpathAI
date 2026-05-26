import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke setiap request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('empathAI_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getHabits = async () => {
  const response = await apiClient.get('/habits');
  return response.data;
};

export const createHabit = async (habitData) => {
  const response = await apiClient.post('/habits', habitData);
  return response.data;
};

export const deleteHabit = async (id) => {
  const response = await apiClient.delete(`/habits/${id}`);
  return response.data;
};

/**
 * Toggle habit completion status for a specific local date.
 * @param {string} id - The ID of the habit
 * @param {string} dateString - Format "YYYY-MM-DD" representing local date
 */
export const toggleHabit = async (id, dateString) => {
  const response = await apiClient.patch(`/habits/${id}/toggle`, { dateString });
  return response.data;
};

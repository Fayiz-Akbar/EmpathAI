import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('empathAI_token');
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor untuk merespons jika token kedaluwarsa/tidak valid (400/401)
apiClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && (error.response.status === 401 || error.response.status === 400) && error.response.data.message.includes('Token')) {
    localStorage.removeItem('empathAI_token');
    localStorage.removeItem('empathAI_user');
    window.location.href = '/login';
  }
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

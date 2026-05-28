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

// 1. Membuat Sesi Chat ke Node.js
export const createSession = async (userId, title) => {
  // Asumsi endpoint-nya /chat/session, sesuaikan dengan chatRoutes.js milikmu
  const response = await apiClient.post('/chat/session', { user_id: userId, title });
  return response.data; 
};

// 2. Mengirim Pesan ke Node.js
export const sendMessage = async (sessionId, message) => {
  // Ubah /chat/send menjadi /chat/message menyesuaikan dengan router kamu
  const response = await apiClient.post('/chat/message', { session_id: sessionId, message });
  return response.data;
};

// 3. Mengambil Riwayat Chat dari Node.js
export const getHistory = async (sessionId) => {
  // Asumsi endpoint-nya /chat/history/:sessionId
  const response = await apiClient.get(`/chat/history/${sessionId}`);
  return response.data;
};

// 4. Riwayat Emosi (Tetap dibiarkan simulasi karena belum ada backend-nya)
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

// 5. Mengambil Daftar Semua Sesi milik User
export const getUserSessions = async (userId) => {
  const response = await apiClient.get(`/chat/sessions/${userId}`);
  return response.data;
};

// 6. Mengubah Nama Sesi Chat
export const renameSession = async (sessionId, newTitle) => {
  const response = await apiClient.put(`/chat/sessions/${sessionId}`, { title: newTitle });
  return response.data;
};

// 7. Menghapus Sesi Chat
export const deleteSession = async (sessionId) => {
  const response = await apiClient.delete(`/chat/sessions/${sessionId}`);
  return response.data;
};

// 8. Menyematkan Sesi Chat (Pin/Unpin)
export const pinSession = async (sessionId, isPinned) => {
  const response = await apiClient.put(`/chat/sessions/${sessionId}/pin`, { isPinned });
  return response.data;
};
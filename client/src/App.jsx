import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';
import SelfCarePage from './pages/SelfCarePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import FeedbackPage from './pages/FeedbackPage';
import GeoMapPage from './pages/GeoMapPage';
import EduPage from './pages/EduPage';
import Notification from './components/Notification';

/**
 * App — Root component managing client-side routing.
 * Default route is the chat page (no login required).
 * Auth routes are available for users who want to sign in.
 */
const App = () => {
  const [notification, setNotification] = useState({ message: '', type: 'success' });

  useEffect(() => {
    const handleNotification = (e) => {
      setNotification({ message: e.detail.message, type: e.detail.type || 'success' });
    };
    window.addEventListener('showNotification', handleNotification);
    return () => window.removeEventListener('showNotification', handleNotification);
  }, []);

  return (
    <BrowserRouter>
      <Notification 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: '', type: 'success' })} 
      />
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/self-care" element={<SelfCarePage />} />
        <Route path="/wawasan" element={<EduPage />} />
        <Route path="/sig-map" element={<GeoMapPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />

        {/* Default: redirect to chat */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

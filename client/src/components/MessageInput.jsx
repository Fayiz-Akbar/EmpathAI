import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Plus, Mic, Send, Loader2 } from 'lucide-react';

const MessageInput = ({ onSend, isLoading, isCentered = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  // Efek untuk membuat tinggi textarea menyesuaikan otomatis (Auto-resize)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (message.trim() && !isLoading) {
      // INI ADALAH JEMBATAN KE BACKEND
      // Mengirimkan teks ke ChatPage.jsx -> lalu dikirim ke API Node.js
      onSend(message); 
      setMessage('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    // Kirim pesan saat Enter ditekan (tanpa Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={`w-full flex justify-center shrink-0 ${!isCentered ? 'px-0' : ''}`}>
      <div className={`w-full ${isCentered ? 'max-w-3xl' : 'max-w-4xl'}`}>
        
        {/* Kotak Input Utama (Relative untuk mengunci posisi ikon) */}
        <div className={`relative bg-gray-50 dark:bg-slate-800/50 rounded-[32px] border border-gray-200 dark:border-slate-700 transition-all duration-300 ${
          !isCentered ? 'focus-within:shadow-md focus-within:border-gray-300 dark:focus-within:border-slate-600 focus-within:bg-white dark:focus-within:bg-slate-900 shadow-sm' : 'shadow-sm'
        }`}>
          
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask EmpathAI..."
            disabled={isLoading}
            rows={1}
            // pb-14 memastikan teks yang diketik tidak tertutup oleh deretan tombol di bawahnya
            className="w-full bg-transparent resize-none px-6 pt-5 pb-14 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none min-h-[120px] rounded-[32px] text-[16px] disabled:opacity-70 leading-relaxed font-sans"
            style={{ maxHeight: '200px' }}
          />

          {/* Deretan Tombol Kiri (Absolute - terkunci di pojok kiri bawah) */}
          <div className="absolute bottom-3 left-4 flex gap-2">
            <button 
              type="button" 
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors focus:outline-none" 
              aria-label="Add attachment"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Deretan Tombol Kanan (Absolute - terkunci di pojok kanan bawah) */}
          <div className="absolute bottom-3 right-4 flex gap-2 items-center">
            <button
              onClick={handleSubmit}
              disabled={!message.trim() && !isLoading}
              className={`p-2.5 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none ${
                message.trim() 
                  // Gaya tombol saat ada teks (Warna Biru / Tombol Send)
                  ? 'bg-[#4b90ff] hover:bg-blue-600 text-white shadow-md transform scale-105' 
                  // Gaya tombol saat kosong (Warna Abu-abu / Tombol Mic)
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : message.trim() ? (
                <Send size={18} className="ml-0.5" /> // Sedikit di-margin agar posisinya seimbang secara visual
              ) : (
                <Mic size={20} />
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

MessageInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isCentered: PropTypes.bool,
};

export default MessageInput;
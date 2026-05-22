import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Plus, Mic, Send, Loader2, MicOff } from 'lucide-react';

const MessageInput = ({ onSend, isLoading, isCentered = false }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const isRecordingRef = useRef(false);

  // Efek untuk membuat tinggi textarea menyesuaikan otomatis (Auto-resize)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Maaf, browser Anda tidak mendukung fitur pengenalan suara. Silakan gunakan Chrome atau Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID'; // Default Bahasa Indonesia
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    // Track the text that was in the input before recording started
    const existingText = message;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Combine existing text with new speech results
      const newText = finalTranscript || interimTranscript;
      if (existingText) {
        setMessage(existingText + ' ' + newText);
      } else {
        setMessage(newText);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      stopRecording();
      
      if (event.error === 'not-allowed') {
        alert('Akses mikrofon ditolak. Silakan izinkan akses mikrofon di pengaturan browser Anda.');
      } else if (event.error === 'no-speech') {
        // Do nothing, just stop recording silently
      }
    };

    recognition.onend = () => {
      // Only restart if we're still in recording mode (use ref to avoid stale closure)
      if (isRecordingRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Ignore - recognition might have been aborted
        }
      }
    };

    recognitionRef.current = recognition;
    
    try {
      recognition.start();
      setIsRecording(true);
      isRecordingRef.current = true;
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
    isRecordingRef.current = false;
    setRecordingTime(0);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (message.trim() && !isLoading) {
      // Stop recording if active
      if (isRecording) {
        stopRecording();
      }
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
        
        {/* Kotak Input Utama (Bentuk pil / kapsul bundar) */}
        <div className={`relative bg-white dark:bg-[#2a2a3e] rounded-full border transition-all duration-300 ${
          isRecording 
            ? 'border-red-300 dark:border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)] dark:shadow-[0_0_20px_rgba(239,68,68,0.25)]' 
            : 'border-gray-100 dark:border-gray-600'
        } ${
          !isCentered ? 'focus-within:shadow-md focus-within:border-gray-200 dark:focus-within:border-gray-500 shadow-sm' : 'shadow-sm'
        }`}>
          
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? "Sedang mendengarkan..." : "Type your message..."}
            disabled={isLoading}
            rows={1}
            className={`w-full bg-transparent resize-none px-6 ${isRecording ? 'pl-28' : 'pl-14'} pr-16 py-4 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none min-h-[56px] rounded-full text-[15px] disabled:opacity-70 leading-relaxed font-sans transition-all duration-300`}
            style={{ maxHeight: '200px' }}
          />

          {/* Deretan Tombol Kiri (Absolute - terkunci di pojok kiri bawah) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-3 flex gap-2 items-center">
            <button 
              type="button" 
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors focus:outline-none" 
              aria-label="Add attachment"
            >
              <Plus size={20} />
            </button>

            {/* Recording Timer Indicator */}
            {isRecording && (
              <div className="flex items-center gap-2 animate-fade-in">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="text-xs font-medium text-red-500 dark:text-red-400 tabular-nums">
                  {formatTime(recordingTime)}
                </span>
              </div>
            )}
          </div>

          {/* Deretan Tombol Kanan (Absolute - terkunci di pojok kanan bawah) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-3 flex gap-2 items-center">
            {/* Mic button - always visible when not typing */}
            {!message.trim() && (
              <button
                type="button"
                onClick={toggleRecording}
                disabled={isLoading}
                className={`p-2.5 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-md animate-pulse'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
              >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            )}

            {/* Send button - visible when there is text */}
            {message.trim() && (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="p-2.5 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 focus:outline-none bg-[#8FA697] hover:bg-[#7A9182] text-white shadow-sm"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} className="text-white" />
                )}
              </button>
            )}

            {/* Loading state when no text */}
            {!message.trim() && isLoading && (
              <button
                disabled
                className="p-2.5 rounded-full flex items-center justify-center text-gray-400"
              >
                <Loader2 size={18} className="animate-spin" />
              </button>
            )}
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
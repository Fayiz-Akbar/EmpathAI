import { useState } from 'react';
import { Check, X, Pin } from 'lucide-react';
import ChatActionMenu from './ChatActionMenu';

const ChatSessionItem = ({ session, isActive, onSelect, onRename, onDelete, onPin }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  const startEditing = (e) => {
    e?.stopPropagation();
    setIsEditing(true);
    setEditTitle(session.title || 'Sesi Curhat');
  };

  const submitRename = () => {
    if (editTitle.trim() !== '') {
      onRename(session._id, editTitle);
    }
    setIsEditing(false);
  };

  const cancelEditing = () => setIsEditing(false);

  const handleShare = (e) => {
    e?.stopPropagation();
    const shareUrl = `${window.location.origin}/chat/${session._id}`;

    // Cek apakah browser mendukung fitur clipboard & sedang dalam Security Context (HTTPS/localhost)
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        window.dispatchEvent(new CustomEvent('showNotification', { 
          detail: { message: 'Link chat berhasil disalin!', type: 'success' } 
        }));
      }).catch(err => {
        console.error("Gagal menyalin link:", err);
        window.dispatchEvent(new CustomEvent('showNotification', { 
          detail: { message: 'Gagal menyalin link.', type: 'error' } 
        }));
      });
    } else {
      // Fallback untuk HTTP biasa / tidak didukung HTTPS
      try {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        document.execCommand('copy');
        textArea.remove();
        
        window.dispatchEvent(new CustomEvent('showNotification', { 
          detail: { message: 'Link chat berhasil disalin! (Fallback mode)', type: 'success' } 
        }));
      } catch (err) {
        console.error("Lebih parah lagi, fallback copy gagal:", err);
        window.dispatchEvent(new CustomEvent('showNotification', { 
          detail: { message: 'Browser Anda tidak mengizinkan aksi menyalin otomatis.', type: 'error' } 
        }));
      }
    }
  };

  const handlePin = (e) => {
    e?.stopPropagation();
    if (onPin) onPin(session._id, !session.isPinned);
  };

  const handleDelete = (e) => {
    e?.stopPropagation();
    onDelete(session._id);
  };

  // Mode editing: tampilkan input rename
  if (isEditing) {
    return (
      <div className="flex items-center gap-1 w-full bg-white dark:bg-[#2a2a3e] border border-[#8FA697] rounded-lg px-2 py-1.5 shadow-sm">
        <input
          autoFocus
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitRename()}
          className="w-full text-sm outline-none bg-transparent dark:text-gray-200"
        />
        <button onClick={submitRename} className="text-green-500 hover:text-green-700 p-1">
          <Check size={14} />
        </button>
        <button onClick={cancelEditing} className="text-gray-400 hover:text-red-500 p-1">
          <X size={14} />
        </button>
      </div>
    );
  }

  // Mode normal: tampilkan judul sesi + tombol aksi saat hover
  return (
    <div
      className={`relative flex w-full items-center justify-between rounded-full transition-colors group ${
        isActive
          ? 'bg-[#8FA697]/15 dark:bg-[#8FA697]/20 text-[#5B7062] dark:text-[#A7BDAF] font-semibold'
          : 'text-gray-600 dark:text-gray-300 hover:bg-[#8FA697]/10 hover:text-[#5B7062] dark:hover:bg-gray-700'
      }`}
    >
      <button
        onClick={onSelect}
        className="truncate flex-1 flex items-center gap-2 text-left px-3 py-2 text-sm focus:outline-none"
      >
        {session.isPinned && <Pin size={12} className="text-[#8FA697] shrink-0 fill-current" />}
        <span className="truncate">{session.title || 'Sesi Curhat'}</span>
      </button>

      <ChatActionMenu 
        isPinned={session.isPinned}
        onShare={handleShare}
        onPin={handlePin}
        onRename={startEditing}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ChatSessionItem;

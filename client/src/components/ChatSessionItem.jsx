import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';

const ChatSessionItem = ({ session, isActive, onSelect, onRename, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  const startEditing = (e) => {
    e.stopPropagation();
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

  // Mode editing: tampilkan input rename
  if (isEditing) {
    return (
      <div className="flex items-center gap-1 w-full bg-white dark:bg-[#2a2a3e] border border-blue-400 rounded-lg px-2 py-1.5 shadow-sm">
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
      className={`flex w-full items-center justify-between rounded-lg transition-colors overflow-hidden group ${
        isActive
          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      <button
        onClick={onSelect}
        className="truncate flex-1 text-left px-3 py-2 text-sm focus:outline-none"
      >
        {session.title || 'Sesi Curhat'}
      </button>

      {/* Tombol aksi: muncul saat hover */}
      <div className="hidden group-hover:flex items-center gap-1 pr-2 shrink-0">
        <button onClick={startEditing} className="p-1 text-gray-400 hover:text-blue-500 transition-colors">
          <Pencil size={14} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(session._id); }}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default ChatSessionItem;

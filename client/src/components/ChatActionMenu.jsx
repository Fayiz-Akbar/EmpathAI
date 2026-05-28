import { Share2, Pin, Pencil, Trash2, MoreVertical } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const ChatActionMenu = ({ isPinned, onShare, onPin, onRename, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (e, action) => {
    e.stopPropagation();
    if (action) action(e);
    setIsOpen(false);
  };

  return (
    <div className="hidden group-hover:flex items-center pr-2 shrink-0 relative" ref={menuRef}>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="p-1 text-gray-400 hover:text-[#8FA697] hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors focus:outline-none"
      >
        <MoreVertical size={16} />
      </button>
      
      {isOpen && (
        <div className="absolute right-2 top-full mt-1 w-32 bg-white dark:bg-[#2a2a3e] border border-gray-100 dark:border-gray-600 rounded-lg shadow-lg py-1 z-50 animate-fade-in text-sm font-normal">
          <button 
            onClick={(e) => handleAction(e, onShare)}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <Share2 size={14} /> <span>Share</span>
          </button>
          <button 
            onClick={(e) => handleAction(e, onPin)}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <Pin size={14} /> <span>{isPinned ? 'Unpin' : 'Pin'}</span>
          </button>
          <button 
            onClick={(e) => handleAction(e, onRename)}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <Pencil size={14} /> <span>Rename</span>
          </button>
          <button 
            onClick={(e) => handleAction(e, onDelete)}
            className="w-full flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
          >
            <Trash2 size={14} /> <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatActionMenu;

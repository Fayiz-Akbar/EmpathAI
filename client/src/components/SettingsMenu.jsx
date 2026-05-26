import { useState, useRef, useEffect } from 'react';
import { Settings, Palette, HelpCircle, Lock, ChevronDown, Monitor, Sun, Moon, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getCurrentUser } from '../services/authService';
import ChangePasswordModal from './ChangePasswordModal';

const THEME_OPTIONS = [
  { key: 'system', label: 'System', icon: Monitor, iconClass: 'text-gray-500 dark:text-gray-400' },
  { key: 'light',  label: 'Light',  icon: Sun,     iconClass: 'text-amber-500' },
  { key: 'dark',   label: 'Dark',   icon: Moon,    iconClass: 'text-indigo-500' },
];

const SettingsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isThemeExpanded, setIsThemeExpanded] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const menuRef = useRef(null);
  const { theme, setTheme } = useTheme();
  const user = getCurrentUser();

  // Tutup menu saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsThemeExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeSelect = (selectedTheme) => {
    setTheme(selectedTheme);
    setIsOpen(false);
    setIsThemeExpanded(false);
  };

  const handleOpenChangePassword = () => {
    setIsOpen(false);
    setIsThemeExpanded(false);
    setIsChangePasswordOpen(true);
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    if (isOpen) setIsThemeExpanded(false);
  };

  return (
    <>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 relative" ref={menuRef}>
        {/* Trigger Button */}
        <button
          onClick={toggleMenu}
          className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-[#5B7062] dark:hover:text-[#A7BDAF] w-full p-2 rounded-xl hover:bg-[#8FA697]/10 dark:hover:bg-[#8FA697]/20 transition-colors focus:outline-none group"
        >
          <Settings size={18} className="group-hover:text-[#5B7062] transition-colors" />
          <span className="text-sm font-medium">Settings & help</span>
        </button>

        {/* Popup Menu — posisi di atas tombol, tetap di dalam sidebar */}
        {isOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-white dark:bg-[#2a2a3e] border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl py-1.5 z-[9999] animate-fade-in">

            {/* Theme — klik untuk expand/collapse pilihan di bawahnya */}
            <div>
              <button
                onClick={() => setIsThemeExpanded((prev) => !prev)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-[#8FA697]/10 hover:text-[#5B7062] dark:hover:bg-gray-700 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <Palette size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-[#5B7062]" />
                  <span>Theme</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform duration-200 ${isThemeExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Theme Options — expand inline (accordion) */}
              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  isThemeExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {THEME_OPTIONS.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleThemeSelect(item.key)}
                    className={`w-full flex items-center justify-between pl-11 pr-4 py-2 text-sm transition-colors text-left ${
                      theme === item.key
                        ? 'text-[#5B7062] dark:text-[#A7BDAF] bg-[#8FA697]/15 dark:bg-[#8FA697]/20 font-medium'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-[#8FA697]/10 hover:text-[#5B7062] dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={15} className={item.iconClass} />
                      <span>{item.label}</span>
                    </div>
                    {theme === item.key && (
                      <Check size={14} className="text-[#8FA697] dark:text-[#A7BDAF]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Change Password — hanya tampil jika user sudah login */}
            {user && (
              <button
                onClick={handleOpenChangePassword}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-[#8FA697]/10 hover:text-[#5B7062] dark:hover:bg-gray-700 transition-colors text-left group"
              >
                <Lock size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-[#5B7062]" />
                <span>Change Password</span>
              </button>
            )}

            {/* Help */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-[#8FA697]/10 hover:text-[#5B7062] dark:hover:bg-gray-700 transition-colors text-left group"
            >
              <HelpCircle size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-[#5B7062]" />
              <span>Help</span>
            </button>
          </div>
        )}
      </div>

      {/* Change Password Modal — rendered outside the settings menu container */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
};

export default SettingsMenu;

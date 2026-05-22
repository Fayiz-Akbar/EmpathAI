import { useState, useRef, useEffect } from 'react';
import { Settings, Palette, HelpCircle, ChevronDown, Monitor, Sun, Moon, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const THEME_OPTIONS = [
  { key: 'system', label: 'System', icon: Monitor, iconClass: 'text-gray-500 dark:text-gray-400' },
  { key: 'light',  label: 'Light',  icon: Sun,     iconClass: 'text-amber-500' },
  { key: 'dark',   label: 'Dark',   icon: Moon,    iconClass: 'text-indigo-500' },
];

const SettingsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isThemeExpanded, setIsThemeExpanded] = useState(false);
  const menuRef = useRef(null);
  const { theme, setTheme } = useTheme();

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

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    if (isOpen) setIsThemeExpanded(false);
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={toggleMenu}
        className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white w-full p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
      >
        <Settings size={18} />
        <span className="text-sm font-medium">Settings & help</span>
      </button>

      {/* Popup Menu — posisi di atas tombol, tetap di dalam sidebar */}
      {isOpen && (
        <div className="absolute bottom-full left-3 right-3 mb-2 bg-white dark:bg-[#2a2a3e] border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl py-1.5 z-[9999] animate-fade-in">

          {/* Theme — klik untuk expand/collapse pilihan di bawahnya */}
          <div>
            <button
              onClick={() => setIsThemeExpanded((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Palette size={16} className="text-gray-500 dark:text-gray-400" />
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
              {THEME_OPTIONS.map(({ key, label, icon: Icon, iconClass }) => (
                <button
                  key={key}
                  onClick={() => handleThemeSelect(key)}
                  className={`w-full flex items-center justify-between pl-11 pr-4 py-2 text-sm transition-colors text-left ${
                    theme === key
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={15} className={iconClass} />
                    <span>{label}</span>
                  </div>
                  {theme === key && (
                    <Check size={14} className="text-blue-600 dark:text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Help */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <HelpCircle size={16} className="text-gray-500 dark:text-gray-400" />
            <span>Help</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;

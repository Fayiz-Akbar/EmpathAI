import { Search, X } from 'lucide-react';
import PropTypes from 'prop-types';

const SearchBar = ({ value, onChange, placeholder = "Search...", onClose, autoFocus = true }) => {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-[#2a2a3e] border border-[#8FA697]/50 rounded-full px-3 py-1.5 shadow-sm w-full animate-fade-in transition-all focus-within:border-[#8FA697] focus-within:ring-2 focus-within:ring-[#8FA697]/20">
      <Search size={16} className="text-[#8FA697]" />
      <input
        type="text"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-[13px] outline-none bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-400"
      />
      <button 
        onClick={onClose} 
        className="text-gray-400 hover:text-red-500 p-1 focus:outline-none shrink-0 rounded-full transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
};

export default SearchBar;

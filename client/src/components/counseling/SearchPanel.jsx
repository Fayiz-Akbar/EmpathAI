import { useState, useEffect } from 'react';
import { Search, Loader2, X, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import FacilityCard from './FacilityCard';

const FILTER_OPTIONS = [
  { key: 'all',             label: 'Semua' },
  { key: 'hospital',        label: 'Rumah Sakit' },
  { key: 'clinic',          label: 'Klinik' },
  { key: 'doctors',         label: 'Psikolog' },
  { key: 'psychotherapist', label: 'Psikoterapis' },
  { key: 'counselling',     label: 'Konseling' },
];

/**
 * SearchPanel — Floating overlay search bar + expandable results panel.
 * Inspired by Google Maps: search bar sits on top of the map,
 * results panel slides down only when there are results.
 */
const SearchPanel = ({
  facilities,
  isLoading,
  error,
  selectedFacility,
  onSearch,
  onSelectFacility,
  onClear,
  locationLabel,
}) => {
  const [inputValue, setInputValue] = useState(locationLabel || '');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sync with parent's location label (e.g. when geolocation succeeds)
  useEffect(() => {
    if (locationLabel && !inputValue) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputValue(locationLabel);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationLabel]);

  const hasResults = facilities.length > 0;
  const hasSearched = hasResults || error;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
      setActiveFilter('all');
      setIsCollapsed(false);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setActiveFilter('all');
    setIsCollapsed(false);
    if (onClear) onClear();
  };

  // Filter results by type
  const filteredFacilities = activeFilter === 'all'
    ? facilities
    : facilities.filter((f) => f.typeKey === activeFilter);

  return (
    <div className="absolute top-4 left-4 z-[1000] w-[calc(100%-2rem)] sm:w-[420px]">

      {/* Location Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden p-1.5 gap-2">
          <div className="pl-2 text-[#8FA697]">
            <MapPin size={20} />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Pilih lokasi (Kota/Daerah)..."
            className="flex-1 px-2 py-2.5 text-sm bg-transparent focus:outline-none placeholder:text-gray-400 font-medium text-gray-700"
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#5B7062] hover:bg-[#4a5c50] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Pindai
          </button>
        </div>
      </form>

      {/* Results Panel — only visible after a search */}
      {hasSearched && (
        <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

          {/* Results Header — clickable to toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none"
          >
            <span>
              {error
                ? '⚠️ Pencarian gagal'
                : `${facilities.length} fasilitas ditemukan`}
            </span>
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>

          {!isCollapsed && (
            <>
              {/* Error State */}
              {error && (
                <div className="px-4 pb-3">
                  <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 border border-red-100">
                    {error}
                  </p>
                </div>
              )}

              {/* Filter Chips */}
              {hasResults && (
                <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
                  {FILTER_OPTIONS.map((opt) => {
                    const count = opt.key === 'all'
                      ? facilities.length
                      : facilities.filter((f) => f.typeKey === opt.key).length;
                    if (opt.key !== 'all' && count === 0) return null;

                    return (
                      <button
                        key={opt.key}
                        onClick={() => setActiveFilter(opt.key)}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all focus:outline-none ${
                          activeFilter === opt.key
                            ? 'bg-[#8FA697] text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {opt.label} ({count})
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Scrollable Results List */}
              {hasResults && (
                <div className="max-h-[45vh] overflow-y-auto px-3 pb-3 space-y-2">
                  {filteredFacilities.length === 0 ? (
                    <p className="text-center text-xs text-gray-400 py-4">
                      Tidak ada fasilitas dengan tipe ini.
                    </p>
                  ) : (
                    filteredFacilities.map((facility) => (
                      <FacilityCard
                        key={facility.id}
                        facility={facility}
                        isActive={selectedFacility?.id === facility.id}
                        onSelect={onSelectFacility}
                      />
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPanel;

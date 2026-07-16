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
  locationLabel,
}) => {
  const [inputValue, setInputValue] = useState(locationLabel || '');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sync with parent's location label (e.g. when geolocation succeeds or 'Lokasi Saya' is clicked)
  useEffect(() => {
    if (locationLabel) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputValue(locationLabel);
    }
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
          <select
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 px-2 py-2.5 text-sm bg-transparent focus:outline-none text-gray-700 font-medium cursor-pointer appearance-none"
            style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
          >
            <option value="Lokasi Anda">📍 Lokasi Anda Saat Ini</option>
            <optgroup label="Pulau Sumatera">
              <option value="Aceh">Aceh</option>
              <option value="Sumatera Utara">Sumatera Utara</option>
              <option value="Sumatera Barat">Sumatera Barat</option>
              <option value="Riau">Riau</option>
              <option value="Jambi">Jambi</option>
              <option value="Sumatera Selatan">Sumatera Selatan</option>
              <option value="Bengkulu">Bengkulu</option>
              <option value="Lampung">Lampung</option>
              <option value="Kepulauan Bangka Belitung">Kepulauan Bangka Belitung</option>
              <option value="Kepulauan Riau">Kepulauan Riau</option>
              <option value="Medan">Medan</option>
              <option value="Palembang">Palembang</option>
              <option value="Batam">Batam</option>
              <option value="Pekanbaru">Pekanbaru</option>
              <option value="Bandar Lampung">Bandar Lampung</option>
              <option value="Padang">Padang</option>
            </optgroup>
            <optgroup label="Pulau Jawa & Bali">
              <option value="DKI Jakarta">DKI Jakarta</option>
              <option value="Jawa Barat">Jawa Barat</option>
              <option value="Jawa Tengah">Jawa Tengah</option>
              <option value="DI Yogyakarta">DI Yogyakarta</option>
              <option value="Jawa Timur">Jawa Timur</option>
              <option value="Banten">Banten</option>
              <option value="Bali">Bali</option>
              <option value="Surabaya">Surabaya</option>
              <option value="Bandung">Bandung</option>
              <option value="Semarang">Semarang</option>
              <option value="Malang">Malang</option>
              <option value="Surakarta">Surakarta</option>
              <option value="Denpasar">Denpasar</option>
            </optgroup>
            <optgroup label="Nusa Tenggara">
              <option value="Nusa Tenggara Barat">Nusa Tenggara Barat</option>
              <option value="Nusa Tenggara Timur">Nusa Tenggara Timur</option>
              <option value="Mataram">Mataram</option>
              <option value="Kupang">Kupang</option>
            </optgroup>
            <optgroup label="Pulau Kalimantan">
              <option value="Kalimantan Barat">Kalimantan Barat</option>
              <option value="Kalimantan Tengah">Kalimantan Tengah</option>
              <option value="Kalimantan Selatan">Kalimantan Selatan</option>
              <option value="Kalimantan Timur">Kalimantan Timur</option>
              <option value="Kalimantan Utara">Kalimantan Utara</option>
              <option value="Samarinda">Samarinda</option>
              <option value="Pontianak">Pontianak</option>
              <option value="Banjarmasin">Banjarmasin</option>
              <option value="Balikpapan">Balikpapan</option>
            </optgroup>
            <optgroup label="Pulau Sulawesi">
              <option value="Sulawesi Utara">Sulawesi Utara</option>
              <option value="Sulawesi Tengah">Sulawesi Tengah</option>
              <option value="Sulawesi Selatan">Sulawesi Selatan</option>
              <option value="Sulawesi Tenggara">Sulawesi Tenggara</option>
              <option value="Gorontalo">Gorontalo</option>
              <option value="Sulawesi Barat">Sulawesi Barat</option>
              <option value="Makassar">Makassar</option>
              <option value="Manado">Manado</option>
            </optgroup>
            <optgroup label="Kepulauan Maluku & Papua">
              <option value="Maluku">Maluku</option>
              <option value="Maluku Utara">Maluku Utara</option>
              <option value="Papua">Papua</option>
              <option value="Papua Barat">Papua Barat</option>
              <option value="Papua Selatan">Papua Selatan</option>
              <option value="Papua Tengah">Papua Tengah</option>
              <option value="Papua Pegunungan">Papua Pegunungan</option>
              <option value="Papua Barat Daya">Papua Barat Daya</option>
              <option value="Ambon">Ambon</option>
              <option value="Jayapura">Jayapura</option>
            </optgroup>
          </select>
          
          <div className="text-gray-400 pointer-events-none pr-2">
            <ChevronDown size={16} />
          </div>

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

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

const toTitleCase = (str) => {
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const SearchPanel = ({
  facilities,
  isLoading,
  error,
  selectedFacility,
  onSearch,
  onSelectFacility,
  autoLocation,
}) => {
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  
  const [selectedProvinceId, setSelectedProvinceId] = useState('');
  const [selectedRegencyName, setSelectedRegencyName] = useState('');

  const [activeFilter, setActiveFilter] = useState('all');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Fetch provinces on mount
  useEffect(() => {
    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error('Failed to load provinces:', err));
  }, []);

  // Fetch regencies when a province is selected
  useEffect(() => {
    if (!selectedProvinceId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRegencies([]);
      setSelectedRegencyName('');
      return;
    }
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvinceId}.json`)
      .then(res => res.json())
      .then(data => {
        setRegencies(data);
        // Only reset if the current regency doesn't exist in the new list
        setSelectedRegencyName(prev => {
          return data.some(r => r.name.toLowerCase() === prev.toLowerCase()) ? prev : '';
        });
      })
      .catch(err => console.error('Failed to load regencies:', err));
  }, [selectedProvinceId]);

  // Handle autoLocation matching
  useEffect(() => {
    if (autoLocation && autoLocation.province && provinces.length > 0) {
      // Nominatim "Lampung", emsifa "LAMPUNG"
      const matchedProv = provinces.find(p => p.name.toLowerCase() === autoLocation.province.toLowerCase());
      if (matchedProv) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedProvinceId(matchedProv.id);
      }
    }
  }, [autoLocation, provinces]);

  useEffect(() => {
    const currentProvName = provinces.find(p => p.id === selectedProvinceId)?.name?.toLowerCase();
    if (autoLocation && autoLocation.regency && regencies.length > 0 && currentProvName === autoLocation.province.toLowerCase()) {
      // Nominatim might return "Bandar Lampung", emsifa "KOTA BANDAR LAMPUNG"
      // We do a partial match (e.g., includes)
      const target = autoLocation.regency.toLowerCase();
      const matchedReg = regencies.find(r => r.name.toLowerCase().includes(target) || target.includes(r.name.toLowerCase().replace('kota ', '').replace('kabupaten ', '')));
      if (matchedReg) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedRegencyName(matchedReg.name);
      }
    }
  }, [autoLocation, regencies, selectedProvinceId, provinces]);

  const hasResults = facilities.length > 0;
  const hasSearched = hasResults || error;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProvinceId || !selectedRegencyName) return;

    const provName = provinces.find(p => p.id === selectedProvinceId)?.name || '';
    
    // Fix known typo from Emsifa API (Tulangbawang -> Tulang Bawang)
    const cleanRegency = selectedRegencyName.replace(/tulangbawang/i, 'Tulang Bawang');
    const query = `${toTitleCase(cleanRegency)}, ${toTitleCase(provName)}`;

    onSearch(query);
    setActiveFilter('all');
    setIsCollapsed(false);
  };

  // Filter results by type
  const filteredFacilities = activeFilter === 'all'
    ? facilities
    : facilities.filter((f) => f.typeKey === activeFilter);

  return (
    <div className="absolute top-4 left-4 z-[1000] w-[calc(100%-2rem)] sm:w-[420px]">

      {/* Location Bar */}
      <form onSubmit={handleSubmit} className="relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden p-2 flex flex-col gap-2">
        <div className="flex items-center gap-2 px-1">
          <MapPin size={18} className="text-[#8FA697]" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cakupan Wilayah</p>
        </div>
        
        <div className="flex flex-col gap-2">
          {/* Dropdown Provinsi */}
          <div className="relative flex-1 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
            <select
              value={selectedProvinceId}
              onChange={(e) => {
                setSelectedProvinceId(e.target.value);
                setSelectedRegencyName('');
              }}
              className="w-full pl-3 pr-8 py-2 text-sm bg-transparent focus:outline-none text-gray-700 font-medium cursor-pointer appearance-none"
              style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
              required
            >
              <option value="" disabled>Pilih Provinsi...</option>
              {provinces.map(prov => (
                <option key={prov.id} value={prov.id}>
                  {toTitleCase(prov.name)}
                </option>
              ))}
            </select>
            <div className="absolute right-2 text-gray-400 pointer-events-none">
              <ChevronDown size={16} />
            </div>
          </div>

          {/* Dropdown Kabupaten/Kota */}
          <div className={`relative flex-1 bg-gray-50 rounded-lg border border-gray-200 flex items-center ${!selectedProvinceId ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <select
              value={selectedRegencyName}
              onChange={(e) => setSelectedRegencyName(e.target.value)}
              className="w-full pl-3 pr-8 py-2 text-sm bg-transparent focus:outline-none text-gray-700 font-medium cursor-pointer appearance-none"
              style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
              disabled={!selectedProvinceId}
              required
            >
              <option value="" disabled>Pilih Kabupaten/Kota...</option>
              {regencies.map(reg => (
                <option key={reg.id} value={reg.name}>
                  {toTitleCase(reg.name)}
                </option>
              ))}
            </select>
            <div className="absolute right-2 text-gray-400 pointer-events-none">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !selectedProvinceId || !selectedRegencyName}
          className="mt-1 bg-[#5B7062] hover:bg-[#4a5c50] disabled:bg-gray-300 disabled:cursor-not-allowed text-white w-full py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          Pindai Fasilitas
        </button>
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

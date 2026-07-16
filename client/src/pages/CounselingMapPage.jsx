import { useState, useCallback, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ShieldAlert, LogIn, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getCurrentUser } from '../services/authService';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import ConfirmActionModal from '../components/ConfirmActionModal';
import SearchPanel from '../components/counseling/SearchPanel';
import FacilityPopup from '../components/counseling/FacilityPopup';
import { searchFacilitiesByPlace } from '../services/overpassService';

/** Default center: Jakarta (fallback when geolocation is denied) */
const DEFAULT_CENTER = { lat: -6.2088, lng: 106.8456 };
const DEFAULT_ZOOM = 13;
const SEARCH_ZOOM = 13;

/** Marker color per facility type */
const MARKER_COLORS = {
  hospital:        { fill: '#dc2626', stroke: '#991b1b' },
  clinic:          { fill: '#2563eb', stroke: '#1e40af' },
  doctors:         { fill: '#9333ea', stroke: '#6b21a8' },
  psychotherapist: { fill: '#4f46e5', stroke: '#3730a3' },
  counselling:     { fill: '#059669', stroke: '#047857' },
};

/**
 * MapFlyTo — programmatically animate the map to a new center.
 */
const MapFlyTo = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], zoom || DEFAULT_ZOOM, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
};

/**
 * CounselingMapPage — Full-screen map with floating search bar.
 * Results appear only when the user performs a search (Google Maps-style UX).
 * On load, detects user geolocation and centers the map (without querying Overpass).
 */
const CounselingMapPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const { t } = useTranslation();

  // Sidebar
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Map & search
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [userLocation, setUserLocation] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const markerRefs = useRef({});

  const handleMenuClick = () => {
    setIsMobileSidebarOpen(true);
    setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
  };

  /**
   * On mount: detect user geolocation and center the map.
   * Does NOT auto-search — only sets the map center.
   */
  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(loc);
        setMapCenter(loc);
      },
      () => {
        // Geolocation denied — keep Jakarta as default
      },
      { timeout: 8000 }
    );
  }, []);

  /**
   * Search by city/place name.
   */
  const handleSearch = useCallback(async (placeName) => {
    setIsLoading(true);
    setError(null);
    setSelectedFacility(null);

    try {
      const { center, facilities: results } = await searchFacilitiesByPlace(placeName);
      setMapCenter(center);
      setFacilities(results);
    } catch (err) {
      console.error('Pencarian gagal:', err);
      setError(err.message || 'Terjadi kesalahan saat mencari. Coba lagi.');
      setFacilities([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear all search results and reset to user location.
   */
  const handleClear = useCallback(() => {
    setFacilities([]);
    setSelectedFacility(null);
    setError(null);
    if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [userLocation]);

  /**
   * Select a facility: highlight in list + fly to marker + open popup.
   */
  const handleSelectFacility = useCallback((facility) => {
    setSelectedFacility(facility);
    setMapCenter({ lat: facility.lat, lng: facility.lng });

    setTimeout(() => {
      const ref = markerRefs.current[facility.id];
      if (ref) ref.openPopup();
    }, 400);
  }, []);

  return (
    <div className="h-screen w-full flex overflow-hidden bg-gray-50 font-sans text-gray-800 relative">

      {/* Mobile sidebar overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 md:static md:block
        transform transition-transform duration-300 ease-in-out h-full border-r border-gray-200
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar
          isDesktopOpen={isDesktopSidebarOpen}
          onToggleDesktop={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
          chatSessions={[]}
          onNewChat={() => navigate('/chat')}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative min-w-0">
        <ChatHeader
          user={user}
          isDesktopSidebarOpen={isDesktopSidebarOpen}
          onMenuClick={handleMenuClick}
        />

        {/* Full-screen Map */}
        <div className="flex-1 relative z-0">
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={DEFAULT_ZOOM}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapFlyTo center={mapCenter} zoom={SEARCH_ZOOM} />

            {/* User location indicator */}
            {userLocation && (
              <CircleMarker
                center={[userLocation.lat, userLocation.lng]}
                pathOptions={{
                  fillColor: '#3b82f6',
                  color: '#1d4ed8',
                  fillOpacity: 0.9,
                  weight: 2,
                }}
                radius={8}
              >
                <Popup>
                  <div className="p-1">
                    <p className="text-sm font-medium text-gray-800">📍 Lokasi Anda</p>
                  </div>
                </Popup>
              </CircleMarker>
            )}

            {/* Facility markers */}
            {facilities.map((facility) => {
              const colors = MARKER_COLORS[facility.typeKey] || MARKER_COLORS.clinic;
              const isSelected = selectedFacility?.id === facility.id;

              return (
                <CircleMarker
                  key={facility.id}
                  center={[facility.lat, facility.lng]}
                  ref={(ref) => { markerRefs.current[facility.id] = ref; }}
                  pathOptions={{
                    fillColor: colors.fill,
                    color: isSelected ? '#000' : colors.stroke,
                    fillOpacity: isSelected ? 1 : 0.75,
                    weight: isSelected ? 3 : 1.5,
                  }}
                  radius={isSelected ? 12 : 9}
                  eventHandlers={{
                    click: () => setSelectedFacility(facility),
                  }}
                >
                  <Popup>
                    <FacilityPopup facility={facility} />
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {/* Floating Search Panel (Google Maps-style) */}
          <SearchPanel
            facilities={facilities}
            isLoading={isLoading}
            error={error}
            selectedFacility={selectedFacility}
            onSearch={handleSearch}
            onSelectFacility={handleSelectFacility}
            onClear={handleClear}
          />

          {/* Map Legend — bottom-right */}
          {facilities.length > 0 && (
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-3 z-[1000]">
              <p className="text-[11px] font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                <MapPin size={12} /> Legenda
              </p>
              <div className="space-y-1.5">
                {Object.entries(MARKER_COLORS).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: val.fill, borderColor: val.stroke }}
                    />
                    <span className="text-[11px] text-gray-600">
                      {key === 'doctors' ? 'Psikolog/Dokter' :
                       key === 'psychotherapist' ? 'Psikoterapis' :
                       key === 'counselling' ? 'Konseling' :
                       key === 'hospital' ? 'Rumah Sakit' : 'Klinik'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login Prompt Modal */}
      <ConfirmActionModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        title={t('auth.accessRestricted')}
        description={t('auth.accessRestrictedDesc')}
        icon={ShieldAlert}
        confirmText={t('auth.login')}
        confirmIcon={LogIn}
        onConfirm={() => navigate('/login')}
      />
    </div>
  );
};

export default CounselingMapPage;

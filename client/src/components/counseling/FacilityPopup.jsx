import { ExternalLink } from 'lucide-react';

/**
 * FacilityPopup — Content rendered inside a Leaflet Popup when a marker is clicked.
 * Kept minimal to fit the popup's small viewport.
 */
const FacilityPopup = ({ facility }) => {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`;

  return (
    <div className="p-1 min-w-[200px] max-w-[260px]">
      <h3 className="font-bold text-gray-800 text-sm mb-0.5 leading-tight">
        {facility.name}
      </h3>
      <span className="text-[11px] font-medium text-blue-600 block mb-2">
        {facility.typeLabel}
      </span>

      {facility.address && (
        <p className="text-[11px] text-gray-600 mb-1.5 leading-relaxed">
          {facility.address}
        </p>
      )}

      {facility.phone && (
        <p className="text-[11px] text-gray-600 mb-2">
          📞 {facility.phone}
        </p>
      )}

      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 hover:underline"
      >
        <ExternalLink size={10} />
        Buka di Google Maps
      </a>
    </div>
  );
};

export default FacilityPopup;

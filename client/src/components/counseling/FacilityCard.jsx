import { Building2, Stethoscope, Brain, HeartHandshake, Phone, MapPin, ExternalLink, Clock } from 'lucide-react';

/**
 * Icon and color mapping for facility types.
 */
const TYPE_CONFIG = {
  hospital:       { icon: Building2,     color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-100' },
  clinic:         { icon: Stethoscope,   color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
  doctors:        { icon: Brain,         color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  psychotherapist: { icon: Brain,        color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  counselling:    { icon: HeartHandshake, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
};

/**
 * FacilityCard — Displays a single facility's info in the search results panel.
 */
const FacilityCard = ({ facility, isActive, onSelect }) => {
  const config = TYPE_CONFIG[facility.typeKey] || TYPE_CONFIG.clinic;
  const Icon = config.icon;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`;

  return (
    <button
      onClick={() => onSelect(facility)}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 focus:outline-none group ${
        isActive
          ? `${config.bg} ${config.border} shadow-sm ring-1 ring-${config.color.replace('text-', '')}/20`
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      {/* Header: Icon + Name + Type */}
      <div className="flex items-start gap-3">
        <div className={`shrink-0 p-2 rounded-lg ${config.bg}`}>
          <Icon size={18} className={config.color} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-800 truncate leading-tight">
            {facility.name}
          </h3>
          <span className={`text-[11px] font-medium ${config.color} mt-0.5 inline-block`}>
            {facility.typeLabel}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="mt-2.5 space-y-1.5 pl-[42px]">
        {facility.address && (
          <div className="flex items-start gap-1.5 text-xs text-gray-500">
            <MapPin size={12} className="shrink-0 mt-0.5" />
            <span className="line-clamp-2">{facility.address}</span>
          </div>
        )}
        {facility.phone && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Phone size={12} className="shrink-0" />
            <span>{facility.phone}</span>
          </div>
        )}
        {facility.openingHours && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock size={12} className="shrink-0" />
            <span className="truncate">{facility.openingHours}</span>
          </div>
        )}
      </div>

      {/* Action: Directions */}
      <div className="mt-3 pl-[42px]">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ExternalLink size={12} />
          Petunjuk Arah
        </a>
      </div>
    </button>
  );
};

export default FacilityCard;

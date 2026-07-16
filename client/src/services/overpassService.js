import axios from 'axios';

const OVERPASS_API = 'https://overpass-api.de/api/interpreter';
const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

/**
 * Facility type mapping from OSM tags to readable Indonesian labels.
 */
const FACILITY_TYPES = {
  hospital: 'Rumah Sakit',
  clinic: 'Klinik',
  doctors: 'Dokter/Psikolog',
  psychotherapist: 'Psikoterapis',
  counselling: 'Konseling',
};

/**
 * Build an Overpass QL query to find mental health facilities
 * within a radius (meters) of a lat/lng coordinate.
 */
const buildOverpassQuery = (lat, lng, radius = 15000) => {
  return `
    [out:json][timeout:30];
    (
      node["amenity"="clinic"](around:${radius},${lat},${lng});
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      node["amenity"="doctors"](around:${radius},${lat},${lng});
      node["healthcare"="psychotherapist"](around:${radius},${lat},${lng});
      node["healthcare"="counselling"](around:${radius},${lat},${lng});
      node["healthcare:speciality"="psychiatry"](around:${radius},${lat},${lng});
      node["healthcare:speciality"="psychology"](around:${radius},${lat},${lng});
      way["amenity"="clinic"](around:${radius},${lat},${lng});
      way["amenity"="hospital"](around:${radius},${lat},${lng});
      way["amenity"="doctors"](around:${radius},${lat},${lng});
      way["healthcare"="psychotherapist"](around:${radius},${lat},${lng});
      way["healthcare"="counselling"](around:${radius},${lat},${lng});
      way["healthcare:speciality"="psychiatry"](around:${radius},${lat},${lng});
      way["healthcare:speciality"="psychology"](around:${radius},${lat},${lng});
    );
    out center body;
  `;
};

/**
 * Determine a human-readable facility type from OSM tags.
 */
const classifyFacility = (tags) => {
  if (tags['healthcare:speciality'] === 'psychiatry' || tags['healthcare:speciality'] === 'psychology') {
    return 'doctors';
  }
  if (tags.healthcare === 'psychotherapist') return 'psychotherapist';
  if (tags.healthcare === 'counselling') return 'counselling';
  if (tags.amenity === 'hospital') return 'hospital';
  if (tags.amenity === 'doctors') return 'doctors';
  return 'clinic';
};

/**
 * Parse raw Overpass API elements into a clean facility array.
 */
const parseElements = (elements) => {
  const seen = new Set();

  return elements
    .map((el) => {
      const lat = el.lat || el.center?.lat;
      const lng = el.lon || el.center?.lon;
      if (!lat || !lng) return null;

      const tags = el.tags || {};
      const name = tags.name || tags['name:id'] || tags['name:en'];
      if (!name) return null;

      // Deduplicate by name + approximate location
      const dedupeKey = `${name}-${lat.toFixed(3)}-${lng.toFixed(3)}`;
      if (seen.has(dedupeKey)) return null;
      seen.add(dedupeKey);

      const typeKey = classifyFacility(tags);

      return {
        id: el.id,
        name,
        lat,
        lng,
        typeKey,
        typeLabel: FACILITY_TYPES[typeKey] || 'Fasilitas Kesehatan',
        address: [
          tags['addr:street'],
          tags['addr:city'],
          tags['addr:postcode'],
        ].filter(Boolean).join(', ') || null,
        phone: tags.phone || tags['contact:phone'] || null,
        website: tags.website || tags['contact:website'] || null,
        openingHours: tags.opening_hours || null,
      };
    })
    .filter(Boolean);
};

/**
 * Search mental health facilities around a coordinate.
 * @param {number} lat
 * @param {number} lng
 * @param {number} radius — search radius in meters (default 15km)
 * @returns {Promise<Array>}
 */
export const searchFacilitiesByCoord = async (lat, lng, radius = 15000) => {
  const query = buildOverpassQuery(lat, lng, radius);

  const response = await axios.post(
    OVERPASS_API,
    `data=${encodeURIComponent(query)}`,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 35000,
    }
  );

  return parseElements(response.data.elements || []);
};

/**
 * Geocode a place name using Nominatim, then search facilities nearby.
 * @param {string} placeName — city or area name (e.g. "Jakarta")
 * @param {number} radius — search radius in meters
 * @returns {Promise<{ center: { lat, lng }, facilities: Array }>}
 */
export const searchFacilitiesByPlace = async (placeName, radius = 15000) => {
  // Geocode the place name
  const geoRes = await axios.get(`${NOMINATIM_API}/search`, {
    params: {
      q: placeName,
      format: 'json',
      limit: 1,
      countrycodes: 'id',
    },
    timeout: 10000,
  });

  if (!geoRes.data || geoRes.data.length === 0) {
    throw new Error('Lokasi tidak ditemukan. Coba kata kunci lain.');
  }

  const { lat, lon } = geoRes.data[0];
  const center = { lat: parseFloat(lat), lng: parseFloat(lon) };

  const facilities = await searchFacilitiesByCoord(center.lat, center.lng, radius);

  return { center, facilities };
};

export { FACILITY_TYPES };

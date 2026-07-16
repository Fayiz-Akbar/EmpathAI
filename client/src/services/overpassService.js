import axios from 'axios';

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter'
];

const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

/**
 * Execute Overpass query with fallback mechanism to handle 429 Too Many Requests.
 */
const fetchFromOverpass = async (query) => {
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await axios.post(
        endpoint,
        `data=${encodeURIComponent(query)}`,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 35000,
        }
      );
      return response.data;
    } catch (err) {
      if (err.response?.status === 429) {
        console.warn(`Overpass endpoint ${endpoint} busy (429). Trying next...`);
        continue;
      }
      throw err;
    }
  }
  
  throw new Error('Semua server pemetaan sedang sibuk. Mohon tunggu beberapa detik lalu coba lagi.');
};

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
 * Build an optimized Overpass QL query to find mental health facilities
 * within a radius (meters) of a lat/lng coordinate.
 */
const buildOverpassQuery = (lat, lng, radius = 8000) => {
  return `
    [out:json][timeout:25];
    (
      nwr["amenity"="clinic"](around:${radius},${lat},${lng});
      nwr["amenity"="hospital"](around:${radius},${lat},${lng});
      nwr["amenity"="doctors"](around:${radius},${lat},${lng});
      nwr["healthcare"="psychotherapist"](around:${radius},${lat},${lng});
      nwr["healthcare"="counselling"](around:${radius},${lat},${lng});
      nwr["healthcare:speciality"="psychiatry"](around:${radius},${lat},${lng});
      nwr["healthcare:speciality"="psychology"](around:${radius},${lat},${lng});
    );
    out center;
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
  const data = await fetchFromOverpass(query);
  return parseElements(data.elements || []);
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

/**
 * Geocode an area name, find its OSM Area ID, and search inside its boundaries.
 * Highly recommended for large administrative areas (Provinces/Regencies).
 */
export const searchFacilitiesByArea = async (placeName) => {
  const geoRes = await axios.get(`${NOMINATIM_API}/search`, {
    params: { q: placeName, format: 'json', limit: 1, countrycodes: 'id' },
    timeout: 10000,
  });

  if (!geoRes.data || geoRes.data.length === 0) {
    throw new Error('Wilayah tidak ditemukan.');
  }

  const { lat, lon, osm_type, osm_id } = geoRes.data[0];
  const center = { lat: parseFloat(lat), lng: parseFloat(lon) };

  let areaIdQuery = '';
  if (osm_type === 'relation') {
    const areaId = 3600000000 + parseInt(osm_id, 10);
    areaIdQuery = `area(${areaId})->.searchArea;`;
  } else if (osm_type === 'way') {
    const areaId = 2400000000 + parseInt(osm_id, 10);
    areaIdQuery = `area(${areaId})->.searchArea;`;
  } else {
    // Fallback to radius search if the location isn't an area (e.g., node)
    const facilities = await searchFacilitiesByCoord(center.lat, center.lng, 25000);
    return { center, facilities };
  }

  const query = `
    [out:json][timeout:25];
    ${areaIdQuery}
    (
      nwr["amenity"="clinic"](area.searchArea);
      nwr["amenity"="hospital"](area.searchArea);
      nwr["amenity"="doctors"](area.searchArea);
      nwr["healthcare"="psychotherapist"](area.searchArea);
      nwr["healthcare"="counselling"](area.searchArea);
      nwr["healthcare:speciality"="psychiatry"](area.searchArea);
      nwr["healthcare:speciality"="psychology"](area.searchArea);
    );
    out center;
  `;

  const data = await fetchFromOverpass(query);
  const facilities = parseElements(data.elements || []);
  return { center, facilities };
};

/**
 * Reverse geocode a coordinate to get Province and Regency names.
 * @param {number} lat 
 * @param {number} lng 
 * @returns {Promise<{ province: string, regency: string }>}
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(`${NOMINATIM_API}/reverse`, {
      params: { format: 'json', lat, lon: lng, zoom: 10, 'accept-language': 'id' },
      timeout: 10000,
    });

    if (response.data && response.data.address) {
      const address = response.data.address;
      const province = address.state || '';
      const regency = address.city || address.county || address.town || '';
      return { province, regency };
    }
    return { province: '', regency: '' };
  } catch (err) {
    console.error('Reverse geocoding failed:', err);
    return { province: '', regency: '' };
  }
};

export { FACILITY_TYPES };

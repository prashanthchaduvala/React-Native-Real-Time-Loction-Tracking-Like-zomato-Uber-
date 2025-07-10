const OPENCAGE_API_KEY = 'aaeca258c9f845c3a81355fad04d2ccb'; // Your OpenCage API key

// Forward geocoding: Place name → coordinates
export const forwardGeocode = async (query) => {
  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${OPENCAGE_API_KEY}&language=en&limit=5`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status.code !== 200 || !data.results.length) {
      console.warn('Forward geocode error:', data.status.message);
      return [];
    }

    return data.results.map(item => ({
      name: item.formatted,
      lat: item.geometry.lat,
      lng: item.geometry.lng
    }));
  } catch (error) {
    console.log('Forward geocoding error:', error.message);
    return [];
  }
};

// Reverse geocoding: Coordinates → place name
export const reverseGeocode = async (lat, lng) => {
  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}&language=en&pretty=1`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status.code !== 200 || !data.results.length) {
      console.warn('Reverse geocode error:', data.status.message);
      return 'Unknown location';
    }

    return data.results[0].formatted;
  } catch (error) {
    console.log('Reverse geocoding error:', error.message);
    return 'Unknown location';
  }
};

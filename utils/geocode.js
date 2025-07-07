// export const geocodePlaceName = async (place) => {
//   const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`);
//   const data = await res.json();
//   if (data && data.length > 0) {
//     return {
//       lat: parseFloat(data[0].lat),
//       lng: parseFloat(data[0].lon),
//     };
//   } else {
//     throw new Error("Place not found");
//   }
// };

// export const reverseGeocode = async (lat, lng) => {
//   const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
//   const data = await res.json();
//   return data.address?.city || data.address?.town || data.address?.village || 'Unknown';
// };


const API_KEY = 'aaeca258c9f845c3a81355fad04d2ccb';



// Convert coordinates to a place name (reverse geocoding)
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${API_KEY}&language=en&pretty=1`
    );
    const data = await response.json();
    if (data.results.length > 0) {
      return data.results[0].formatted;
    }
    return 'Unknown location';
  } catch (error) {
    console.log('Reverse geocoding error:', error.message);
    return 'Unknown location';
  }
};

// Convert place name to coordinates (forward geocoding)
export const forwardGeocode = async (query) => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${API_KEY}&language=en&limit=5`
    );
    const data = await response.json();
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




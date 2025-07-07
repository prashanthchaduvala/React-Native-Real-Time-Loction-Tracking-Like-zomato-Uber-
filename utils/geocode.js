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

export const reverseGeocode = async (lat, lng) => {
  const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${API_KEY}`);
  const data = await res.json();
  if (data.results.length > 0) {
    return data.results[0].formatted;
  } else {
    return 'Unknown location';
  }
};

export const forwardGeocode = async (query) => {
  const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${API_KEY}`);
  const data = await res.json();
  return data.results.map(item => ({
    name: item.formatted,
    lat: item.geometry.lat,
    lng: item.geometry.lng
  }));
};



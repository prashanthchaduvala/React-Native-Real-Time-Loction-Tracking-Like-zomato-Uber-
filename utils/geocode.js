export const geocodePlaceName = async (place) => {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`);
  const data = await res.json();
  if (data && data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } else {
    throw new Error("Place not found");
  }
};

export const reverseGeocode = async (lat, lng) => {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
  const data = await res.json();
  return data.address?.city || data.address?.town || data.address?.village || 'Unknown';
};

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



// // Convert coordinates to a place name (reverse geocoding)
// export const reverseGeocode = async (lat, lng) => {
//   try {
//     const response = await fetch(
//       `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${API_KEY}&language=en&pretty=1`
//     );
//     const data = await response.json();
//     if (data.results.length > 0) {
//       return data.results[0].formatted;
//     }
//     return 'Unknown location';
//   } catch (error) {
//     console.log('Reverse geocoding error:', error.message);
//     return 'Unknown location';
//   }
// };

// // Convert place name to coordinates (forward geocoding)
// export const forwardGeocode = async (query) => {
//   try {
//     const response = await fetch(
//       `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${API_KEY}&language=en&limit=5`
//     );
//     const data = await response.json();
//     return data.results.map(item => ({
//       name: item.formatted,
//       lat: item.geometry.lat,
//       lng: item.geometry.lng
//     }));
//   } catch (error) {
//     console.log('Forward geocoding error:', error.message);
//     return [];
//   }
// };


// const OPENCAGE_API_KEY = 'aaeca258c9f845c3a81355fad04d2ccb'; // Use a free or paid key

// export async function forwardGeocode(place) {
//   try {
//     const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&addressdetails=1&limit=5&countrycodes=in`;
//     const res = await fetch(url, {
//       headers: {
//         'User-Agent': 'YourAppName/1.0 (prashanthpatelc@email.com)' // Nominatim requires this
//       }
//     });

//     const data = await res.json();

//     return data.map(item => ({
//       name: item.display_name,
//       lat: parseFloat(item.lat),
//       lng: parseFloat(item.lon),
//     }));
//   } catch (error) {
//     console.error('Geocoding error:', error);
//     return [];
//   }
// }


// export async function reverseGeocode(lat, lng) {
//   try {
//     const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`;
//     const res = await fetch(url, {
//       headers: {
//         'User-Agent': 'YourAppName/1.0 (prashanthpatelc@email.com)'
//       }
//     });

//     const data = await res.json();
//     return data.display_name || 'Unknown';
//   } catch (error) {
//     console.error('Reverse geocoding error:', error);
//     return 'Unknown';
//   }
// }


const GOOGLE_API_KEY = 'AIzaSyBajb1RfU7eDL7W7yL7EdC_tTI-9g6mmPY'; // 🔒 Use safely

// Forward: Place name -> Coordinates
export const forwardGeocode = async (place) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(place)}&key=${GOOGLE_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'OK' || !data.results.length) {
      console.log('Forward geocode error:', data.status);
      return [{
        name: 'Unknown',
        lat: 0,
        lng: 0,
      }];
    }

    return data.results.map(item => ({
      name: item.formatted_address,
      lat: item.geometry.location.lat,
      lng: item.geometry.location.lng,
    }));
  } catch (error) {
    console.log('Forward geocoding error:', error.message);
    return [{
      name: 'Unknown',
      lat: 0,
      lng: 0,
    }];
  }
};

// Reverse: Coordinates -> Place name
export const reverseGeocode = async (lat, lng) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'OK' || !data.results.length) {
      console.warn('Reverse geocode failed');
      return 'Unknown location';
    }

    return data.results[0].formatted_address;
  } catch (error) {
    console.log('Reverse geocoding error:', error.message);
    return 'Unknown location';
  }
};

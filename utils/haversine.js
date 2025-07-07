// export const haversineDistance = (point1, point2) => {
//   const R = 6371; // km
//   const dLat = (point2.lat - point1.lat) * Math.PI / 180;
//   const dLon = (point2.lng - point1.lng) * Math.PI / 180;
//   const lat1 = point1.lat * Math.PI / 180;
//   const lat2 = point2.lat * Math.PI / 180;

//   const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//             Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

//   return R * c;
// };

export const haversineDistance = (coord1, coord2) => {
  const toRad = (x) => (x * Math.PI) / 180;

  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);

  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in kilometers
};

// calculateDistance.js
// This function calculates the distance between two geographical points
// using the Haversine formula and returns the distance in miles.


export function calculateDistanceMiles(lat1, lng1, lat2, lng2) {
    if (!lat1 || !lng1 || !lat2 || !lng2) return null;
  
    const R = 6371; // Radius of Earth in km
    const toRad = (val) => (val * Math.PI) / 180;
  
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
  
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLng / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;
  
    const distanceMiles = distanceKm * 0.621371;
    return parseFloat(distanceMiles.toFixed(1));
  }
  
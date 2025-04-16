import { useState } from 'react';
import axios from 'axios';

export const usePlaceSearch = ({ lat, lng, mode = "nearby", category = null }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaces = async () => {
    if (!lat || !lng) return;

    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/places/search", {
        params: {
          mode,
          lat,
          lng,
          ...(category && { category })
        }
      });
      setPlaces(response.data.places || []);
    } catch (error) {
      console.error("Error fetching places:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return { places, loading, fetchPlaces };
};

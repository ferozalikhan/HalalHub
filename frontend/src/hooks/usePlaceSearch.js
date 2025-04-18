import { useState, useEffect } from 'react';
import axios from 'axios';

export default function usePlacesSearch({ selectedPlace, searchMode, category }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);

  const fetchPlaces = async (isNextPage = false) => {
    if (!selectedPlace?.latitude || !selectedPlace?.longitude) return;

    try {
      if (isNextPage) setLoadingMore(true);
      else setLoading(true);

      const params = {
        mode: searchMode,
        lat: selectedPlace.latitude,
        lng: selectedPlace.longitude,
        category,
      };

      if (searchMode === 'text') {
        params.query = selectedPlace.name || selectedPlace.formattedAddress || '';
      }

      if (isNextPage && nextPageToken) {
        params.pageToken = nextPageToken;
      }

      const response = await axios.get('http://localhost:3000/api/places/search', { params });

      const newPlaces = response.data.places || [];
      setPlaces(prev => isNextPage ? [...prev, ...newPlaces] : newPlaces);
      setNextPageToken(response.data.nextPageToken || null);

    } catch (err) {
      console.error("❌ Error fetching places:", err.response?.data || err.message);
    } finally {
      if (isNextPage) setLoadingMore(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [selectedPlace, searchMode, category]);

  return {
    places,
    loading,
    loadingMore,
    fetchNextPage: () => fetchPlaces(true),
    hasMore: !!nextPageToken,
  };
}

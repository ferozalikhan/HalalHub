import { useState, useEffect } from 'react';
import axios from 'axios';
import categoryMap from '../../constants/categoryMap'; // Adjust import as needed

// Helper: Check if place matches selected categories
function isLikelyFoodTruck(place) {
  const name = place.displayName?.text?.toLowerCase() || '';
  const summary = place.generativeSummary?.overview?.text.toLowerCase() || '';
  const combinedText = `${name} ${summary}`;

  return combinedText.includes('truck') && combinedText.includes('halal');
}


function filterPlacesByCategories(places, selectedCategories) {
  console.log("🚩 Selected Categories:", selectedCategories);

  if (!selectedCategories.length || selectedCategories.includes('all')) return places;

  const selectedTypes = selectedCategories
    .map(cat => categoryMap[cat]?.type?.toLowerCase())
    .filter(Boolean);

  const filteredPlaces = places.filter(place => {
    const types = (place.types || []).map(t => t.toLowerCase());

    // Special case: food truck
    if (selectedCategories.includes('street_food')) {
      if (isLikelyFoodTruck(place)) return true;
    }

    // Fallback to type-based filtering for all other categories
    return selectedTypes.some(selectedType => types.includes(selectedType));
  });

  console.log("✅ Filtered Places:", filteredPlaces.length);
  return filteredPlaces;
}


export default function usePlacesSearch({ selectedPlace, searchMode, category = [] }) {
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
        category: category.length ? category : ["all"],
      };

      if (searchMode === 'text') {
        params.query = selectedPlace.name || selectedPlace.formattedAddress || '';
      }

      if (isNextPage && nextPageToken) {
        params.pageToken = nextPageToken;
      }

      const response = await axios.get('http://localhost:3000/api/places/search', { params });

      let fetchedPlaces = response.data.places || [];

      // Always filter unless "all" is selected
      if (!category.includes("all")) {
        fetchedPlaces = filterPlacesByCategories(fetchedPlaces, category);
      }

      setPlaces(prev => isNextPage ? [...prev, ...fetchedPlaces] : fetchedPlaces);
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

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import categoryMap from '../../constants/categoryMap'; // Adjust import as needed
import { calculateDistanceMiles } from '../utils/distance';
import { map } from 'lodash';


// Helper: Check if place matches selected categories
function isLikelyFoodTruck(place) {
  const name = place.displayName?.text?.toLowerCase() || '';
  const summary = place.generativeSummary?.overview?.text.toLowerCase() || '';
  const combinedText = `${name} ${summary}`;

  return combinedText.includes('truck') && combinedText.includes('halal');
}

function mapPriceLevel(apiValue) {
  switch (apiValue) {
    case 'PRICE_LEVEL_INEXPENSIVE':
      return '$';
    case 'PRICE_LEVEL_MODERATE':
      return '$$';
    case 'PRICE_LEVEL_EXPENSIVE':
      return '$$$';
    case 'PRICE_LEVEL_VERY_EXPENSIVE':
      return '$$$$';
    default:
      return null;
  }
}

function applyFrontendFilters(places, filters, searchMode, userLocation) {
  // return places.filter(place => {
  //   const placePrice = mapPriceLevel(place.priceLevel);
  //   const placeRating = place.rating || 0;
  //   const openNow = place.currentOpeningHours?.openNow;
  //   const delivery = place.delivery;
  //   const dineIn = place.dineIn;

  //   const matchesPrice = !filters.price.length || filters.price.includes(placePrice);
  //   const matchesRating = !filters.rating || placeRating >= filters.rating;
  //   const matchesOpenNow = !filters.features.includes("open-now") || openNow;
  //   const matchesDelivery = !filters.features.includes("delivery") || delivery;
  //   const matchesDineIn = !filters.features.includes("dine-in") || dineIn;

  //   return (
  //     matchesPrice &&
  //     matchesRating &&
  //     matchesOpenNow &&
  //     matchesDelivery &&
  //     matchesDineIn
  //   );
  // });

  // !! Debugging: Log the filters being applied
  console.log("📌------------ inside applyFrontendFilters ---------📌");
  
  return places.filter(place => {
    const placePrice = mapPriceLevel(place.priceLevel);
    const placeRating = place.rating || 0;
    const openNow = place.currentOpeningHours?.openNow;
    const delivery = place.delivery;
    const dineIn = place.dineIn;
  
    // // !! Debugging: Log the place being filtered
    console.log("🚩 Filtering Place:", place.displayName.text);
    console.log("🚩 Place Primary Type:", place.primaryType);
    console.log("🚩 Place opening Hours:", place.currentOpeningHours);
    console.log("🚩 Place regular Hours:", place.regularOpeningHours);
    // console.log("🚩 Place Price:", placePrice);
    // console.log("🚩 Place Rating:", placeRating);
    // console.log("🚩 Open Now:", openNow);
    // console.log("🚩 Delivery:", delivery);
    // console.log("🚩 Dine In:", dineIn);


    const matchesPrice = !filters.price.length || filters.price.includes(placePrice);
    const matchesRating = !filters.rating || placeRating >= filters.rating;
    const matchesOpenNow = !filters.features.includes("open-now") || openNow;
    const matchesDelivery = !filters.features.includes("delivery") || delivery;
    const matchesDineIn = !filters.features.includes("dine-in") || dineIn;

    let isWithinDistance = true;

    if ((searchMode === 'nearby') && filters.distance && userLocation) {
      const placeLat = place.location?.latitude;
      const placeLng = place.location?.longitude;
      const userLat = userLocation.lat;
      const userLng = userLocation.lng;

      const distance = calculateDistanceMiles(userLat, userLng, placeLat, placeLng);
      // console.log("🚩 User Location:", userLocation);
      // console.log("🚩 Place Location:", place.location);
      // console.log("🚩 Distance:", distance);
      isWithinDistance = distance !== null && distance <= filters.distance;
    }

    return (
      matchesPrice &&
      matchesRating &&
      matchesOpenNow &&
      matchesDelivery &&
      matchesDineIn &&
      isWithinDistance
    );

  });
  
}



function filterPlacesByCategories(places, selectedCategories) {
  console.log("🚩------------ inside filterPlacesByCategories ---------🚩"  );
  // console.log("🚩 Selected Categories:", selectedCategories);

  if (!selectedCategories.length || selectedCategories.includes('all')) 
    {
      console.log("🚩 No categories selected or 'all' selected, returning all places.");
      console.log("🚩------------------ 🚩 -----------------🚩");
      console.log("");
      return places;
    }

  const selectedTypes = selectedCategories
    .map(cat => categoryMap[cat]?.type?.toLowerCase())
    .filter(Boolean);

  const filteredPlaces = places.filter(place => {
    // !! Debugging: Log the place being filtered
    console.log("🚩 Filtering Place:", place);
    const types = (place.types || []).map(t => t.toLowerCase());

    // Special case: food truck
    if (selectedCategories.includes('street_food')) {
      if (isLikelyFoodTruck(place)) return true;
    }

    // Fallback to type-based filtering for all other categories
    return selectedTypes.some(selectedType => types.includes(selectedType));
  });

  console.log("✅ Filtered Places:", filteredPlaces.length);
  console.log("🚩------------------ 🚩 -----------------🚩");
  console.log("");
  return filteredPlaces;
}


export default function usePlacesSearch({ selectedPlace, userLocation, searchMode, category = [] , selectedFilters, mapState, distanceFilter }) {
  const [rawPlaces, setRawPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);

  const prevDistanceRef = useRef(distanceFilter);


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
        bounds: mapState.lastSearchBounds,
      };

      if (searchMode === 'text') {
        params.query = selectedPlace.name || selectedPlace.formattedAddress || '';
      }

      if (isNextPage && nextPageToken) {
        params.pageToken = nextPageToken;
      }

      const response = await axios.get('http://localhost:3000/api/places/search', { params });

      let fetchedPlaces = response.data.places || [];

      setRawPlaces(prev => isNextPage ? [...prev, ...fetchedPlaces] : fetchedPlaces);

      setFilteredPlaces(prev => isNextPage ? [...prev, ...fetchedPlaces] : fetchedPlaces);
      setNextPageToken(response.data.nextPageToken || null);

    } catch (err) {
      console.error("❌ Error fetching places:", err.response?.data || err.message);
    } finally {
      if (isNextPage) setLoadingMore(false);
      else setLoading(false);
    }
  };
  // ** Note: only fetch places when selectedPlace, searchMode, or category changes.
  // ** This is to avoid refetching on slectedFilters change.
useEffect(() => {
  fetchPlaces(); // backend call
}, [selectedPlace, searchMode, category]);

useEffect(() => {
  if (!rawPlaces.length || !selectedFilters) return;

  const placesAfterCategory = filterPlacesByCategories(rawPlaces, category);
  const finalFiltered = applyFrontendFilters(
    placesAfterCategory,
    selectedFilters,
    searchMode,
    userLocation
  );
  setFilteredPlaces(finalFiltered);

}, [rawPlaces, category, selectedFilters, searchMode, userLocation]);

useEffect(() => {
  const prevDistance = prevDistanceRef.current;

  const distanceChanged = distanceFilter !== prevDistance;

  if (distanceChanged && searchMode === "nearby") {
    // Only refetch from backend if distance got smaller or user zoomed in
    console.log("📡 Refetching due to distance change:", distanceFilter);
    fetchPlaces();
  }

  prevDistanceRef.current = distanceFilter;
}, [distanceFilter, searchMode]);


  

  // // useEffect for selected Filters
  // useEffect(() => {
  

  //   console.log("📌------------ selectedFilters ---------📌");
  //   console.log("🚩 Selected Filters:", selectedFilters);
  //   // print the length of all fetched places
  //   console.log("🚩 All Fetched Places:", rawPlaces.length);
  //   if(!selectedFilters) return;

  //   const filtered = applyFrontendFilters(rawPlaces, selectedFilters, searchMode, userLocation);
  //   filteredPlaces(filtered);
    
  //   console.log("📌------------------ 📌 -----------------📌");
    
  // }, [selectedFilters, rawPlaces]);

  return {
    places: filteredPlaces,
    loading,
    loadingMore,
    fetchNextPage: () => fetchPlaces(true),
    hasMore: !!nextPageToken,
  };
}

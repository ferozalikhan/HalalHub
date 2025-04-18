import { useState } from 'react'
import Home from './pages/Home'
import { APIProvider } from '@vis.gl/react-google-maps'
import './App.css'
// routes
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import PlaceDetail from './pages/PlaceDetail'
import usePlacesSearch from './hooks/usePlaceSearch'


function App() {
  
  const [selectedPlace, setSelectedPlace] = useState({
    name: "", // e.g., "Live Oak"
    formattedAddress: "", // e.g., "Live Oak, CA 95953, USA"
    latitude: null, // e.g., 39.334
    longitude: null, // e.g., -121.735
  });
  const [userLocation, setUserLocation] = useState(null);
  // mode can be "nearby" or "text" or "drag"
  const [searchMode, SetSearchMode] = useState("default");
  // const [places, setPlaces] = useState([]);
  const [category, setCategory] = useState("all"); // e.g., "restaurants"

  const {
    places,
    loading,
    loadingMore,
    fetchNextPage,
    hasMore
  } = usePlacesSearch({ selectedPlace, searchMode, category });

  // !! Debugging: Log the places
   console.log ("inside App");
  console.log("hasMore:", hasMore);

  // load more results 
  // const [nextPageToken, setNextPageToken] = useState(null);
  // const [loading, setLoading] = useState(true);

  // 🔁 Fetch places when selectedPlace or mode changes
  // useEffect(() => {
  //   const fetchPlaces = async () => {
  //     if (!selectedPlace?.latitude || !selectedPlace?.longitude) return;

  //     try {
  //       setLoading(true);

  //       const params = {
  //         mode: searchMode,
  //         lat: selectedPlace.latitude,
  //         lng: selectedPlace.longitude,
  //         category,
  //         ...(nextPageToken && { pageToken: nextPageToken })
  //       };

  //       // Add query if searchMode is text (e.g. city search)
  //       if (searchMode === "text") {
  //         params.query = selectedPlace.name || selectedPlace.formattedAddress || "";
  //       }

  //       const response = await axios.get("http://localhost:3000/api/places/search", {
  //         params,
  //       });

  //       console.log("✅ Places fetched:", response.data);
  //       const fetchedPlaces = response.data.places || [];
  //       // Update places state with new data
  //       setPlaces((prev) => nextPageToken ? [...prev, ...fetchedPlaces] : fetchedPlaces);
  //       setNextPageToken(response.data.nextPageToken || null);

  //     } catch (err) {
  //       console.error("❌ Error fetching places:", err.response?.data || err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPlaces();
  // }, [selectedPlace, searchMode, category]);

  return (
  
      // <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      //   <Home />
      // </APIProvider>

      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Routes>
          <Route path="/" element={
            <Home userLocation = {userLocation} setUserLocation = {setUserLocation} selectedPlace = {selectedPlace} setSelectedPlace={setSelectedPlace} places={places} setSearchMode = {SetSearchMode} 
            searchMode = {searchMode}
            fetchNextPage = {fetchNextPage}
            hasMore = {hasMore}
            loading={loading} 
            loadingMore={loadingMore}
          />
          } />
          {/* only make thise route available when the place is selected */}
          {selectedPlace?.latitude && selectedPlace?.longitude && (
            <Route path="/place/:id" element={<PlaceDetail places={places} userLocation={userLocation}/>} />
          )}
          
          {/* Add more routes here */}
        </Routes>
      </APIProvider>


  )
}

export default App

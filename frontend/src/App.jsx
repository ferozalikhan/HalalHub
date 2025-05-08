import { useState } from 'react'
import Home from './pages/Home'
import { APIProvider } from '@vis.gl/react-google-maps'
import './App.css'
// routes
import { Routes, Route } from 'react-router-dom'
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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
        price: [],
        features: [],
        certification: [],
        rating: null,
        distance: 5,
      });
  const [mapState, setMapState] = useState({
        zoom: 14,
        center: null,
        lastSearchBounds: null
        });
  const {
    places,
    loading,
    loadingMore,
    fetchNextPage,
    hasMore
  } = usePlacesSearch({ selectedPlace, userLocation, searchMode, category: selectedCategories, selectedFilters, mapState, distanceFilter: selectedFilters.distance });  

  // !! Debugging: Log the places
  useEffect(() => {
    console.log("📍------------- inside App ----------📍");
    console.log("hasMore:", hasMore);
    console.log("-📍----------------------------------📍-");
    // log blank line so readability
    console.log("");
  }, [hasMore]);
  

  return (
  

      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Routes>
          <Route path="/" element={
            <Home 
              userLocation = {userLocation} 
              setUserLocation = {setUserLocation} 
              selectedPlace = {selectedPlace}
              setSelectedPlace={setSelectedPlace}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              places={places} 
              setSearchMode = {SetSearchMode} 
              searchMode = {searchMode}
              fetchNextPage = {fetchNextPage}
              hasMore = {hasMore}
              loading={loading} 
              loadingMore={loadingMore}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              mapState={mapState}
              setMapState={setMapState}
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

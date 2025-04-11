import { useState } from 'react'
import Home from './pages/Home'
import { APIProvider } from '@vis.gl/react-google-maps'
import './App.css'
// routes
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import PlaceDetail from './pages/PlaceDetail'
function App() {
  
  const [selectedPlace, setSelectedPlace] = useState({
    name: "", // e.g., "Live Oak"
    formattedAddress: "", // e.g., "Live Oak, CA 95953, USA"
    latitude: null, // e.g., 39.334
    longitude: null, // e.g., -121.735
  });
  const [userLocation, setUserLocation] = useState(null);

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchPlaces = async () => {
        if (!selectedPlace?.latitude || !selectedPlace?.longitude) return;

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:3000/api/places/restaurants/nearby", {
                lat: selectedPlace.latitude,
                lng: selectedPlace.longitude
            });

            console.log("Fetched places:", response.data.places);
            setPlaces(response.data.places);  
        } catch (error) {
            console.error("Error fetching places:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    fetchPlaces();
}, [selectedPlace]);

  return (
  
      // <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      //   <Home />
      // </APIProvider>

      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Routes>
          <Route path="/" element={<Home userLocation = {userLocation} setUserLocation = {setUserLocation} selectedPlace = {selectedPlace} setSelectedPlace={setSelectedPlace} places={places} setPlaces={setPlaces} loading={loading} />} />
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

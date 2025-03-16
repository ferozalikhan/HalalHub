import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, useAdvancedMarkerRef, useMap } from "@vis.gl/react-google-maps";




export default  function MapComponent ({selectedPlace, setSelectedPlace}) {

  const [markerRef, marker] = useAdvancedMarkerRef();

  const defaultLocation = {
    name: "New York City",
    formattedAddress: "New York City, NY, USA",
    latitude: 40.712776,
    longitude: -74.005974,
  };

  const MapHandler = ({ place, marker }) => {
    const map = useMap();
  
    useEffect(() => {
      if (!map || !place || !marker) return;
      // test 
      console.log("MapHandler: place", place);
      console.log("MapHandler: marker", marker);
      map.setCenter({ lat: place.latitude, lng: place.longitude });
      marker.position = { lat: place.latitude, lng: place.longitude };
      
    }, [map, place, marker]);
    return null;
  };


  // Function to reverse geocode coordinates to city
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === "OK") {
        let city = "";
        let state = "";
        let country = "";
        // More reliable way to extract address components
        const addressComponents = data.results[0].address_components;
        
        for (const component of addressComponents) {
          if (component.types.includes("locality")) {
            city = component.long_name;
          } else if (component.types.includes("administrative_area_level_1")) {
            state = component.short_name;
          } else if (component.types.includes("country")) {
            country = component.short_name;
          }
        }

        const formattedAddress = `${city}, ${state}, ${country}`;
        // Update state with the selected place
        setSelectedPlace({
          name: city,
          formattedAddress,
          latitude,
          longitude,
        });

        // Log the values
        console.log("City: ", city);
        console.log("State: ", state);
        console.log("Country: ", country);
        console.log("Formatted Address: ", formattedAddress);

      } else {
        console.error("Geocoding failed:", data.status);
        setSelectedPlace(defaultLocation);
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      setSelectedPlace(defaultLocation);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Reverse geocode the coordinates
        reverseGeocode(latitude, longitude);
        
      },
      (error) => {
        console.error("Error Code = " + error.code + " - " + error.message);
        
      }
    );
  }, []);

  return (
    <div className="map-container">


      <div className="map">
        {/* <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}> */}
          {selectedPlace.latitude ? ( // Render the map only after getting location
            <Map
              style={{ width: "100%", height: "50vh" }}
              defaultCenter= {selectedPlace.latitude ? { lat: selectedPlace.latitude, lng: selectedPlace.longitude } : { lat: 40.712776, lng: -74.005974 }}
              defaultZoom={13}    
              mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
            >
                <AdvancedMarker
                    ref={markerRef}
                    position={{ lat: selectedPlace.latitude, lng: selectedPlace.longitude }}
                    
                    >
                      <Pin background={'#4285F4'} glyphColor={'#FFFFFF'} borderColor={'#1A73E8'} />
                    </AdvancedMarker>
                    
            </Map>
            
          ) : (
            <p>Loading map...</p>
          )}
        {/* </APIProvider> */}
      </div>

      <MapHandler place={selectedPlace} marker={marker} />
    </div>
  );
};



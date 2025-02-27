import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

export default  function MapComponent () {
  const [userLocation, setUserLocation] = useState(null); // Set initial state to null

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Log the values
        console.log("Latitude: ", latitude);
        console.log("Longitude: ", longitude);

        // Update state with user location
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error Code = " + error.code + " - " + error.message);
      }
    );
  }, []);

  return (
    <div className="map-container">
      <h1>Map Component</h1>

      <div className="map">
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          {userLocation ? ( // Render the map only after getting location
            <Map
              style={{ width: "1300px", height: "50vh" }}
              defaultCenter={userLocation}
              defaultZoom={13}
              mapId='ed2f974b7313b429'
            >
                <AdvancedMarker
                    position={userLocation}
                    icon="https://img.icons8.com/ios/452/marker.png"
                    label="You are here"
                    >
                      <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                    </AdvancedMarker>
            </Map>
            
          ) : (
            <p>Loading map...</p>
          )}
        </APIProvider>
      </div>
    </div>
  );
};



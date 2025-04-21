import React, { useState, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useAdvancedMarkerRef,
  useMap
} from "@vis.gl/react-google-maps";
import { debounce } from "lodash";
import { CodeSquare } from "lucide-react";



export default function MapComponent({
  userLocation,
  setUserLocation,
  selectedPlace,
  setSelectedPlace,
  searchMode,
  setSearchMode,
  places = [] // <-- Accept array of places
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const hasDraggedRef = useRef(false);
  const defaultLocation = {
    name: "New York City",
    formattedAddress: "New York City, NY, USA",
    latitude: 40.712776,
    longitude: -74.005974,
  };

  // * gives us the map instance with the useMap hook
  const map = useMap();


  useEffect(() => {
    if (!map) return;
  
    // Mark that user dragged
    const handleDragEnd = () => {
      hasDraggedRef.current = true;
    };
  
    // Trigger reverse geocode only if dragged
    const handleIdle = debounce(() => {
      if (hasDraggedRef.current) {
        const center = map.getCenter();
        const lat = center.lat();
        const lng = center.lng();
  
        console.log("---> Map Dragged <---");
        reverseGeocode(lat, lng, "drag");
        hasDraggedRef.current = false; // Reset after fetch
      }
    }, 600);
  
    const dragEndListener = map.addListener("dragend", handleDragEnd);
    const idleListener = map.addListener("idle", handleIdle);
  
    return () => {
      dragEndListener.remove();
      idleListener.remove();
    };
  }, [map]);
  
  


  const MapHandler = ({ place, marker }) => {
  

    useEffect(() => {
      if (!map || !place || !marker) return;

      map.setCenter({ lat: place.latitude, lng: place.longitude });
      marker.position = { lat: place.latitude, lng: place.longitude };
    }, [map, place, marker]);

    return null;
  };

  const isSamePlace = (a, b) =>
    a.name === b.name &&
    a.formattedAddress === b.formattedAddress &&
    a.latitude === b.latitude &&
    a.longitude === b.longitude;


  
  

  const reverseGeocode = async (latitude, longitude, mode = "nearby") => {
    console.log("Reverse geocode triggered with mode:", mode);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      console.log("Reverse geocode data:", data);

      if (data.status !== "OK" || !data.results.length) {
        console.warn("Reverse geocoding failed or returned no results.");
        return;
      }

      console.log("--->    <---");
    
      if (data.status === "OK") {
        const place = data.results[0];
        let city = "";
        let state = "";
        let country = ""; 

        const addressComponents = place?.address_components || [];
        for (const component of addressComponents) {
          if (component.types.includes("locality")) {
            city = component.long_name;
          } else if (component.types.includes("administrative_area_level_1")) {
            state = component.short_name;
          } else if (component.types.includes("country")) {
            country = component.short_name;
          }
        }

        const formattedAddress = [city, state, country].filter(Boolean).join(", ");
        // only update if it differs from the current selected place
        setSelectedPlace(prev => {
          const newPlace = {
            name: city,
            formattedAddress,
            latitude,
            longitude
          };
          if (isSamePlace(prev, newPlace)) {
            console.log("No change in selectedPlace, skipping update");
            return prev;
          }
          console.log("Updating selectedPlace:", newPlace);
          return newPlace;
        });
        
        
        
        // only update the user location if the mode is "nearby"
        if (mode === "nearby") {
        setUserLocation({ lat: latitude, lng: longitude });
        setSearchMode("nearby");
        }
        else if (mode === "drag")
        {
          setSearchMode("drag");
        }
      } else {
        setSelectedPlace(defaultLocation);
      }
      
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      setSelectedPlace(defaultLocation);
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        navigator.geolocation.getCurrentPosition(
          async ({ coords }) => {
            await reverseGeocode(coords.latitude, coords.longitude);
          },
          (err) => {
            console.error("Geolocation error:", err);
            alert("Could not get your location. Please search manually.");
          }
        );
      } catch (err) {
        console.error("Unexpected geolocation error:", err);
      }
    };
  
    fetchLocation();
  }, []);
  

  return (
    <div className="map-container">
      <div className="map">
        {selectedPlace.latitude ? (
          <Map
            style={{ width: "100%", height: "50vh" }}
            defaultCenter={{
              lat: selectedPlace.latitude,
              lng: selectedPlace.longitude,
            }}
            defaultZoom={14}
            mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}            
          >
            {/* 🔵 User’s Marker */}
            <AdvancedMarker
              ref={markerRef}
              position={{
                lat: selectedPlace.latitude,
                lng: selectedPlace.longitude,
              }}
            >
              <Pin background="#4285F4" glyphColor="#FFFFFF" borderColor="#1A73E8" />
            </AdvancedMarker>

            {/* 🍽️ All Fetched Halal Places */}
            {places.map((place, idx) => {
              const lat = place.location?.latitude;
              const lng = place.location?.longitude;
              const name = place.displayName?.text || "Unnamed";

              if (!lat || !lng) return null;

              return (
                <AdvancedMarker
                  key={idx}
                  position={{ lat, lng }}
                  title={name}
                  onClick={() => setSelectedPlace({
                    name,
                    formattedAddress: place.formattedAddress,
                    latitude: lat,
                    longitude: lng
                  })}
                >
                  <Pin background="#34a853" glyphColor="#ffffff" borderColor="#0c8040" />
                </AdvancedMarker>
              );
            })}
          </Map>
        ) : (
          <p>Loading map...</p>
        )}
      </div>

      <MapHandler place={selectedPlace} marker={marker} />
    </div>
  );
}

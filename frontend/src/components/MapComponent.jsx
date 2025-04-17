import React, { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useAdvancedMarkerRef,
  useMap
} from "@vis.gl/react-google-maps";

export default function MapComponent({
  userLocation,
  setUserLocation,
  selectedPlace,
  setSelectedPlace,
  SetSearchMode,
  places = [] // <-- Accept array of places
}) {
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

      map.setCenter({ lat: place.latitude, lng: place.longitude });
      marker.position = { lat: place.latitude, lng: place.longitude };
    }, [map, place, marker]);

    return null;
  };

  const reverseGeocode = async (latitude, longitude) => {
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
        setUserLocation({ lat: latitude, lng: longitude });
        setSelectedPlace({
          name: city,
          formattedAddress,
          latitude,
          longitude,
        });
        SetSearchMode("nearby");
      } else {
        setSelectedPlace(defaultLocation);
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      setSelectedPlace(defaultLocation);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => reverseGeocode(coords.latitude, coords.longitude),
      (err) => {
        console.error("Geolocation error:", err);
        alert("Could not get your location. Please search manually.");
      }
    );
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
            defaultZoom={13}
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

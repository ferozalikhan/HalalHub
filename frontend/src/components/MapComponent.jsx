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
import { getZoomForModeOrDistance } from "../utils/modeZoomMap";



export default function MapComponent({
  userLocation,
  setUserLocation,
  selectedPlace,
  setSelectedPlace,
  searchMode,
  setSearchMode,
  hasDraggedRef,
  hasInteractedRef,
  isDraggingAllowedRef,
  places = [] ,// <-- Accept array of places
  distanceFilter
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const defaultLocation = {
    name: "New York City",
    formattedAddress: "New York City, NY, USA",
    latitude: 40.712776,
    longitude: -74.005974,
  };
  const [mapState, setMapState] = useState({
  zoom: 14,
  center: null,
  lastSearchCircle: null
  });
  const userDidManualDragRef = useRef(false);


   // only true after nearby/text 
  // * gives us the map instance with the useMap hook
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
  
    const dragStartListener = map.addListener('dragstart', () => {
      userDidManualDragRef.current = true;
    });
  
    return () => dragStartListener.remove();
  }, [map]);
  



  useEffect(() => {
    
    console.log("🚩------------------ HandleIdle UseEffect -----------------🚩");
    if (!map) return;  
    const handleIdle = debounce(() => {
      const center = map.getCenter();
      const zoom = map.getZoom();
  
      if (zoom < 12) {
        // pop up a message to the user
        // TODO: use a modal or toast
        console.log("🔍 Zoom in to see more details.");
        return;
      }

      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true; // First interaction after mode change
        return;
      }
      
      if (!isDraggingAllowedRef.current) {
        console.log("🚫 Drag ignored — user interaction not allowed (e.g., after text search)");
        return;
      }
      
      const centerLatLng = {
        lat: center.lat(),
        lng: center.lng()
      };
      // TODO: Polish up the isInsidePreviouslyFetchedArea function to better handle the case
      if (!isInsidePreviouslyFetchedArea(centerLatLng, mapState.lastSearchCircle)) {
        if (userDidManualDragRef.current) {
          reverseGeocode(centerLatLng.lat, centerLatLng.lng, "drag");
          userDidManualDragRef.current = false; // reset
        } else {
          console.log("👋 Idle but not a manual drag — skipping reverseGeocode");
        }

        // get the bounds of the map
        const bounds = map.getBounds();
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const radius = Math.max(
          calculateDistance(centerLatLng.lat, centerLatLng.lng, ne.lat(), ne.lng()),
          calculateDistance(centerLatLng.lat, centerLatLng.lng, sw.lat(), sw.lng())
        );
        console.log("Map bounds radius:", radius);
        // log
        console.log("Map is updated to center:", centerLatLng, "with zoom:", zoom);
        setMapState(prev => ({
          ...prev,
          center: centerLatLng,
          zoom,
          lastSearchCircle: {
            center: centerLatLng,
            radius: radius,
          },
        }));
        console.log("🚩------------------ ........... -----------------🚩");
        console.log("");
      }
      else {
        console.log("Already searched this area — skipping fetch.");
        console.log("🚩------------------ ........... -----------------🚩");
        console.log("");
      }
    }, 600);
  
    const listener = map.addListener("idle", handleIdle);
    return () => listener.remove();
  }, [map, mapState.lastSearchCircle]);
  
  
  const MapHandler = ({ place, marker }) => {

    useEffect(() => {
      if (!map || !place || !marker) return;

      // map.setCenter({ lat: place.latitude, lng: place.longitude });
      // // TODO: set zoom level based on place type
      // marker.position = { lat: place.latitude, lng: place.longitude };
      const zoomLevel = getZoomForModeOrDistance(searchMode, distanceFilter);
      if (zoomLevel) {
        map.setZoom(zoomLevel);
      }
      map.setCenter({ lat: place.latitude, lng: place.longitude });

    }, [map, place, marker]);

    return null;
  };

  const isSamePlace = (a, b) =>
    a.name === b.name &&
    a.formattedAddress === b.formattedAddress &&
    a.latitude === b.latitude &&
    a.longitude === b.longitude;


    function calculateDistance(lat1, lng1, lat2, lng2) {
      const toRad = (val) => (val * Math.PI) / 180;
      const R = 6371e3;
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    
    function isInsidePreviouslyFetchedArea(center, circle) {
      if (!circle) return false;
      const distance = calculateDistance(
        center.lat,
        center.lng,
        circle.center.lat,
        circle.center.lng
      );
      return distance <= circle.radius;
    }
    

  const reverseGeocode = async (latitude, longitude, mode = "nearby") => {
    console.log("🚩------------------ Reverse Geocode -----------------🚩");
    // add icon to console log
    console.log("🔄 Reverse geocode triggered with mode:", mode);
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
        // add icon to console log in print 
        console.log("📍 Reverse geocode result:", formattedAddress);
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

        if (mode === "text") {
          setSearchMode("text");
          isDraggingAllowedRef.current = true;
          hasInteractedRef.current = false;
        } else if (mode === "drag") {
          setSearchMode("drag");
        } else {
          setSearchMode("nearby");
          isDraggingAllowedRef.current = true;
          hasInteractedRef.current = false;
          setUserLocation({ lat: latitude, lng: longitude });
        }
        
      } else {
        setSelectedPlace(defaultLocation);
      }
      // !! Debugging: Logs
      console.log("🚩------------------ ........... -----------------🚩");
      console.log("");
      // !! Debugging: Logs
      
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      setSelectedPlace(defaultLocation);
    }
  };

  // Get user's location on component mount
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        navigator.geolocation.getCurrentPosition(
          async ({ coords }) => {
            await reverseGeocode(coords.latitude, coords.longitude, "nearby");
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
            defaultZoom={mapState.zoom}
            mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}    
            options={{ gestureHandling: "greedy" }} // to allow dragging     
          >
            {/* User’s Marker */}
            <AdvancedMarker
              ref={markerRef}
              position={{
                lat: selectedPlace.latitude,
                lng: selectedPlace.longitude,
              }}
            >
              <Pin background="#4285F4" glyphColor="#FFFFFF" borderColor="#1A73E8" />
            </AdvancedMarker>

            {/* All Fetched Halal Places */}
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

      <MapHandler 
        place={selectedPlace}
        marker={marker}
        searchMode={searchMode}
        distanceFilter={distanceFilter}
        />
    </div>
  );
}

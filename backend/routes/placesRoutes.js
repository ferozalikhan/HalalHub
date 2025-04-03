const express = require("express");
const axios = require("axios");
const router = express.Router();

// Helper function to fetch nearby restaurants from Google Places API
router.post("/restaurants/nearby", async (req, res) => {
  const lat = parseFloat(req.body.lat);
  const lng = parseFloat(req.body.lng);
  const radius = 5000.0; // Ensure it's a float

  // Validate input
  if (!lat || !lng) {
    return res.status(400).json({ message: "Latitude and longitude are required" });
  }

  const GOOGLE_PLACES_URL = "https://places.googleapis.com/v1/places:searchNearby";
  const API_KEY = process.env.GOOGLE_API_KEY;

  const requestBody = {
    includedTypes: ["restaurant"],
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: radius, // 5000m (5km)
      },
    },
  };

  // const headers = {
  //   "Content-Type": "application/json",
  //   "X-Goog-Api-Key": API_KEY,
  //   "X-Goog-FieldMask": "*",
  // };

  const headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    // "X-Goog-FieldMask": "*",
     "X-Goog-FieldMask": "places.paymentOptions,places.servesBeer,places.displayName,places.formattedAddress,places.types,places.websiteUri,places.googleMapsUri,places.editorialSummary,places.location.latitude,places.priceLevel,places.priceRange,places.primaryType,places.restroom,places.servesWine,places.location.longitude,places.nationalPhoneNumber,places.rating,places.userRatingCount,places.photos,places.regularOpeningHours,places.currentOpeningHours.openNow"
};


  try {
    const response = await axios.post(GOOGLE_PLACES_URL, requestBody, { headers });
    console.log("Google Places API response:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from Google API:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching data from Google Places API", error: error.response?.data || error.message });
  }
});

module.exports = router;

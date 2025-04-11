const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/restaurants/nearby", async (req, res) => {
  const  {lat, lng, pageToken} = req.body;
  const textQuery =  "halal restaurants";
  const radius = 5000;

  const API_KEY = process.env.GOOGLE_API_KEY;
  const GOOGLE_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";

  const requestBody = {
    textQuery,
    pageSize: 10,
    languageCode: "en",
    ...(pageToken && { pageToken }),
    ...(lat && lng && {
      locationBias: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius,
        },
      },
    }),
  };

  const headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": [
      "places.displayName",
      "places.formattedAddress",
      "places.types",
      "places.primaryType",
      "places.location.latitude",
      "places.location.longitude",
      "places.rating",
      "places.userRatingCount",
      "places.priceLevel",
      "places.photos",
      "places.currentOpeningHours.openNow",
      "places.regularOpeningHours",
      "places.websiteUri",
      "places.nationalPhoneNumber",
      "places.googleMapsUri",
      "places.editorialSummary",
      "places.restroom",
      "places.paymentOptions",
      "places.servesBeer",
      "places.servesWine",
      "places.dineIn",
      "places.delivery",
      "places.takeout",
      "places.servesVegetarianFood"
    ].join(","),
  };

  try {
    const response = await axios.post(GOOGLE_TEXT_SEARCH_URL, requestBody, { headers });
    res.status(200).json({
      places: response.data.places || [],
      nextPageToken: response.data.nextPageToken || null
    });
  } catch (error) {
    console.error("❌ Text Search API error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Error fetching results from Google Text Search API",
      error: error.response?.data || error.message
    });
  }
});

module.exports = router;

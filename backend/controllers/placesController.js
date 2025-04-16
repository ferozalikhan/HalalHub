const axios = require("axios");
const { fieldMask,categoryMap} = require("../constants/googleFieldMask");

exports.searchPlacesController = async (req, res) => {
  //! Debug logs
  console.log("🚀 Places API request received");
  console.log("Request query:", req.query);

  const { mode = "text", query, lat, lng, category, pageToken } = req.query;
  const radius = 5000; // 5km
  const rangeSize = 20;
  const fallbackCity = "New York"; // or pass from frontend
  const cat = categoryMap[category] || categoryMap.all;
  let requestBody = {};
  let apiUrl = "";

  // ! Debug logs
  console.log("Resolved category:", cat);


  // API key from environment variables
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
  //const NEARBY_SEARCH_URL = "https://places.googleapis.com/v1/places:searchNearby";


  // Validate lat and lng
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  
  
  if (mode === "text") {
    apiUrl = TEXT_SEARCH_URL;
    requestBody = {
        textQuery: query || cat.keyword,
        ...(cat.type && { includedType: cat.type }),
      pageSize: rangeSize,
      languageCode: "en",
      ...(pageToken && { pageToken }),
      ...(lat && lng && {
        locationBias: {
          circle: {
            center: { latitude, longitude },
            radius,
          },
        },
      }),
    };

  } else if (mode === "nearby" || mode === "drag") {

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: "Invalid lat/lng values" });
    }
    
    
    apiUrl = TEXT_SEARCH_URL;
    requestBody = {
      textQuery: cat.keyword,
      ...(cat.type && { includedType: cat.type }), // This is optional, but boosts specificity!
      pageSize: rangeSize,
      languageCode: "en",
      ...(pageToken && { pageToken }),
      locationRestriction: {
        // 0.03 offset ≈ 3km box (not actual radius)
        rectangle: {
          low: {
            latitude: latitude - 0.03,
            longitude: longitude - 0.03
          },
          high: {
            latitude: latitude + 0.03,
            longitude: longitude + 0.03
          }
        }
      },

    };
  } else if (mode === "default") {
    apiUrl = TEXT_SEARCH_URL;
    requestBody = {
    textQuery: `${cat.keyword} in ${fallbackCity}`,
      pageSize: rangeSize,
      languageCode: "en"
    };
  } else {
    return res.status(400).json({ error: "Invalid mode" });
  }

const headers = {
  "Content-Type": "application/json",
  "X-Goog-Api-Key": GOOGLE_API_KEY,
  "X-Goog-FieldMask": fieldMask,
};

  try {
    const response = await axios.post(apiUrl, requestBody, { headers });
    res.status(200).json({
      places: response.data.places || [],
      nextPageToken: response.data.nextPageToken || null,
    });
  } catch (error) {
    console.error("❌ Places API error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Error fetching results from Google Places API",
      error: error.response?.data || error.message,
    });
  }
};

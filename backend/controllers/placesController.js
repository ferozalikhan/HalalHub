const axios = require("axios");
const { fieldMask,categoryMap} = require("../constants/googleFieldMask");

exports.searchPlacesController = async (req, res) => {
  // Extract query parameters
  const { mode = "text", query, lat, lng, category, pageToken } = req.query;
    //! Debug logs
    console.group("📦 Original Request Params");
    console.log("Mode:", mode);
    console.log("Query:", query);
    console.log("Lat/Lng:", lat, lng);
    console.log("Category:", category);
    console.log("Page Token:", pageToken);
    console.groupEnd();
  // default values 
  const radius = 5000; // 5km
  const rangeSize = 20;
  const fallbackCity = "New York"; // or pass from frontend
  const cat = categoryMap[category] || categoryMap.all;
  const finalQuery =
  query && query.trim()
    ? `${cat.keyword} in ${query.trim()}`
    : cat.keyword;

  let requestBody = {};
  let apiUrl = "";

  // ! Debug logs
  console.group("📦 Google Places Request");
  console.log("category:", cat);
  console.log("finalQuery:", finalQuery);


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
        textQuery: finalQuery,
        ...(cat.type && { includedType: cat.type }),
      pageSize: rangeSize,
      ...(pageToken && { pageToken }),
      languageCode: "en",
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
    // ! Debug logs
    // use a differnt group for better readability
    console.group("✅  Google Places Response");
    console.log("Status:", response.status);
    // log the length of the data array
    console.log("Data:", response.data.places.length || 0);
    console.log("Next Page Token:", response.data.nextPageToken);
    console.groupEnd();
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

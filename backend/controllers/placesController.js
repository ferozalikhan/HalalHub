const axios = require("axios");
const { fieldMask, categoryMap } = require("../constants/googleFieldMask");

exports.searchPlacesController = async (req, res) => {
  const { mode = "text", query, lat, lng, category = [], pageToken, bounds  } = req.query;
  console.log("📦-------------------📦--------------------📦");
  console.group("📦 Original Request Params");
  console.log("Mode:", mode);
  console.log("Query:", query);
  console.log("Lat/Lng:", lat, lng);
  console.log("Category:", category);
  console.log("Page Token:", pageToken);
  console.log("Bounds:", bounds);
  console.groupEnd();
  console.log("📦-------------------📦--------------------📦");

  // a well suited radius for a city
  const radius = 10000; // 10 km
  const rangeSize = 20;
  const fallbackCity = "New York";

  // const categories = Array.isArray(category) ? category : [category];

  // // Pick first category OR fallback to 'all'
  // const pickedCategory = categoryMap[categories[0]] || categoryMap.all;
  // ** NOTE: This is a fallback to 'all' if no category is provided
  const pickedCategory = categoryMap.all;
  const searchQuery = query?.trim()
    ? `${pickedCategory.keyword} in ${query.trim()}`
    : pickedCategory.keyword;

  let requestBody = {};
  let apiUrl = "";
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";

  console.group("📦 Google Places Request Setup");
  console.log("Picked category:", pickedCategory);
  console.log("Search Query:", searchQuery);
  console.groupEnd();

  if (mode === "text") {
    apiUrl = TEXT_SEARCH_URL;
    requestBody = {
      textQuery: searchQuery,
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
      textQuery: pickedCategory.keyword,
      pageSize: rangeSize,
      languageCode: "en",
      ...(pageToken && { pageToken }),
      // if bonds is provided, use it to restrict the search area
      ...(bounds && {
      locationRestriction: {
        rectangle: {
          low: {
            latitude: parseFloat(bounds.south),
            longitude: parseFloat(bounds.west),
          },
          high: {
            latitude: parseFloat(bounds.north),
            longitude: parseFloat(bounds.east),
          },
        },
      },
    }),
    // if no bounds, use lat/lng to restrict the search area
      ...(lat && lng && {
       locationRestriction: {
        rectangle: {
          low: { latitude: latitude - 0.03, longitude: longitude - 0.03 },
          high: { latitude: latitude + 0.03, longitude: longitude + 0.03 },
        },
      },
      }),
    };
  } else if (mode === "default") {
    apiUrl = TEXT_SEARCH_URL;
    requestBody = {
      textQuery: `halal food in ${fallbackCity}`,
      pageSize: rangeSize,
      languageCode: "en",
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
    console.log("✅-------------------✅--------------------✅");

    console.group("✅ Google Places API Response");
    console.log("Status:", response.status);
    console.log("Places found:", response.data.places?.length || 0);
    console.log("Next Page Token:", response.data.nextPageToken);
    console.groupEnd();
    console.log("✅-------------------✅--------------------✅");

    res.status(200).json({
      places: Array.isArray(response.data.places) ? response.data.places : [],
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

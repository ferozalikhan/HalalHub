

// constants/categoryMap.js

const categoryMap = {
  restaurants: { label: "Restaurants", keyword: "halal restaurant", type: "restaurant" },
  grocery_store: { label: "Grocery Stores", keyword: "halal grocery", type: "grocery_store" },
  street_food: { label: "Street Food", keyword: "halal food truck", type: "meal_takeaway" },
  cafe: { label: "Cafes & Desserts", keyword: "halal cafe", type: "cafe" },
  all: { label: "All", keyword: "halal food", type: null }
};

  

  

const basicFields = [
    "places.displayName",
    "places.formattedAddress",
    "places.location.latitude",
    "places.location.longitude",
    "places.primaryType",
    "places.types"
  ];
  
  const uiFields = [
    "places.rating",
    "places.userRatingCount",
    "places.priceLevel",
    "places.photos",
    "places.websiteUri",
    "places.nationalPhoneNumber",
    "places.currentOpeningHours.openNow",
    "places.regularOpeningHours",
  ];
  
  const extraFields = [
    "places.editorialSummary",
    "places.googleMapsUri",
    "places.paymentOptions",
    "places.dineIn",
    "places.takeout",
    "places.delivery",
    "places.servesVegetarianFood",
    "nextPageToken",
    "places.generativeSummary"
  ];
  
  // Final combined field mask string
  const fieldMask = [...basicFields, ...uiFields, ...extraFields].join(",");
  
  module.exports = {
    fieldMask,
    categoryMap,
  };
  
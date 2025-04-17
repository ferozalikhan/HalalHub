

// constants/categoryMap.js

const categoryMap = {
    restaurant: {
      label: "Restaurants",
      keyword: "halal restaurant",
      type: "restaurant",
      icon: "FaUtensils"
    },
    grocery: {
      label: "Grocery Stores",
      keyword: "halal grocery",
      type: "grocery_or_supermarket",
      icon: "FaStore"
    },
    street_food: {
      label: "Street Food",
      keyword: "halal street food",
      type: "meal_takeaway",
      icon: "FaTruck"
    },
    cafe: {
      label: "Cafes & Desserts",
      keyword: "halal cafe",
      type: "cafe",
      icon: "FaCoffee"
    },
    all: {
        label: "All Categories",
        keyword: "halal food",
        type: null,
        icon: "FaGlobe"
      },
  };
  

  

const basicFields = [
    "places.displayName",
    "places.formattedAddress",
    "places.location.latitude",
    "places.location.longitude",
    "places.types"
  ];
  
  const uiFields = [
    "places.rating",
    "places.userRatingCount",
    "places.priceLevel",
    "places.photos",
    "places.websiteUri",
    "places.currentOpeningHours.openNow"
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
  ];
  
  // Final combined field mask string
  const fieldMask = [...basicFields, ...uiFields, ...extraFields].join(",");
  
  module.exports = {
    fieldMask,
    categoryMap,
  };
  
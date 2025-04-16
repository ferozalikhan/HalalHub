const express = require("express");
const { searchPlacesController } = require("../controllers/placesController");
const router = express.Router();

// New flexible endpoint
router.get("/search", searchPlacesController);

module.exports = router;




// const headers = {
//   "Content-Type": "application/json",
//   "X-Goog-Api-Key": API_KEY,
//   "X-Goog-FieldMask": [
//     "places.displayName",
//     "places.formattedAddress",
//     "places.types",
//     "places.primaryType",
//     "places.location.latitude",
//     "places.location.longitude",
//     "places.rating",
//     "places.userRatingCount",
//     "places.priceLevel",
//     "places.photos",
//     "places.currentOpeningHours.openNow",
//     "places.regularOpeningHours",
//     "places.websiteUri",
//     "places.nationalPhoneNumber",
//     "places.googleMapsUri",
//     "places.editorialSummary",
//     "places.restroom",
//     "places.paymentOptions",
//     "places.servesBeer",
//     "places.servesWine",
//     "places.dineIn",
//     "places.delivery",
//     "places.takeout",
//     "places.servesVegetarianFood"
//   ].join(","),
// };
// const express = require("express");
import express from "express"; // Import express
//const { searchPlacesController } = require("../controllers/placesController");
import { searchPlacesController } from "../controllers/placesController.js"; // Import the controller
const router = express.Router();

// New flexible endpoint
router.get("/search", searchPlacesController);

// module.exports = router;
export default router;


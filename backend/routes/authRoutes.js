import express from "express";
import { verifyFirebaseToken } from "../middleware/verifyToken.js"; // Import the middleware
import {
  createOrUpdateUser,
  getCurrentUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/", verifyFirebaseToken, createOrUpdateUser); // /api/auth
router.get("/me", verifyFirebaseToken, getCurrentUser);    // /api/auth/me

export default router;

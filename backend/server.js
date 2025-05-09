// server.js
// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
import express from 'express'; // Import express
import dotenv from 'dotenv'; // Import dotenv for environment variables
import cors from 'cors'; // Import cors for Cross-Origin Resource Sharing
import placesRoutes from "./routes/PlacesRoutes.js"; // Import the routes
import authRoutes from "./routes/authRoutes.js"; // Import the auth routes
import { admin } from "./config/firebaseAdmin.js"; // Import Firebase admin SDK

// Load environment variables from .env file
dotenv.config();
const app = express();

// Middleware to enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allow only frontend's domain
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

// Middleware to parse JSON bodies
app.use(express.json());

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//       !! Testing only !!
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Debugging firebase admin initialization
app.get("/admin-check", async (req, res) => {
  const users = await admin.auth().listUsers(1); // just fetch 1 user
  res.json(users);
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// ** places routes **
app.use('/api/places', placesRoutes); // Mount the places routes


// ** Auth to  create or update the user profile in your database **
app.use('/api/auth', authRoutes); // Mount the auth routes)


// ** listen to the server **
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

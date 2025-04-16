// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const placesRoutes = require('./routes/PlacesRoutes'); // Import the routes


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

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Define the routes
app.use('/api/places', placesRoutes); // Mount the places routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

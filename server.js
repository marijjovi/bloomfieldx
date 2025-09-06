// 1. IMPORT LIBRARIES
const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config(); // Loads variables from .env

// 2. CREATE EXPRESS APP
const app = express();
const PORT = process.env.PORT || 3000; // Use environment port or 3000

// 3. SERVE STATIC FILES from the 'public' folder
app.use(express.static('public'));

// 4. DEFINE THE SECURE PROXY API ENDPOINT
app.get('/api/static-map', async (req, res) => {
  console.log('Received request for map:', req.query); // Helpful for debugging

  try {
    // Get parameters from the frontend request
    const { lat, lng, zoom = 8, size = '600x400' } = req.query;

    // Construct the REAL Google URL using the secret key from .env
    const googleUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&key=${process.env.GOOGLE_STATIC_MAPS_KEY}`;

    // Fetch the image from Google
    const response = await axios.get(googleUrl, { responseType: 'stream' });

    // Forward headers (like content-type) from Google to the client
    res.set(response.headers);
    
    // Pipe the image data directly from Google to the client
    response.data.pipe(res);

  } catch (error) {
    console.error('Error proxying map:', error.message);
    res.status(500).send('Could not generate map image.');
  }
});

// 5. START THE SERVER
app.listen(PORT, () => {
  console.log(`✅ Server running! Open http://localhost:${PORT} to view your site.`);
});

module.exports = app;
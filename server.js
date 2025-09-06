// 1. IMPORT LIBRARIES
const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config(); // Loads variables from .env
const http = require('http');
const https = require('https');

// 2. CREATE EXPRESS APP
const app = express();
const PORT = process.env.PORT || 3000; // Use environment port or 3000

// 3. SERVE STATIC FILES from the 'public' folder
app.use(express.static('public'));

// 4. DEFINE THE SECURE PROXY API ENDPOINT
// In your root server.js file - REPLACE the /api/static-map route with this:
// Add this at the top of your server.js file with other requires


app.get('/api/static-map', async (req, res) => {
  console.log('🟢 Request received at /api/static-map');
  
  const { lat, lng, zoom = 10, size = '600x400' } = req.query;
  const googleUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&key=${process.env.GOOGLE_STATIC_MAPS_KEY}`;
  
  console.log('🔗 Calling Google URL');
  
  // Use the native https module to stream the response
  https.get(googleUrl, (googleResponse) => {
    // Check if Google returned an error
    if (googleResponse.statusCode !== 200) {
      console.error('❌ Google API error:', googleResponse.statusCode);
      return res.status(googleResponse.statusCode).send('Google API error');
    }
    
    // Set the same content-type that Google returns
    res.setHeader('Content-Type', googleResponse.headers['content-type']);
    
    // Pipe the image data directly from Google to the client
    googleResponse.pipe(res);
    
  }).on('error', (err) => {
    console.error('❌ HTTPS request error:', err.message);
    res.status(500).send('Error fetching map');
  });
});

// 5. START THE SERVER
app.listen(PORT, () => {
  console.log(`✅ Server running! Open http://localhost:${PORT} to view your site.`);
});

module.exports = app;
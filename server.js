// 1. IMPORT LIBRARIES
const express = require('express');
const axios = require('axios');
const path = require('path');

const http = require('http');
const https = require('https');

require('dotenv').config(); // Loads variables from .env
// 2. CREATE EXPRESS APP
const app = express();
const PORT = process.env.PORT || 3000; // Use environment port or 3000

// 3. SERVE STATIC FILES from the 'public' folder
app.use(express.static('public'));

// 4. DEFINE THE SECURE PROXY API ENDPOINT
// In your root server.js file - REPLACE the /api/static-map route with this:
// Add this at the top of your server.js file with other requires


app.get('/api/static-map', async (req, res) => {
  try {
      const { lat, lng, zoom = 10, size = '600x400' } = req.query;
      
      const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&key=${process.env.GOOGLE_STATIC_MAPS_KEY}`;

      const response = await axios.get(url, { responseType: 'arraybuffer' });
     
      res.set('Content-Type', 'image/png');
      res.send(response.data);
  } catch (error) {
      console.error('Error fetching static map:', error);
      res.status(500).json({ error: 'Failed to fetch map' });
  }
});

// 5. START THE SERVER
app.listen(PORT, () => {
  console.log(`✅ Server running! Open http://localhost:${PORT} to view your site.`);
});

module.exports = app;
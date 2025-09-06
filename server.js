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
// In your root server.js file - REPLACE the /api/static-map route with this:
app.get('/api/static-map', async (req, res) => {
  console.log('Request received at /api/static-map');
  try {
    const { lat, lng, zoom = 10, size = '600x400' } = req.query;
    const googleUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&key=${process.env.GOOGLE_STATIC_MAPS_KEY}`;
    
    const response = await axios.get(googleUrl, { 
      responseType: 'arraybuffer'
    });

    // Convert the image buffer to a base64 string
    const imageBuffer = Buffer.from(response.data);
    const base64Image = imageBuffer.toString('base64');
    
    // Create a data URL
    const dataUrl = `data:${response.headers['content-type']};base64,${base64Image}`;
    
    // Send the data URL as JSON (very reliable for serverless)
    res.json({ imageUrl: dataUrl });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 5. START THE SERVER
app.listen(PORT, () => {
  console.log(`✅ Server running! Open http://localhost:${PORT} to view your site.`);
});

module.exports = app;
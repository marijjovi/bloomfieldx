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
    
    console.log('Calling Google URL:', googleUrl); // Log the URL

    const response = await axios.get(googleUrl, { 
      responseType: 'arraybuffer'
    });

    // DEBUGGING: Check what Google actually returned
    const responseData = Buffer.from(response.data);
    const firstFewChars = responseData.toString('utf8', 0, 100); // Get first 100 chars as text
    console.log('Google response starts with:', firstFewChars);
    console.log('Content-Type from Google:', response.headers['content-type']);

    // Check if Google returned an error (often starts with <!DOCTYPE>)
    if (firstFewChars.startsWith('<!DOCTYPE') || firstFewChars.startsWith('<html')) {
        console.error('Google returned an HTML error page instead of an image.');
        // Let's see the full error
        const fullResponse = responseData.toString('utf8');
        console.error('Full Google response:', fullResponse);
        return res.status(500).send('Google API returned an error: ' + fullResponse);
    }

    // If it looks like binary image data, send it
    res.set('Content-Type', response.headers['content-type']);
    res.send(responseData);

  } catch (error) {
    console.error('Error:', error.message);
    // If axios fails, let's see the full error response
    if (error.response) {
        console.error('Google API error status:', error.response.status);
        console.error('Google API error data:', error.response.data);
    }
    res.status(500).send('Server Error: ' + error.message);
  }
});

// 5. START THE SERVER
app.listen(PORT, () => {
  console.log(`✅ Server running! Open http://localhost:${PORT} to view your site.`);
});

module.exports = app;
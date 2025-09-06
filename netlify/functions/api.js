const axios = require('axios');

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get query parameters
    const { lat, lng, zoom = 10, size = '600x400' } = event.queryStringParameters;
    
    // Validate required parameters
    if (!lat || !lng) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters: lat and lng' })
      };
    }

    // Get API key from environment variable
    const apiKey = process.env.GOOGLE_STATIC_MAPS_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    // Build the Google Maps URL
    const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&key=${apiKey}`;

    // Fetch the image from Google
    const response = await axios.get(url, { 
      responseType: 'arraybuffer',
      timeout: 10000
    });

    // Return the image with proper headers
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      },
      body: response.data.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('Error fetching static map:', error.message);
    
    // Return error response
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch map',
        message: error.message 
      })
    };
  }
};
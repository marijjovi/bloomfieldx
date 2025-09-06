// netlify/functions/api.js
const serverless = require('serverless-http');
const app = require('../../server.js'); // main Express app

// Create the handler with explicit path rewriting
const handler = serverless(app, {
  request: function(request, event, context) {
    // Log the incoming path for debugging
    console.log('Incoming path:', event.path);
    
    
    // Remove the Netlify function prefix
    if (event.path.startsWith('/.netlify/functions/api')) {
      request.url = event.path.replace('/.netlify/functions/api', '');
    }
    
    console.log('Rewritten path for Express:', request.url);
    return request;
  }
});

module.exports.handler = handler;
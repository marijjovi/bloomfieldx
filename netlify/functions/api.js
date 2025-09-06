// Netlify Adapter File
const serverless = require('serverless-http');

// Import the Express app from our main application file
// The '..' moves up one level out of the 'functions' folder to the project root
const app = require('../../server.js');

// Create the serverless handler with explicit configuration
const handler = serverless(app, {
    // This ensures the '/.netlify/functions/api' prefix is removed before passing to Express
    request: function(request, event, context) {
      // This is the magic line that fixes the path
      request.path = event.path.replace('/.netlify/functions/api', '');
      return request;
    }
  });

  module.exports.handler = handler;
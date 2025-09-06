// netlify/functions/api.js
const serverless = require('serverless-http');
const app = require('../../server.js');

// Create the middleware for explicit path rewriting
const proxyPath = '/.netlify/functions';

const handler = serverless(app, {
  request: (request, event, context) => {
    // Log the original path for debugging
    console.log('📩 Original path received:', event.path);
    
    // Check if the request is for this function
    if (event.path.startsWith(proxyPath)) {
      // Rewrite the path by removing the proxy prefix
      request.url = event.path.replace(proxyPath, '');
      console.log('🔄 Rewritten path for Express:', request.url);
    } else {
      // For any other path, use it as-is (shouldn't happen)
      request.url = event.path;
    }
    
    return request;
  }
});

module.exports.handler = handler;
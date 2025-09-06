// Netlify Adapter File
const serverless = require('serverless-http');

// Import the Express app from our main application file
// The '..' moves up one level out of the 'functions' folder to the project root
const app = require('../../server.js');

// Export the app wrapped for Netlify Functions
module.exports.handler = serverless(app);
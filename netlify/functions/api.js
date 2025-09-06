// netlify/functions/api.js
const serverless = require('serverless-http');
const app = require('../../server.js'); // main Express app



module.exports.handler = serverless(app);
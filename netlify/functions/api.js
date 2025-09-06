exports.handler = async (event, context) => {
    console.log('🔶 Function called! Path:', event.path);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Hello from Netlify Function!',
        receivedPath: event.path,
        receivedQuery: event.queryStringParameters
      }, null, 2)
    };
  };
// Netlify serverless function for X API calls
// This solves the CORS issue by making API calls server-side

exports.handler = async (event, context) => {
  // Enable CORS for the function
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { endpoint, params } = JSON.parse(event.body || '{}');
    
    if (!endpoint) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Endpoint is required' })
      };
    }

    // Your X API Bearer Token
    const bearerToken = 'AAAAAAAAAAAAAAAAAAAAANcU3QEAAAAAQwzSx90Nua3cp1X5yK4OChkx%2FS0%3DGD9cO2ufOBy6bF2eTjwdrdPOz0LsVyXKpb8cG9hu2CA6FkuOML';
    
    // Build the URL with parameters
    const baseURL = 'https://api.twitter.com/2';
    const url = new URL(`${baseURL}${endpoint}`);
    
    if (params) {
      Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
      });
    }

    // Make the API call
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`X API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Twitter API function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch data from X API',
        details: error.message 
      })
    };
  }
}; 
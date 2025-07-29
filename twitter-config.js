// Twitter/X API Configuration
// Replace these values with your actual API credentials from the X Developer Portal

const TWITTER_CONFIG = {
  // Your Bearer Token from X Developer Portal
  // Get this from: https://developer.twitter.com/en/portal/dashboard
  BEARER_TOKEN: 'AAAAAAAAAAAAAAAAAAAAANcU3QEAAAAAQwzSx90Nua3cp1X5yK4OChkx%2FS0%3DGD9cO2ufOBy6bF2eTjwdrdPOz0LsVyXKpb8cG9hu2CA6FkuOML',
  
  // Your X username (without @)
  USERNAME: 'BrettOnBonk',
  
  // Search queries for tweets
  SEARCH_QUERIES: [
    'BRETT OR #Brett OR #Bonk',
    '@BrettOnBonk',
    '#BrettonBonk',
    '#BrettMeme',
    '#BrettGames'
  ],
  
  // Number of tweets to display
  MAX_TWEETS: 10,
  
  // Auto-refresh interval (in minutes)
  REFRESH_INTERVAL: 5,
  
  // API endpoints
  ENDPOINTS: {
    BASE_URL: 'https://api.twitter.com/2',
    USER_INFO: '/users/by/username/',
    USER_TWEETS: '/users/{id}/tweets',
    SEARCH_TWEETS: '/tweets/search/recent'
  }
};

// Instructions for setting up your X API:
/*
1. Go to https://developer.twitter.com/en/portal/dashboard
2. Create a new app or use an existing one
3. Go to "Keys and Tokens" tab
4. Generate a "Bearer Token" (this is what you need for read-only access)
5. Copy the Bearer Token and replace 'YOUR_BEARER_TOKEN_HERE' above
6. Save this file and the social feed will start working with real data!

Note: The free tier allows 300 requests per 15 minutes, which is perfect for:
- Loading tweets every 5 minutes
- Getting user info
- Basic search functionality

For production use, you might want to:
- Store the Bearer Token in environment variables
- Add error handling for rate limits
- Implement caching to reduce API calls
*/

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TWITTER_CONFIG;
} 
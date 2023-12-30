import React, { useState } from 'react';
import axios from 'axios';

const FacebookAuth = () => {
  const [userAccessToken, setUserAccessToken] = useState('');

  const handleLogin = async () => {
    // Perform Facebook authentication and get the user access token
    // ...

    // Use the obtained user access token to call your Express routes
    try {
      const response = await axios.get('/api/fb/getUserPages', {
        params: {
          userAccessToken: userAccessToken,
        },
      });

      const pageId = response.data.pageId;

      // Now you can use pageId to post to the user's page if needed
      await axios.post('/api/fb/postToPage', {
        userAccessToken: userAccessToken,
        pageId: pageId,
        message: 'Hello, this is a test post!',
      });
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Facebook</button>
    </div>
  );
};

export default FacebookAuth;

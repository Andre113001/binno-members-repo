const axios = require('axios');

const getUserPages = async (userAccessToken) => {
  try {
    const response = await axios.get(`https://graph.facebook.com/v13.0/me/accounts`, {
      params: {
        access_token: userAccessToken,
      },
    });

    const page = response.data.data[0];
    return page.id;
  } catch (error) {
    console.error('Error getting user pages:', error.response.data);
    throw error;
  }
};

const postToPage = async (userAccessToken, pageId, message) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v13.0/${pageId}/feed`,
      {
        message: message,
      },
      {
        params: {
          access_token: userAccessToken,
        },
      }
    );

    console.log('Post successful:', response.data);
  } catch (error) {
    console.error('Error posting to page:', error.response.data);
    throw error;
  }
};

module.exports = {
  getUserPages,
  postToPage,
};

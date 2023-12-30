const express = require('express');
const router = express.Router();
const { getUserPages, postToPage } = require('../controllers/facebookController');

router.get('/getUserPages', async (req, res) => {
  const userAccessToken = req.query.userAccessToken; // You can pass the access token as a query parameter
  try {
    const pageId = await getUserPages(userAccessToken);
    res.json({ pageId });
  } catch (error) {
    res.status(500).json({ error: 'Error getting user pages' });
  }
});

router.post('/postToPage', async (req, res) => {
  const { userAccessToken, pageId, message } = req.body;
  try {
    await postToPage(userAccessToken, pageId, message);
    res.json({ message: 'Post successful' });
  } catch (error) {
    res.status(500).json({ error: 'Error posting to page' });
  }
});


module.exports = router;
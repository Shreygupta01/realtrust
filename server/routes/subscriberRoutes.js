const express = require('express');
const {
  subscribeNewsletter,
  getSubscribers,
} = require('../controllers/subscriberController');

const router = express.Router();

// Public: subscribe to newsletter
router.post('/', subscribeNewsletter);

// Admin: view all subscribers
router.get('/', getSubscribers);

module.exports = router;



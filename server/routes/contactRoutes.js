const express = require('express');
const {
  submitContactForm,
  getContactSubmissions,
} = require('../controllers/contactController');

const router = express.Router();

// Public: submit contact form
router.post('/', submitContactForm);

// Admin: view all contact submissions
router.get('/', getContactSubmissions);

module.exports = router;



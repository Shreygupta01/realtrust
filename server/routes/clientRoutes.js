const express = require('express');
const { getClients, createClient } = require('../controllers/clientController');
const upload = require('../middleware/upload');

const router = express.Router();

// Public: fetch all clients
router.get('/', getClients);

// Admin: add a client (multipart/form-data with optional image upload)
router.post('/', upload.single('image'), createClient);

module.exports = router;



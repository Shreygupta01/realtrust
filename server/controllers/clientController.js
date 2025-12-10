const Client = require('../models/Client');

// GET /api/clients - Public: fetch all clients
const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.status(200).json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
};

// POST /api/clients - Admin: add a new client
const createClient = async (req, res) => {
  try {
    const { imageUrl, name, description, designation } = req.body;

    let finalImageUrl = imageUrl;

    // If an image file is uploaded via multipart/form-data, build the URL from it
    if (req.file) {
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
      finalImageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    if (!finalImageUrl || !name || !description || !designation) {
      return res
        .status(400)
        .json({ error: 'image (or imageUrl), name, description and designation are required' });
    }

    const client = await Client.create({ imageUrl: finalImageUrl, name, description, designation });
    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
};

module.exports = {
  getClients,
  createClient,
};



const ContactSubmission = require('../models/ContactSubmission');

// POST /api/contact - Public: submit contact form
const submitContactForm = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, city } = req.body;

    if (!fullName || !email || !mobileNumber || !city) {
      return res
        .status(400)
        .json({ error: 'fullName, email, mobileNumber and city are required' });
    }

    const submission = await ContactSubmission.create({
      fullName,
      email,
      mobileNumber,
      city,
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
};

// GET /api/contact - Admin: view all contact submissions
const getContactSubmissions = async (req, res) => {
  try {
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ error: 'Failed to fetch contact submissions' });
  }
};

module.exports = {
  submitContactForm,
  getContactSubmissions,
};



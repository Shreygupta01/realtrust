const express = require('express');
const { getProjects, createProject, deleteProject } = require('../controllers/projectController');
const upload = require('../middleware/upload');

const router = express.Router();

// Public: fetch all projects
router.get('/', getProjects);

// Admin: add a project (supports multipart/form-data with image upload)
router.post('/', upload.single('image'), createProject);

// Admin: delete a project
router.delete('/:id', deleteProject);

module.exports = router;



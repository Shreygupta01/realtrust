const Project = require('../models/Project');

// GET /api/projects - Public: fetch all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// POST /api/projects - Admin: add a new project
const createProject = async (req, res) => {
  try {
    const { imageUrl, name, description } = req.body;

    let finalImageUrl = imageUrl;

    // If an image file is uploaded via multipart/form-data, build the URL from it
    if (req.file) {
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
      finalImageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    if (!finalImageUrl || !name || !description) {
      return res
        .status(400)
        .json({ error: 'image (or imageUrl), name and description are required' });
    }

    const project = await Project.create({ imageUrl: finalImageUrl, name, description });
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

// DELETE /api/projects/:id - Admin: delete a project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

module.exports = {
  getProjects,
  createProject,
  deleteProject,
};



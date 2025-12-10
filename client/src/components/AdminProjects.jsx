import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/projects';

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formState, setFormState] = useState({
    name: '',
    description: '',
    imageFile: null,
  });
  const [submitStatus, setSubmitStatus] = useState({
    submitting: false,
    success: '',
    error: '',
  });

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      setFormState((prev) => ({ ...prev, imageFile: files?.[0] || null }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ submitting: true, success: '', error: '' });

    try {
      if (!formState.imageFile) {
        throw new Error('Please select a project image');
      }

      const formData = new FormData();
      formData.append('name', formState.name);
      formData.append('description', formState.description);
      formData.append('image', formState.imageFile);

      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create project');
      }

      setSubmitStatus({
        submitting: false,
        success: 'Project added successfully.',
        error: '',
      });
      setFormState({
        name: '',
        description: '',
        imageFile: null,
      });

      // Refresh list
      fetchProjects();
    } catch (err) {
      setSubmitStatus({
        submitting: false,
        success: '',
        error: err.message || 'Something went wrong',
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete project');
      }
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete project');
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">Add New Project</h2>
        <p className="mt-1 text-sm text-gray-600">
          Upload a new project with an image, name, and description.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-700">
              Project Image
            </label>
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={handleChange}
              className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-gray-800 hover:file:bg-gray-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formState.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              required
              value={formState.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="Brief description of the project"
            />
          </div>

          <button
            type="submit"
            disabled={submitStatus.submitting}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-300 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-800"
          >
            {submitStatus.submitting ? 'Saving...' : 'Save Project'}
          </button>
          {submitStatus.success && (
            <p className="text-sm text-emerald-600">{submitStatus.success}</p>
          )}
          {submitStatus.error && <p className="text-sm text-red-600">{submitStatus.error}</p>}
        </form>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-gray-900">
            Existing Projects
          </h2>
          <button
            type="button"
            onClick={fetchProjects}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {loading && <p className="text-sm text-gray-500">Loading projects...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && projects.length === 0 && (
          <p className="text-sm text-gray-500">No projects added yet.</p>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id} className="border-t border-gray-200 bg-white">
                    <td className="px-4 py-2">
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={project.name || 'Project'}
                          className="h-10 w-16 rounded-md object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-900">{project.name}</td>
                    <td className="px-4 py-2 text-gray-600">
                      <span className="line-clamp-2">{project.description}</span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(project._id)}
                        className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminProjects;



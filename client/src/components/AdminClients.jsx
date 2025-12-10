import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/clients';

function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formState, setFormState] = useState({
    name: '',
    designation: '',
    description: '',
    imageFile: null,
  });
  const [submitStatus, setSubmitStatus] = useState({
    submitting: false,
    success: '',
    error: '',
  });

  const fetchClients = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
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
        throw new Error("Please select the client's image");
      }

      const formData = new FormData();
      formData.append('name', formState.name);
      formData.append('designation', formState.designation);
      formData.append('description', formState.description);
      formData.append('image', formState.imageFile);

      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create client');
      }

      setSubmitStatus({
        submitting: false,
        success: 'Client added successfully.',
        error: '',
      });
      setFormState({
        name: '',
        designation: '',
        description: '',
        imageFile: null,
      });

      fetchClients();
    } catch (err) {
      setSubmitStatus({
        submitting: false,
        success: '',
        error: err.message || 'Something went wrong',
      });
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">Add New Client</h2>
        <p className="mt-1 text-sm text-gray-600">
          Add a client with their designation, testimonial, and image.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-700">
              Client Image
            </label>
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={handleChange}
              className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-gray-800 hover:file:bg-gray-200"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-700">
                Client Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formState.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Enter client name"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-700">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                required
                value={formState.designation}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. CEO, Marketing Head"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-700">
              Testimonial / Description
            </label>
            <textarea
              name="description"
              required
              value={formState.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="Short testimonial or description from the client"
            />
          </div>

          <button
            type="submit"
            disabled={submitStatus.submitting}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-300 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-800"
          >
            {submitStatus.submitting ? 'Saving...' : 'Save Client'}
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
            Existing Clients
          </h2>
          <button
            type="button"
            onClick={fetchClients}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {loading && <p className="text-sm text-gray-500">Loading clients...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && clients.length === 0 && (
          <p className="text-sm text-gray-500">No clients added yet.</p>
        )}

        {!loading && !error && clients.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
              <article
                key={client._id}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {client.imageUrl ? (
                    <img
                      src={client.imageUrl}
                      alt={client.name || 'Client'}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                      {client.name?.[0] || '?'}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{client.name}</p>
                    <p className="text-xs text-gray-500">{client.designation}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-700 line-clamp-3">{client.description}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminClients;



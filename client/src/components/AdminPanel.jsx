import { useEffect, useState } from 'react';
import ImageCropperModal from './ImageCropperModal.jsx';

// Using fixed URLs since you are not using env files
const API_BASE_URL = 'http://localhost:5000/api';

const tabs = [
  { id: 'projects', label: 'Project Management' },
  { id: 'clients', label: 'Client Management' },
  { id: 'contacts', label: 'Contact Messages' },
  { id: 'subscribers', label: 'Subscribers' },
];

function AdminPanel({ initialTab = 'projects' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  // Raw server origin (used for file uploads & image URLs)
  const API_ORIGIN = 'http://localhost:5000';

  // Project form state
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    imageFile: null,
  });
  const [projectStatus, setProjectStatus] = useState({
    submitting: false,
    success: '',
    error: '',
  });

  // Client form state
  const [clientForm, setClientForm] = useState({
    name: '',
    description: '',
    designation: '',
    imageFile: null,
  });
  const [clientStatus, setClientStatus] = useState({
    submitting: false,
    success: '',
    error: '',
  });

  // Image cropper state
  const [cropState, setCropState] = useState({
    mode: null, // 'project' | 'client' | null
    imageSrc: '',
    originalFile: null,
  });

  // Data lists
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactsError, setContactsError] = useState('');

  const [subscribers, setSubscribers] = useState([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [subscribersError, setSubscribersError] = useState('');

  // Keep tab in sync when initialTab prop changes (route-based navigation)
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Load admin-only data when switching tabs
  useEffect(() => {
    const fetchContacts = async () => {
      setContactsLoading(true);
      setContactsError('');
      try {
        const res = await fetch(`${API_BASE_URL}/contact`);
        if (!res.ok) {
          throw new Error('Failed to fetch contact messages');
        }
        const data = await res.json();
        setContacts(Array.isArray(data) ? data : []);
      } catch (err) {
        setContactsError(err.message || 'Something went wrong');
      } finally {
        setContactsLoading(false);
      }
    };

    const fetchSubscribers = async () => {
      setSubscribersLoading(true);
      setSubscribersError('');
      try {
        const res = await fetch(`${API_BASE_URL}/newsletter`);
        if (!res.ok) {
          throw new Error('Failed to fetch subscribers');
        }
        const data = await res.json();
        setSubscribers(Array.isArray(data) ? data : []);
      } catch (err) {
        setSubscribersError(err.message || 'Something went wrong');
      } finally {
        setSubscribersLoading(false);
      }
    };

    if (activeTab === 'contacts' && !contactsLoading && contacts.length === 0 && !contactsError) {
      fetchContacts();
    }
    if (
      activeTab === 'subscribers' &&
      !subscribersLoading &&
      subscribers.length === 0 &&
      !subscribersError
    ) {
      fetchSubscribers();
    }
  }, [
    activeTab,
    contacts.length,
    contactsError,
    contactsLoading,
    subscribers.length,
    subscribersError,
    subscribersLoading,
  ]);

  const handleProjectChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      const file = files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        setCropState({
          mode: 'project',
          imageSrc: reader.result,
          originalFile: file,
        });
      };
      reader.readAsDataURL(file);
      setProjectForm((prev) => ({ ...prev, imageFile: null }));
    } else {
      setProjectForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleClientChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      const file = files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        setCropState({
          mode: 'client',
          imageSrc: reader.result,
          originalFile: file,
        });
      };
      reader.readAsDataURL(file);
      setClientForm((prev) => ({ ...prev, imageFile: null }));
    } else {
      setClientForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadImageAndGetUrl = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_ORIGIN}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to upload image');
    }

    const data = await res.json();
    if (!data.filePath) {
      throw new Error('Upload did not return a file path');
    }

    return `${API_ORIGIN}${data.filePath}`;
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setProjectStatus({ submitting: true, success: '', error: '' });

    try {
      let imageUrl = '';
      if (projectForm.imageFile) {
        imageUrl = await uploadImageAndGetUrl(projectForm.imageFile);
      } else {
        throw new Error('Please select a project image');
      }

      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          name: projectForm.name,
          description: projectForm.description,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create project');
      }

      setProjectStatus({
        submitting: false,
        success: 'Project saved successfully.',
        error: '',
      });
      setProjectForm({
        name: '',
        description: '',
        imageFile: null,
      });
    } catch (err) {
      setProjectStatus({
        submitting: false,
        success: '',
        error: err.message || 'Something went wrong',
      });
    }
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    setClientStatus({ submitting: true, success: '', error: '' });

    try {
      let imageUrl = '';
      if (clientForm.imageFile) {
        imageUrl = await uploadImageAndGetUrl(clientForm.imageFile);
      } else {
        throw new Error('Please select a client image');
      }

      const res = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          name: clientForm.name,
          description: clientForm.description,
          designation: clientForm.designation,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create client');
      }

      setClientStatus({
        submitting: false,
        success: 'Client saved successfully.',
        error: '',
      });
      setClientForm({
        name: '',
        description: '',
        designation: '',
        imageFile: null,
      });
    } catch (err) {
      setClientStatus({
        submitting: false,
        success: '',
        error: err.message || 'Something went wrong',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <span className="text-lg font-semibold tracking-tight">Admin Panel</span>
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Internal use only
          </span>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <aside className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-3 shadow-sm shadow-slate-950/40 lg:w-64">
          <nav className="space-y-1 text-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${
                  activeTab === tab.id
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-900/40'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-slate-50'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex-1 space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/40 lg:p-6">
          {activeTab === 'projects' && (
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-50">
                Project Management
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Add new projects by uploading an image and providing basic details.
              </p>

              <form onSubmit={handleProjectSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-300">
                    Project Image
                  </label>
                  <input
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleProjectChange}
                    className="w-full cursor-pointer rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-100 hover:file:bg-slate-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-300">
                    Project Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={projectForm.name}
                    onChange={handleProjectChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    required
                    value={projectForm.description}
                    onChange={handleProjectChange}
                    rows={3}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="Brief description of the project"
                  />
                </div>
                <button
                  type="submit"
                  disabled={projectStatus.submitting}
                  className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-sky-900/40 transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-800"
                >
                  {projectStatus.submitting ? 'Saving...' : 'Save Project'}
                </button>
                {projectStatus.success && (
                  <p className="text-sm text-emerald-300">{projectStatus.success}</p>
                )}
                {projectStatus.error && (
                  <p className="text-sm text-red-300">{projectStatus.error}</p>
                )}
              </form>
            </div>
          )}

          {activeTab === 'clients' && (
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-50">
                Client Management
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Add client details and showcase testimonials or case studies.
              </p>

              <form onSubmit={handleClientSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-300">
                    Client Image
                  </label>
                  <input
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleClientChange}
                    className="w-full cursor-pointer rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-100 hover:file:bg-slate-700"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-300">
                      Client Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={clientForm.name}
                      onChange={handleClientChange}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                      placeholder="Enter client name"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-300">
                      Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      required
                      value={clientForm.designation}
                      onChange={handleClientChange}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                      placeholder="e.g. CEO, Marketing Head"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    required
                    value={clientForm.description}
                    onChange={handleClientChange}
                    rows={3}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="Short note or testimonial from the client"
                  />
                </div>
                <button
                  type="submit"
                  disabled={clientStatus.submitting}
                  className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-sky-900/40 transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-800"
                >
                  {clientStatus.submitting ? 'Saving...' : 'Save Client'}
                </button>
                {clientStatus.success && (
                  <p className="text-sm text-emerald-300">{clientStatus.success}</p>
                )}
                {clientStatus.error && (
                  <p className="text-sm text-red-300">{clientStatus.error}</p>
                )}
              </form>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-50">
                  Contact Messages
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  View all contact form submissions from your landing page.
                </p>
              </div>

              {contactsLoading && (
                <p className="text-sm text-slate-400">Loading contact messages...</p>
              )}
              {contactsError && <p className="text-sm text-red-300">{contactsError}</p>}

              {!contactsLoading && !contactsError && contacts.length === 0 && (
                <p className="text-sm text-slate-400">No contact messages yet.</p>
              )}

              {!contactsLoading && !contactsError && contacts.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Mobile</th>
                        <th className="px-4 py-3">City</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((c) => (
                        <tr
                          key={c._id}
                          className="border-t border-slate-800/70 hover:bg-slate-900/70"
                        >
                          <td className="px-4 py-2 text-slate-100">{c.fullName}</td>
                          <td className="px-4 py-2 text-slate-300">{c.email}</td>
                          <td className="px-4 py-2 text-slate-300">{c.mobileNumber}</td>
                          <td className="px-4 py-2 text-slate-300">{c.city}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'subscribers' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-50">
                  Subscribers
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  List of all email addresses subscribed to your newsletter.
                </p>
              </div>

              {subscribersLoading && (
                <p className="text-sm text-slate-400">Loading subscribers...</p>
              )}
              {subscribersError && <p className="text-sm text-red-300">{subscribersError}</p>}

              {!subscribersLoading && !subscribersError && subscribers.length === 0 && (
                <p className="text-sm text-slate-400">No subscribers yet.</p>
              )}

              {!subscribersLoading && !subscribersError && subscribers.length > 0 && (
                <ul className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-950/40 text-sm">
                  {subscribers.map((s) => (
                    <li key={s._id} className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-slate-100">{s.email}</span>
                      <span className="text-xs text-slate-500">
                        {s.createdAt && new Date(s.createdAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      </main>

      <ImageCropperModal
        open={!!cropState.mode}
        imageSrc={cropState.imageSrc}
        originalFile={cropState.originalFile}
        onCancel={() =>
          setCropState({
            mode: null,
            imageSrc: '',
            originalFile: null,
          })
        }
        onComplete={(croppedFile) => {
          if (cropState.mode === 'project') {
            setProjectForm((prev) => ({ ...prev, imageFile: croppedFile }));
          } else if (cropState.mode === 'client') {
            setClientForm((prev) => ({ ...prev, imageFile: croppedFile }));
          }
          setCropState({
            mode: null,
            imageSrc: '',
            originalFile: null,
          });
        }}
      />
    </div>
  );
}

export default AdminPanel;



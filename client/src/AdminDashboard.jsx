function AdminDashboard() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Welcome to the Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Use the navigation to manage projects, clients, contact responses, and newsletter
          subscribers.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Projects
          </p>
          <p className="mt-1 text-lg font-semibold text-gray-900">Manage portfolio work</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Clients
          </p>
          <p className="mt-1 text-lg font-semibold text-gray-900">Showcase client stories</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Contact Responses
          </p>
          <p className="mt-1 text-lg font-semibold text-gray-900">Follow up on leads</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Subscribers
          </p>
          <p className="mt-1 text-lg font-semibold text-gray-900">Grow your audience</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;



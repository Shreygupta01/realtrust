import { NavLink, Outlet } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  [
    'inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-300'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  ].join(' ');

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="border-b border-gray-200 bg-white/80 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
              AD
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight text-gray-900">
                Admin Dashboard
              </p>
              <p className="text-xs text-gray-500">Internal management panel</p>
            </div>
          </div>
          <nav className="hidden gap-2 sm:flex">
            <NavLink to="/admin/projects" className={navLinkClass}>
              Projects
            </NavLink>
            <NavLink to="/admin/clients" className={navLinkClass}>
              Clients
            </NavLink>
            <NavLink to="/admin/contacts" className={navLinkClass}>
              Contact Responses
            </NavLink>
            <NavLink to="/admin/subscribers" className={navLinkClass}>
              Subscribers
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 lg:flex-row">
        <aside className="w-full rounded-2xl border border-gray-200 bg-white p-3 text-sm shadow-sm lg:w-64">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Sections
          </p>
          <div className="space-y-1">
            <NavLink to="/admin/projects" className={navLinkClass}>
              Project Management
            </NavLink>
            <NavLink to="/admin/clients" className={navLinkClass}>
              Client Management
            </NavLink>
            <NavLink to="/admin/contacts" className={navLinkClass}>
              Contact Responses
            </NavLink>
            <NavLink to="/admin/subscribers" className={navLinkClass}>
              Subscribers
            </NavLink>
          </div>
        </aside>

        <section className="flex-1 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default AdminLayout;



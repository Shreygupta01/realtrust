import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Pages / Components
import LandingPage from './components/LandingPage.jsx';
import AdminLayout from './AdminLayout.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import AdminProjects from './components/AdminProjects.jsx';
import AdminClients from './components/AdminClients.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Default dashboard */}
          <Route index element={<AdminDashboard />} />

          {/* Admin nested routes */}
          <Route path="projects" element={<AdminProjects />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="contacts" element={<AdminPanel initialTab="contacts" />} />
          <Route path="subscribers" element={<AdminPanel initialTab="subscribers" />} />
        </Route>

        {/* Catch-all: Redirect any invalid route to LandingPage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;




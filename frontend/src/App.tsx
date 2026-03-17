import { useEffect, useState } from 'react';
import { Home } from './pages/Home';
import { AdminDashboard } from './pages/AdminDashboard';
import { LibrarianDashboard } from './pages/LibrarianDashboard';
import type { AppUserRole } from './utils/roles';
import { normalizeRole, isDashboardRole } from './utils/roles';

const ROLE_STORAGE_KEY = 'bu_user_role';

function App() {
  const [userRole, setUserRole] = useState<AppUserRole>(null);

  const syncStorage = (role: AppUserRole) => {
    if (typeof window === 'undefined') return;
    if (role) {
      window.localStorage.setItem(ROLE_STORAGE_KEY, role);
    } else {
      window.localStorage.removeItem(ROLE_STORAGE_KEY);
    }
  };

  const applyRole = (role: AppUserRole) => {
    setUserRole(role);
    syncStorage(role);
  };

  const handleRoleChange = (rawRole: string | null | undefined) => {
    applyRole(normalizeRole(rawRole));
  };

  const handleDashboardLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('userId');
    }
    applyRole(null);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const urlRole = normalizeRole(urlParams.get('role'));
    let storedUserRole: AppUserRole = null;
    const storedUserRaw = window.localStorage.getItem('user');
    if (storedUserRaw) {
      try {
        const parsed = JSON.parse(storedUserRaw);
        storedUserRole = normalizeRole(parsed?.role);
      } catch {
        storedUserRole = null;
      }
    }

    const resolvedRole = urlRole ?? storedUserRole;
    applyRole(resolvedRole);
  }, []);

  if (userRole && isDashboardRole(userRole)) {
    const Dashboard = userRole === 'ADMIN' ? AdminDashboard : LibrarianDashboard;
    return (
      <div className="w-full min-h-screen">
        <Dashboard onLogout={handleDashboardLogout} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <Home onRoleChange={handleRoleChange} />
    </div>
  );
}

export default App;

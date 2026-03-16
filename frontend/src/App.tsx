import { useEffect, useState } from 'react';
import { Home } from './pages/Home';
import { AdminDashboard } from './pages/AdminDashboard';
import { LibrarianDashboard } from './pages/LibrarianDashboard';

type DashboardRole = 'ADMIN' | 'BIBLIOTECARIE';
type GeneralRole = 'ETUDIANT' | 'ENSEIGNANT';
export type AppUserRole = DashboardRole | GeneralRole | null;

const ROLE_STORAGE_KEY = 'bu_user_role';

const normalizeRole = (input: string | null | undefined): AppUserRole => {
  if (!input) return null;
  const normalized = input.trim().toLowerCase();

  if (normalized === 'admin') return 'ADMIN';
  if (['bibliothecaire', 'bibliothequaire', 'librarian'].includes(normalized)) return 'BIBLIOTECARIE';
  if (['etudiant', 'student'].includes(normalized)) return 'ETUDIANT';
  if (['prof', 'professor', 'enseignant'].includes(normalized)) return 'ENSEIGNANT';

  return null;
};

const isDashboardRole = (role: AppUserRole): role is DashboardRole => {
  return role === 'ADMIN' || role === 'BIBLIOTECARIE';
};

function App() {
  const [userRole, setUserRole] = useState<AppUserRole>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const urlRole = normalizeRole(urlParams.get('role'));
    const storedRole = normalizeRole(window.localStorage.getItem(ROLE_STORAGE_KEY));
    const resolvedRole = urlRole ?? storedRole;

    if (resolvedRole) {
      window.localStorage.setItem(ROLE_STORAGE_KEY, resolvedRole);
      setUserRole(resolvedRole);
    } else {
      window.localStorage.removeItem(ROLE_STORAGE_KEY);
    }
  }, []);

  if (userRole && isDashboardRole(userRole)) {
    const Dashboard = userRole === 'ADMIN' ? AdminDashboard : LibrarianDashboard;
    return (
      <div className="w-full min-h-screen">
        <Dashboard />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <Home />
    </div>
  );
}

export default App;

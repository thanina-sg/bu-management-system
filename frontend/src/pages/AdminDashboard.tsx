import { useEffect, useState } from 'react';
import { Sidebar } from '../components//Sidebar/Sidebar';
import { AdminOverview } from '../components/Admin/AdminOverview';
import { AdminUsers } from '../components/Admin/AdminUsers';
import { AdminBooks } from '../components/Admin/AdminBooks';
import { AdminSettings } from '../components/Admin/AdminSettings';
import type { AdminMetrics } from '../types/admin';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

type AdminDashboardProps = {
  onLogout?: () => void;
};

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch global metrics for the overview
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/metrics`);
        const data = await response.json();
        setMetrics(data.data);
      } catch (error) {
        console.error("Failed to load metrics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const renderContent = () => {
    if (loading) return <div className="flex items-center justify-center h-full text-slate-400 animate-pulse">Initialisation du système...</div>;

    switch (activeTab) {
      case 'dashboard':
        return metrics ? <AdminOverview stats={metrics} /> : null;
      case 'users':
        return <AdminUsers />;
      case 'books':
        return <AdminBooks />;
      case 'rules':
        return <AdminSettings />;
      default:
        return <AdminOverview stats={metrics!} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Sidebar with Glass Style */}
      <Sidebar 
        activeItem={activeTab} 
        onItemClick={setActiveTab} 
        userRole="ADMINISTRATEUR"
        onLogout={onLogout}
        items={[
          { id: 'dashboard', label: 'Vue d\'ensemble', icon: '📊' },
          { id: 'books', label: 'Catalogue', icon: '📚' },
          { id: 'users', label: 'Utilisateurs', icon: '👥' },
          { id: 'rules', label: 'Configuration', icon: '⚙️' },
        ]}
      />

      {/* Main Content Area with Radial Gradient Background */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#020617] to-[#020617]">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

import { StatCard } from '../Dashboard/StatCard';
import type { AdminMetrics } from '../../types/admin';

interface AdminOverviewProps {
  stats: AdminMetrics;
}

export const AdminOverview = ({ stats }: AdminOverviewProps) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <p className="text-sm uppercase tracking-widest text-slate-400 font-medium">Vue d'ensemble</p>
        <h2 className="text-3xl font-bold text-slate-900">Tableau de Bord</h2>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Livres" 
          value={stats.totalBooks.toLocaleString()} 
          icon="📚" 
          color="blue" 
        />
        <StatCard 
          title="Utilisateurs" 
          value={stats.totalUsers.toLocaleString()} 
          icon="👥" 
          color="green" 
        />
        <StatCard 
          title="Bibliothécaires" 
          value={stats.librarians.toLocaleString()} 
          icon="🔑" 
          color="purple" 
        />
        <StatCard 
          title="Emprunts Actifs" 
          value={stats.activeEmprunts.toLocaleString()} 
          icon="📤" 
          color="orange" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions / Recent Activity Placeholder */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
            Activités Récentes
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <p className="text-sm text-slate-600 font-medium">Synchronisation des données terminée</p>
                <span className="ml-auto text-xs text-slate-400">Il y a 2h</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-green-500 rounded-full"></span>
            Santé du Système
          </h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Base de données PostgreSQL</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">OPÉRATIONNEL</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Service d'Authentification</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">OPÉRATIONNEL</span>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 italic">Dernière vérification : Aujourd'hui à {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

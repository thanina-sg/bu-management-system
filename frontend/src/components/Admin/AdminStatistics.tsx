import { StatCard } from '../Dashboard/StatCard';

export const AdminOverview = ({ stats }: { stats: any }) => {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Vue d'ensemble</h2>
        <p className="text-slate-500">Statistiques en temps réel de votre bibliothèque.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Livres" value={stats.books} icon="📚" color="blue" />
        <StatCard title="Utilisateurs" value={stats.users} icon="👥" color="green" />
        <StatCard title="Bibliothécaires" value={stats.librarians} icon="purple" color="purple" />
        <StatCard title="Emprunts Actifs" value={stats.emprunts} icon="📤" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold mb-4">Activités Récentes</h3>
          {/* Map through a 'recent activity' state here */}
          <div className="text-sm text-slate-400">Aucune activité récente à afficher.</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold mb-4">État du système</h3>
          <ul className="space-y-4">
            <li className="flex justify-between text-sm">
              <span>Base de données</span>
              <span className="text-green-500 font-medium">Connecté</span>
            </li>
            <li className="flex justify-between text-sm">
              <span>Temps de réponse</span>
              <span className="text-slate-600 font-medium">12ms</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
import { useEffect, useState } from 'react';
import { AdminUserCard } from './AdminUserCard';
import type { AdminUser } from '../../types/admin';

export const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Linked to your adminModel.getAdminUsers()
    fetch('http://localhost:5000/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Utilisateurs</h2>
          <p className="text-slate-400 font-medium mt-1">Gestion des accès et de la hiérarchie du système.</p>
        </div>
        <button className="group relative px-8 py-4 bg-blue-600 rounded-2xl overflow-hidden transition-all hover:bg-blue-500 active:scale-95">
           <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
           <span className="relative text-white font-black uppercase tracking-widest text-xs">+ Ajouter un membre</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading 
          ? [1, 2, 3].map(i => <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/5" />)
          : users.map(user => <AdminUserCard key={user.id} user={user} />)
        }
      </div>
    </div>
  );
};
import type { AdminUser } from '../../types/admin';

interface AdminUserCardProps {
  user: AdminUser;
}

export const AdminUserCard = ({ user }: AdminUserCardProps) => {
  return (
    <div className="relative group">
      {/* The Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
      
      <article className="relative bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">{user.fullName}</h3>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
          </div>
          <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${
            user.status === 'ACTIF' 
              ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' 
              : 'border-amber-500/30 text-amber-400 bg-amber-500/10'
          }`}>
            {user.status}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-400 px-2 py-0.5 bg-blue-500/10 rounded">
              {user.role}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.privileges.map((priv, i) => (
              <span key={i} className="text-[11px] text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/5">
                {priv}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex gap-3">
          <button className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition">
            Modifier
          </button>
          <button className="flex-1 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition">
            Suspendre
          </button>
        </div>
      </article>
    </div>
  );
};
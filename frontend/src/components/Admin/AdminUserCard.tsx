import type { AdminUser } from '../../types/admin';

interface AdminUserCardProps {
  user: AdminUser;
}

export const AdminUserCard = ({ user }: AdminUserCardProps) => {
  return (
    <article className="rounded-2xl bg-white shadow-sm border border-slate-100 p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{user.fullName}</h3>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            user.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-800'
          }`}
        >
          {user.status}
        </span>
      </div>
      <div className="flex items-center text-sm text-slate-600 gap-3">
        <span className="text-blue-600 font-semibold">{user.role}</span>
        <span className="text-slate-400">•</span>
        <span>{user.privileges.join(' • ')}</span>
      </div>
      <div className="flex gap-3 flex-wrap">
        <button className="text-sm font-semibold text-blue-600 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition">
          Voir le profil
        </button>
        <button className="text-sm font-semibold text-slate-600 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
          Modifier
        </button>
      </div>
    </article>
  );
};

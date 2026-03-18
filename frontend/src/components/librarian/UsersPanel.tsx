import { useEffect, useState, useMemo } from "react";
import { users as usersAPI, type User, type UserRole } from "../../lib/api";
import { RoleBadge } from "../StatusBadges";
import { AddUserForm } from "./AddUserForm";

export function UsersPanel({ roleFilter }: { roleFilter?: UserRole[] } = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<{ nom?: string; prenom?: string; email: string; role: UserRole }>({ email: "", role: "ETUDIANT" });
  const [toast, setToast] = useState<string | null>(null);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await usersAPI.getAll();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const startEdit = (u: User) => { setEditingId(u.id); setEditFields({ nom: u.nom, prenom: u.prenom, email: u.email, role: u.role }); };
  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id: string) => {
    try {
      await usersAPI.update(id, editFields);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, ...editFields } : u));
      setEditingId(null);
      showToast(`Utilisateur ${id} mis a jour.`);
    } catch (err) {
      showToast("Echec de la mise a jour de l'utilisateur.");
      console.error(err);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await usersAPI.delete(id);
      const user = users.find((u) => u.id === id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast(`"${user?.prenom || ''} ${user?.nom || ''}" supprime.`);
    } catch (err) {
      showToast("Echec de la suppression de l'utilisateur.");
      console.error(err);
    }
  };

  const handleAddUser = (user: User) => {
    setUsers((prev) => [user, ...prev]);
    showToast(`"${user.prenom || ''} ${user.nom || ''}" cree avec le role ${user.role}.`);
  };

  const filteredUsers = useMemo(() => {
    if (!roleFilter || roleFilter.length === 0) return users;
    return users.filter(u => roleFilter.includes(u.role));
  }, [users, roleFilter]);

  const roleStats = useMemo(() => {
    const baseStats = {
      ETUDIANT: users.filter((u) => u.role === "ETUDIANT").length,
      ENSEIGNANT: users.filter((u) => u.role === "ENSEIGNANT").length,
      BIBLIOTHECAIRE: users.filter((u) => u.role === "BIBLIOTHECAIRE").length,
      ADMINISTRATEUR: users.filter((u) => u.role === "ADMINISTRATEUR").length,
    };
    if (!roleFilter || roleFilter.length === 0) return baseStats;
    return Object.fromEntries(
      Object.entries(baseStats).filter(([_, count]) => count > 0)
    ) as Record<UserRole, number>;
  }, [users, roleFilter]);

  const panelTitle = useMemo(() => {
    if (!roleFilter || roleFilter.length === 0) return "Comptes utilisateurs";
    const hasStudent = roleFilter.includes("ETUDIANT");
    const hasTeacher = roleFilter.includes("ENSEIGNANT");
    const hasLibrarian = roleFilter.includes("BIBLIOTHECAIRE");
    if (hasStudent && hasTeacher) return "Etudiants et enseignants";
    if (hasLibrarian) return "Bibliothecaires";
    return "Comptes utilisateurs";
  }, [roleFilter]);

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(Object.entries(roleStats) as [UserRole, number][]).map(([r, count]) => (
          <div key={r} className="rounded-lg border border-ink-100 bg-white p-3 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-500">{r}</span>
              <RoleBadge role={r} />
            </div>
            <div className="mt-1 font-serif text-2xl font-bold text-ink-900">{count}</div>
          </div>
        ))}
      </div>

      <AddUserForm onAdd={handleAddUser} roleFilter={roleFilter} />

      <div className="rounded-xl border border-ink-100 bg-white shadow-soft">
        <div className="border-b border-ink-100 px-5 py-4">
          <h2 className="font-serif text-2xl text-ink-900">{panelTitle}</h2>
          <p className="mt-1 text-xs text-ink-500">{filteredUsers.length} utilisateur(s)</p>
        </div>

        {toast && <div className="mx-5 mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">&#x2713; {toast}</div>}

        <div className="hidden md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                <th className="px-5 py-3">ID</th><th className="px-5 py-3">Nom</th><th className="px-5 py-3">E-mail</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-ink-100 last:border-b-0">
                  <td className="px-5 py-3 text-xs font-medium text-ink-700">{u.id}</td>
                  <td className="px-5 py-3">
                    {editingId === u.id
                       ? <div className="grid grid-cols-2 gap-2"><input value={editFields.prenom || ''} onChange={(e) => setEditFields((f) => ({ ...f, prenom: e.target.value }))} className="w-full rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500" /><input value={editFields.nom || ''} onChange={(e) => setEditFields((f) => ({ ...f, nom: e.target.value }))} className="w-full rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500" /></div>
                       : <span className="text-xs font-semibold text-ink-900">{`${u.prenom || ''} ${u.nom || ''}`.trim()}</span>}
                  </td>
                  <td className="px-5 py-3">
                    {editingId === u.id
                      ? <input value={editFields.email} onChange={(e) => setEditFields((f) => ({ ...f, email: e.target.value }))} className="w-full rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500" />
                      : <span className="text-xs text-ink-700">{u.email}</span>}
                  </td>
                  <td className="px-5 py-3">
                    {editingId === u.id ? (
                      <select value={editFields.role} onChange={(e) => setEditFields((f) => ({ ...f, role: e.target.value as UserRole }))}
                        className="rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500">
                        <option value="ETUDIANT">Etudiant</option><option value="ENSEIGNANT">Enseignant</option><option value="BIBLIOTHECAIRE">Bibliothecaire</option><option value="ADMINISTRATEUR">Administrateur</option>
                      </select>
                    ) : <RoleBadge role={u.role} />}
                  </td>
                  <td className="px-5 py-3">
                    {editingId === u.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(u.id)} className="rounded bg-brand-700 px-3 py-1 text-[10px] font-semibold text-white hover:bg-brand-600">Enregistrer</button>
                        <button onClick={cancelEdit} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-500 hover:bg-surface-50">Annuler</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(u)} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-700 hover:bg-surface-50">Modifier</button>
                        <button onClick={() => deleteUser(u.id)} className="rounded border border-rose-200 px-3 py-1 text-[10px] font-semibold text-rose-600 hover:bg-rose-50">Supprimer</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {filteredUsers.map((u) => (
            <div key={u.id} className="rounded-lg border border-ink-100 bg-surface-50 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-ink-900">{editingId === u.id ? `${editFields.prenom || ''} ${editFields.nom || ''}`.trim() : `${u.prenom || ''} ${u.nom || ''}`.trim()}</div>
                  <div className="mt-0.5 text-[10px] text-ink-500">{editingId === u.id ? editFields.email : u.email}</div>
                  <div className="mt-0.5 text-[10px] text-ink-500">{u.id}</div>
                </div>
                <RoleBadge role={editingId === u.id ? editFields.role : u.role} />
              </div>
              <div className="mt-3">
                {editingId === u.id ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2"><input value={editFields.prenom || ''} onChange={(e) => setEditFields((f) => ({ ...f, prenom: e.target.value }))} placeholder="Prenom" className="w-full rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500" /><input value={editFields.nom || ''} onChange={(e) => setEditFields((f) => ({ ...f, nom: e.target.value }))} placeholder="Nom" className="w-full rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500" /></div>
                    <input value={editFields.email} onChange={(e) => setEditFields((f) => ({ ...f, email: e.target.value }))} placeholder="E-mail" className="w-full rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500" />
                    <select value={editFields.role} onChange={(e) => setEditFields((f) => ({ ...f, role: e.target.value as UserRole }))} className="w-full rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500">
                      <option value="ETUDIANT">Etudiant</option><option value="ENSEIGNANT">Enseignant</option><option value="BIBLIOTHECAIRE">Bibliothecaire</option><option value="ADMINISTRATEUR">Administrateur</option>
                    </select>
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(u.id)} className="rounded bg-brand-700 px-3 py-1 text-[10px] font-semibold text-white hover:bg-brand-600">Enregistrer</button>
                      <button onClick={cancelEdit} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-500 hover:bg-surface-50">Annuler</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(u)} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-700 hover:bg-surface-50">Modifier</button>
                    <button onClick={() => deleteUser(u.id)} className="rounded border border-rose-200 px-3 py-1 text-[10px] font-semibold text-rose-600 hover:bg-rose-50">Supprimer</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

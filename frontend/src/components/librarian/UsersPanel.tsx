import { useState } from "react";
import { USERS, type User, type UserRole } from "../../lib/books";
import { RoleBadge } from "../StatusBadges";
import { AddUserForm } from "./AddUserForm";

export function UsersPanel() {
  const [users, setUsers] = useState<User[]>(USERS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<{ name: string; email: string; role: UserRole }>({ name: "", email: "", role: "Student" });
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const startEdit = (u: User) => { setEditingId(u.id); setEditFields({ name: u.name, email: u.email, role: u.role }); };
  const cancelEdit = () => setEditingId(null);

  const saveEdit = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, ...editFields } : u));
    setEditingId(null);
    showToast(`User ${id} updated.`);
  };

  const deleteUser = (id: string) => {
    const user = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showToast(`"${user?.name}" removed.`);
  };

  const handleAddUser = (user: User) => {
    setUsers((prev) => [user, ...prev]);
    showToast(`"${user.name}" created as ${user.role}.`);
  };

  const roleStats = {
    Student: users.filter((u) => u.role === "Student").length,
    Teacher: users.filter((u) => u.role === "Teacher").length,
    Librarian: users.filter((u) => u.role === "Librarian").length,
    Admin: users.filter((u) => u.role === "Admin").length,
  };

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(Object.entries(roleStats) as [UserRole, number][]).map(([r, count]) => (
          <div key={r} className="rounded-lg border border-ink-100 bg-white p-3 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-500">{r}s</span>
              <RoleBadge role={r} />
            </div>
            <div className="mt-1 font-serif text-2xl font-bold text-ink-900">{count}</div>
          </div>
        ))}
      </div>

      <AddUserForm onAdd={handleAddUser} />

      <div className="rounded-xl border border-ink-100 bg-white shadow-soft">
        <div className="border-b border-ink-100 px-5 py-4">
          <h2 className="font-serif text-2xl text-ink-900">User Accounts</h2>
          <p className="mt-1 text-xs text-ink-500">{users.length} user(s)</p>
        </div>

        {toast && <div className="mx-5 mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">&#x2713; {toast}</div>}

        <div className="hidden md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                <th className="px-5 py-3">ID</th><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-ink-100 last:border-b-0">
                  <td className="px-5 py-3 text-xs font-medium text-ink-700">{u.id}</td>
                  <td className="px-5 py-3">
                    {editingId === u.id
                      ? <input value={editFields.name} onChange={(e) => setEditFields((f) => ({ ...f, name: e.target.value }))} className="w-full rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500" />
                      : <span className="text-xs font-semibold text-ink-900">{u.name}</span>}
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
                        <option value="Student">Student</option><option value="Teacher">Teacher</option><option value="Librarian">Librarian</option><option value="Admin">Admin</option>
                      </select>
                    ) : <RoleBadge role={u.role} />}
                  </td>
                  <td className="px-5 py-3">
                    {editingId === u.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(u.id)} className="rounded bg-brand-700 px-3 py-1 text-[10px] font-semibold text-white hover:bg-brand-600">Save</button>
                        <button onClick={cancelEdit} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-500 hover:bg-surface-50">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(u)} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-700 hover:bg-surface-50">Edit</button>
                        <button onClick={() => deleteUser(u.id)} className="rounded border border-rose-200 px-3 py-1 text-[10px] font-semibold text-rose-600 hover:bg-rose-50">Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {users.map((u) => (
            <div key={u.id} className="rounded-lg border border-ink-100 bg-surface-50 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-ink-900">{editingId === u.id ? editFields.name : u.name}</div>
                  <div className="mt-0.5 text-[10px] text-ink-500">{editingId === u.id ? editFields.email : u.email}</div>
                  <div className="mt-0.5 text-[10px] text-ink-500">{u.id}</div>
                </div>
                <RoleBadge role={editingId === u.id ? editFields.role : u.role} />
              </div>
              <div className="mt-3">
                {editingId === u.id ? (
                  <div className="space-y-2">
                    <input value={editFields.name} onChange={(e) => setEditFields((f) => ({ ...f, name: e.target.value }))} placeholder="Name" className="w-full rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500" />
                    <input value={editFields.email} onChange={(e) => setEditFields((f) => ({ ...f, email: e.target.value }))} placeholder="Email" className="w-full rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500" />
                    <select value={editFields.role} onChange={(e) => setEditFields((f) => ({ ...f, role: e.target.value as UserRole }))} className="w-full rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500">
                      <option value="Student">Student</option><option value="Teacher">Teacher</option><option value="Librarian">Librarian</option><option value="Admin">Admin</option>
                    </select>
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(u.id)} className="rounded bg-brand-700 px-3 py-1 text-[10px] font-semibold text-white hover:bg-brand-600">Save</button>
                      <button onClick={cancelEdit} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-500 hover:bg-surface-50">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(u)} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-700 hover:bg-surface-50">Edit</button>
                    <button onClick={() => deleteUser(u.id)} className="rounded border border-rose-200 px-3 py-1 text-[10px] font-semibold text-rose-600 hover:bg-rose-50">Delete</button>
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

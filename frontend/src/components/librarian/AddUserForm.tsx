import { useState } from "react";
import type { User, UserRole } from "../../lib/books";

export function AddUserForm({ onAdd }: { onAdd: (user: User) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("Student");
  const [error, setError] = useState("");

  const reset = () => { setName(""); setEmail(""); setRole("Student"); setError(""); };

  const prefixForRole = (r: UserRole) => {
    switch (r) {
      case "Student": return "S";
      case "Teacher": return "T";
      case "Librarian": return "LIB";
      case "Admin": return "ADM";
    }
  };

  const handleAdd = () => {
    if (!name.trim() || !email.trim()) { setError("Name and Email are required."); return; }
    if (!email.includes("@")) { setError("Please enter a valid email."); return; }
    setError("");
    const prefix = prefixForRole(role);
    const id = `${prefix}-${String(Date.now()).slice(-6)}`;
    onAdd({ id, name: name.trim(), email: email.trim(), role });
    reset();
    setOpen(false);
  };

  if (!open) {
    return <button onClick={() => setOpen(true)} className="rounded-lg bg-brand-700 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600">+ Add User</button>;
  }

  return (
    <div className="rounded-xl border border-ink-100 border-t-4 border-t-violet-600 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl text-ink-900">Add New User</h3>
        <button onClick={() => { setOpen(false); reset(); }} className="text-xs font-semibold text-ink-500 hover:text-ink-700">Cancel</button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-ink-500">Full Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Marie Lambert"
            className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-500">Email *</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. marie.lambert@uha.fr"
            className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-500">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500">
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Librarian">Librarian</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>
      {error && <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
      <button onClick={handleAdd} className="mt-4 w-full rounded-lg bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:bg-brand-600">Create User</button>
    </div>
  );
}

import { useState, useMemo } from "react";
import { users as usersAPI, type User, type UserRole } from "../../lib/api";

export function AddUserForm({ onAdd, roleFilter }: { onAdd: (user: User) => void; roleFilter?: UserRole[] }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("ETUDIANT");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const availableRoles: { value: UserRole; label: string }[] = useMemo(() => {
    if (!roleFilter || roleFilter.length === 0) {
      return [
        { value: "ETUDIANT", label: "Student" },
        { value: "ENSEIGNANT", label: "Teacher" },
        { value: "BIBLIOTHECAIRE", label: "Librarian" },
        { value: "ADMIN", label: "Admin" },
      ];
    }
    return [
      { value: "ETUDIANT", label: "Student" },
      { value: "ENSEIGNANT", label: "Teacher" },
      { value: "BIBLIOTHECAIRE", label: "Librarian" },
      { value: "ADMIN", label: "Admin" },
    ].filter(r => roleFilter.includes(r.value));
  }, [roleFilter]);

  const reset = () => { 
    setName(""); 
    setEmail(""); 
    const defaultRole = availableRoles.length > 0 ? availableRoles[0].value : "ETUDIANT"; 
    setRole(defaultRole); 
    setError(""); 
  };

  const handleAdd = async () => {
    if (!name.trim() || !email.trim()) { setError("Name and Email are required."); return; }
    if (!email.includes("@")) { setError("Please enter a valid email."); return; }
    setError("");
    setIsLoading(true);
    
    try {
      const user = await usersAPI.create({
        name: name.trim(),
        email: email.trim(),
        role
      });
      onAdd(user);
      reset();
      setOpen(false);
    } catch (err) {
      setError("Failed to create user.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
            {availableRoles.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>
      {error && <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
      <button onClick={handleAdd} disabled={isLoading} className="mt-4 w-full rounded-lg bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:bg-brand-600 disabled:opacity-50">{isLoading ? "Creating..." : "Create User"}</button>
    </div>
  );
}

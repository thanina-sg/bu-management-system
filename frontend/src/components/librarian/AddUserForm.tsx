import { useState, useMemo } from "react";
import { users as usersAPI, type User, type UserRole } from "../../lib/api";

export function AddUserForm({ onAdd, roleFilter }: { onAdd: (user: User) => void; roleFilter?: UserRole[] }) {
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("ETUDIANT");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const availableRoles: { value: UserRole; label: string }[] = useMemo(() => {
    const baseRoles: { value: UserRole; label: string }[] = [
      { value: "ETUDIANT", label: "Etudiant" },
      { value: "ENSEIGNANT", label: "Enseignant" },
      { value: "BIBLIOTHECAIRE", label: "Bibliothecaire" },
      { value: "ADMINISTRATEUR", label: "Administrateur" },
    ];

    if (!roleFilter || roleFilter.length === 0) {
      return baseRoles;
    }
    return baseRoles.filter((r) => roleFilter.includes(r.value));
  }, [roleFilter]);

  const reset = () => { 
    setNom("");
    setPrenom("");
    setEmail(""); 
    const defaultRole = availableRoles.length > 0 ? availableRoles[0].value : "ETUDIANT"; 
    setRole(defaultRole); 
    setError(""); 
  };

  const handleAdd = async () => {
    if (!nom.trim() || !prenom.trim() || !email.trim()) { setError("Nom, prenom et email sont obligatoires."); return; }
    if (!email.includes("@")) { setError("Veuillez saisir un e-mail valide."); return; }
    setError("");
    setIsLoading(true);
    
    try {
      const user = await usersAPI.create({
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim(),
        role
      });
      onAdd(user);
      reset();
      setOpen(false);
    } catch (err) {
      setError("Echec de la creation de l'utilisateur.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) {
    return <button onClick={() => setOpen(true)} className="rounded-lg bg-brand-700 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600">+ Ajouter un utilisateur</button>;
  }

  return (
    <div className="rounded-xl border border-ink-100 border-t-4 border-t-violet-600 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl text-ink-900">Ajouter un utilisateur</h3>
        <button onClick={() => { setOpen(false); reset(); }} className="text-xs font-semibold text-ink-500 hover:text-ink-700">Annuler</button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-ink-500">Nom complet *</label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Prenom"
              className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500" />
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom"
            className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-500">E-mail *</label>
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
      <button onClick={handleAdd} disabled={isLoading} className="mt-4 w-full rounded-lg bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:bg-brand-600 disabled:opacity-50">{isLoading ? "Creation..." : "Creer l'utilisateur"}</button>
    </div>
  );
}

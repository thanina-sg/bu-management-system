import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../lib/api";
import type { LoggedInRole } from "./types";

export function StaffLoginForm({ onLogin }: { onLogin: (role: LoggedInRole, name: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const roleMap: Record<string, LoggedInRole> = {
    'BIBLIOTHECAIRE': 'Librarian',
    'ADMINISTRATEUR': 'Admin',
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (!email.includes("@")) {
      setError("Veuillez saisir une adresse e-mail valide.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const user = await auth.loginStaff(email.trim(), password);
      
      // Map French role to UI role
      const uiRole: LoggedInRole = roleMap[user.role] || 'Librarian';
      const userName = `${user.prenom || ''} ${user.nom || ''}`.trim() || user.email;
      
      onLogin(uiRole, userName);
    } catch (err) {
      setError("Identifiants invalides. Verifiez votre e-mail et votre mot de passe.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl justify-center px-6 py-14">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 text-sm font-semibold text-white shadow-soft">
          LN
        </div>
        <h1 className="mt-4 font-serif text-4xl tracking-tight text-ink-900">Portail personnel</h1>
        <p className="mt-2 text-sm text-ink-500">Connectez-vous pour gerer le systeme de bibliotheque</p>

        <div className="mt-8 rounded-xl border border-ink-100 bg-white p-6 text-left shadow-soft">
          <div className="text-sm font-semibold text-ink-900">Connexion</div>
          <p className="mt-1 text-xs text-ink-500">Entrez vos identifiants pour continuer.</p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-ink-500">E-mail</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sophie.martin@uha.fr"
                className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-ink-500">Mot de passe</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="mt-1 w-full rounded-lg bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:bg-brand-600 disabled:bg-ink-300"
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </button>

            <div className="text-center text-xs text-ink-500">
              <Link to="/" className="font-semibold text-ink-700 hover:text-ink-900">
                Retour au catalogue
              </Link>
            </div>
          </div>

          <div className="mt-6 border-t border-ink-100 pt-4">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-500">Comptes de demonstration</div>
            <div className="mt-2 space-y-1.5 text-[11px] text-ink-500">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-semibold text-blue-700">Bibliothecaire</span>
                sophie.martin@uha.fr / lib123
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-violet-100 px-1.5 py-0.5 text-[9px] font-semibold text-violet-700">Administrateur</span>
                admin@uha.fr / admin123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

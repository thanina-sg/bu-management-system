import { useState } from "react";
import { auth, type User, APIError } from "../lib/api";

export function StudentLoginView({ onLogin }: { onLogin: (user: User) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const user = await auth.loginStudent(email, password);
      onLogin(user);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message || "Connexion impossible. Veuillez reessayer.");
      } else {
        setError("Une erreur inattendue est survenue. Veuillez reessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-5 py-5">
      <div className="text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-xs font-semibold text-white">
          &#x25C9;
        </div>
        <h3 className="mt-3 font-serif text-lg text-ink-900">Portail etudiant</h3>
        <p className="mt-1 text-[11px] text-ink-500">Connectez-vous pour voir vos emprunts et reservations</p>
      </div>

      <div className="mt-5 space-y-3">
        <div>
          <label className="mb-1 block text-[10px] font-medium text-ink-500">E-mail</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. alice.dupont@uha.fr"
            className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-xs text-ink-900 outline-none focus:border-brand-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-medium text-ink-500">Mot de passe</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-xs text-ink-900 outline-none focus:border-brand-500"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-[10px] text-rose-700">{error}</div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full rounded-lg bg-brand-700 px-4 py-2.5 text-xs font-semibold text-white shadow-soft hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </button>
      </div>

      <div className="mt-4 border-t border-ink-100 pt-3">
        <div className="text-[9px] font-semibold uppercase tracking-wide text-ink-500">Comptes de demonstration (mot de passe: stu123)</div>
        <div className="mt-1.5 space-y-1 text-[10px] text-ink-500">
          <div>alice.dupont@uha.fr</div>
          <div>marc.leroy@uha.fr</div>
          <div>fatima.bensaid@uha.fr</div>
          <div>jean.muller@uha.fr</div>
        </div>
      </div>
    </div>
  );
}

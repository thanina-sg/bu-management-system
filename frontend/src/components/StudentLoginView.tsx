import { useState } from "react";
import { STUDENT_ACCOUNTS, USERS, type User } from "../lib/books";

export function StudentLoginView({ onLogin }: { onLogin: (user: User) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    const account = STUDENT_ACCOUNTS.find((a) => a.email === email.trim() && a.password === password);
    if (!account) { setError("Invalid credentials."); return; }
    const user = USERS.find((u) => u.id === account.userId);
    if (!user) { setError("User not found."); return; }
    setError("");
    onLogin(user);
  };

  return (
    <div className="px-5 py-5">
      <div className="text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-xs font-semibold text-white">
          &#x25C9;
        </div>
        <h3 className="mt-3 font-serif text-lg text-ink-900">Student Portal</h3>
        <p className="mt-1 text-[11px] text-ink-500">Sign in to view your loans and reservations</p>
      </div>

      <div className="mt-5 space-y-3">
        <div>
          <label className="mb-1 block text-[10px] font-medium text-ink-500">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. alice.dupont@uha.fr"
            className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-xs text-ink-900 outline-none focus:border-brand-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-medium text-ink-500">Password</label>
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
          className="w-full rounded-lg bg-brand-700 px-4 py-2.5 text-xs font-semibold text-white shadow-soft hover:bg-brand-600"
        >
          Sign In
        </button>
      </div>

      <div className="mt-4 border-t border-ink-100 pt-3">
        <div className="text-[9px] font-semibold uppercase tracking-wide text-ink-500">Demo accounts (password: stu123)</div>
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

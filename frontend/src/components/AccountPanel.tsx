import { useEffect, useState } from "react";
import { type User } from "../lib/api";
import { auth } from "../lib/api";
import { StudentLoginView } from "./StudentLoginView";
import { StudentDashboard } from "./StudentDashboard";

export function AccountPanel({ onClose }: { onClose: () => void }) {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const user = auth.getStoredUser();
    setLoggedInUser(user);
    setIsCheckingAuth(false);
  }, []);

  const handleLogout = async () => {
    await auth.logout();
    setLoggedInUser(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-ink-900/40" onClick={onClose}>
      <div
        className="mr-4 mt-14 w-full max-w-sm rounded-xl border border-ink-100 bg-white shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        {isCheckingAuth ? (
          <div className="px-5 py-8 text-center">
            <div className="text-[10px] text-ink-500">Checking authentication...</div>
          </div>
        ) : loggedInUser ? (
          <StudentDashboard
            user={loggedInUser}
            onLogout={handleLogout}
          />
        ) : (
          <StudentLoginView onLogin={(user) => setLoggedInUser(user)} />
        )}

        <div className="border-t border-ink-100 px-5 py-3">
          <button onClick={onClose} className="text-xs font-semibold text-ink-500 hover:text-ink-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

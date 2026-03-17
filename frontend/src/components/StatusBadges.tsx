

type LoanStatus = 'ACTIF' | 'RETOURNE' | 'EN_RETARD' | 'Active' | 'Returned' | 'Overdue';
type ReservationStatus = 'EN_ATTENTE' | 'PRETE' | 'ANNULEE' | 'Pending' | 'Ready' | 'Cancelled';
type UserRole = 'ETUDIANT' | 'ENSEIGNANT' | 'BIBLIOTHECAIRE' | 'ADMIN' | 'Student' | 'Teacher' | 'Librarian' | 'Admin';

export function LoanStatusBadge({ status }: { status: LoanStatus }) {
  const displayStatus = status === 'ACTIF' ? 'Active' : status === 'RETOURNE' ? 'Returned' : status === 'EN_RETARD' ? 'Overdue' : status;
  const cls =
    displayStatus === "Active" ? "bg-blue-100 text-blue-700"
      : displayStatus === "Overdue" ? "bg-rose-100 text-rose-700"
        : "bg-emerald-100 text-emerald-700";
  return <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${cls}`}>{displayStatus}</span>;
}

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  const displayStatus = status === 'EN_ATTENTE' ? 'Pending' : status === 'PRETE' ? 'Ready' : status === 'ANNULEE' ? 'Cancelled' : status;
  const cls =
    displayStatus === "Pending" ? "bg-amber-100 text-amber-700"
      : displayStatus === "Ready" ? "bg-emerald-100 text-emerald-700"
        : "bg-ink-100 text-ink-500";
  return <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${cls}`}>{displayStatus}</span>;
}

export function BookStatusBadge({ status }: { status?: string }) {
  const displayStatus = (status === "Available" || status === "Disponible") ? "Available" : (status === "Borrowed") ? "Borrowed" : "Unknown";
  const bgClass = displayStatus === "Available"
    ? "inline-block rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"
    : displayStatus === "Borrowed"
    ? "inline-block rounded bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700"
    : "inline-block rounded bg-ink-100 px-2 py-0.5 text-[10px] font-semibold text-ink-500";
  return (
    <span className={bgClass}>
      {displayStatus}
    </span>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  const displayRole = role === 'ADMIN' ? 'Admin' : role === 'BIBLIOTHECAIRE' ? 'Librarian' : role === 'ENSEIGNANT' ? 'Teacher' : role === 'ETUDIANT' ? 'Student' : role;
  const cls =
    displayRole === "Admin" ? "bg-violet-100 text-violet-700"
      : displayRole === "Librarian" ? "bg-blue-100 text-blue-700"
        : displayRole === "Teacher" ? "bg-amber-100 text-amber-700"
          : "bg-surface-200 text-ink-700";
  return <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${cls}`}>{displayRole}</span>;
}

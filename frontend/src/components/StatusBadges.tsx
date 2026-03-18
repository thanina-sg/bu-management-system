

type LoanStatus = 'ACTIF' | 'RETOURNE' | 'EN_RETARD';
type ReservationStatus = 'EN_ATTENTE' | 'PRETE' | 'ANNULEE';
type UserRole = 'ETUDIANT' | 'ENSEIGNANT' | 'BIBLIOTHECAIRE' | 'ADMINISTRATEUR' | 'Librarian' | 'Admin';

export function LoanStatusBadge({ status }: { status: LoanStatus }) {
  const displayStatus = status === 'ACTIF' ? 'Actif' : status === 'RETOURNE' ? 'Retourne' : 'En retard';
  const cls =
    status === 'ACTIF' ? "bg-blue-100 text-blue-700"
      : status === 'EN_RETARD' ? "bg-rose-100 text-rose-700"
        : "bg-emerald-100 text-emerald-700";
  return <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${cls}`}>{displayStatus}</span>;
}

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  const displayStatus = status === 'EN_ATTENTE' ? 'En attente' : status === 'PRETE' ? 'Prete' : 'Annulee';
  const cls =
    status === 'EN_ATTENTE' ? "bg-amber-100 text-amber-700"
      : status === 'PRETE' ? "bg-emerald-100 text-emerald-700"
        : "bg-ink-100 text-ink-500";
  return <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${cls}`}>{displayStatus}</span>;
}

export function BookStatusBadge({ disponible }: { disponible?: boolean }) {
  const displayStatus = disponible ? 'Disponible' : 'Emprunte';
  const bgClass = disponible
    ? "inline-block rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"
    : "inline-block rounded bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700";
  return (
    <span className={bgClass}>
      {displayStatus}
    </span>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  const displayRole =
    role === 'ADMINISTRATEUR' || role === 'Admin' ? 'Administrateur' :
    role === 'BIBLIOTHECAIRE' || role === 'Librarian' ? 'Bibliothecaire' :
    role === 'ENSEIGNANT' ? 'Enseignant' :
    'Etudiant';
  const cls =
    role === 'ADMINISTRATEUR' || role === 'Admin' ? "bg-violet-100 text-violet-700"
      : role === 'BIBLIOTHECAIRE' || role === 'Librarian' ? "bg-blue-100 text-blue-700"
        : role === 'ENSEIGNANT' ? "bg-amber-100 text-amber-700"
          : "bg-surface-200 text-ink-700";
  return <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${cls}`}>{displayRole}</span>;
}

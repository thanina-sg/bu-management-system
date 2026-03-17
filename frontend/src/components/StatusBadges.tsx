import type { BookStatus, Loan, Reservation, UserRole } from "../lib/books";

export function LoanStatusBadge({ status }: { status: Loan["status"] }) {
  const cls =
    status === "Active" ? "bg-blue-100 text-blue-700"
      : status === "Overdue" ? "bg-rose-100 text-rose-700"
        : "bg-emerald-100 text-emerald-700";
  return <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${cls}`}>{status}</span>;
}

export function ReservationStatusBadge({ status }: { status: Reservation["status"] }) {
  const cls =
    status === "Pending" ? "bg-amber-100 text-amber-700"
      : status === "Ready" ? "bg-emerald-100 text-emerald-700"
        : "bg-ink-100 text-ink-500";
  return <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${cls}`}>{status}</span>;
}

export function BookStatusBadge({ status }: { status: BookStatus }) {
  return (
    <span className={status === "Available"
      ? "inline-block rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"
      : "inline-block rounded bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700"}>
      {status}
    </span>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  const cls =
    role === "Admin" ? "bg-violet-100 text-violet-700"
      : role === "Librarian" ? "bg-blue-100 text-blue-700"
        : role === "Teacher" ? "bg-amber-100 text-amber-700"
          : "bg-surface-200 text-ink-700";
  return <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${cls}`}>{role}</span>;
}

import { BOOKS, LOANS, RESERVATIONS, USERS } from "../../lib/books";
import type { LoggedInRole } from "./types";

export function DashboardCards({ role }: { role: LoggedInRole }) {
  const totalBooks = BOOKS.length;
  const availableBooks = BOOKS.filter((b) => b.status === "Available").length;
  const borrowedBooks = BOOKS.filter((b) => b.status === "Borrowed").length;
  const activeLoans = LOANS.filter((l) => l.status === "Active").length;
  const overdueLoans = LOANS.filter((l) => l.status === "Overdue").length;
  const pendingReservations = RESERVATIONS.filter((r) => r.status === "Pending").length;
  const totalUsers = USERS.length;

  const cards: { label: string; value: number; accent: string; sub?: string; adminOnly?: boolean }[] = [
    { label: "Total Books", value: totalBooks, accent: "text-brand-700", sub: `${availableBooks} available` },
    { label: "Borrowed", value: borrowedBooks, accent: "text-rose-600" },
    { label: "Active Loans", value: activeLoans, accent: "text-blue-600" },
    { label: "Overdue", value: overdueLoans, accent: "text-amber-600" },
    { label: "Reservations", value: pendingReservations, accent: "text-violet-600", sub: "pending" },
    { label: "Users", value: totalUsers, accent: "text-ink-700", adminOnly: true },
  ];

  const visible = cards.filter((c) => !c.adminOnly || role === "Admin");

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {visible.map((c) => (
        <div key={c.label} className="rounded-xl border border-ink-100 bg-white p-4 shadow-soft">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-500">{c.label}</div>
          <div className={`mt-1 font-serif text-3xl font-bold ${c.accent}`}>{c.value}</div>
          {c.sub && <div className="mt-0.5 text-[10px] text-ink-500">{c.sub}</div>}
        </div>
      ))}
    </div>
  );
}

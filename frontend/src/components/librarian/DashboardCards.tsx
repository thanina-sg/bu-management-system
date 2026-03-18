import type { LoggedInRole } from "./types";

export function DashboardCards({ role, books, loans, reservations, users }: { role: LoggedInRole; books?: any[]; loans?: any[]; reservations?: any[]; users?: any[] }) {
  const booksData = books || [];
  const loansData = loans || [];
  const reservationsData = reservations || [];
  const usersData = users || [];

  const totalBooks = booksData.length;
  const availableBooks = booksData.filter((b: any) => b.disponible === true).length;
  const borrowedBooks = booksData.filter((b: any) => b.disponible === false).length;
  const activeLoans = loansData.filter((l: any) => l.statut === "ACTIF").length;
  const overdueLoans = loansData.filter((l: any) => l.statut === "EN_RETARD").length;
  const pendingReservations = reservationsData.filter((r: any) => r.statut === "EN_ATTENTE").length;
  const totalUsers = usersData.length;

  const cards: { label: string; value: number; accent: string; sub?: string; adminOnly?: boolean }[] = [
    { label: "Total livres", value: totalBooks, accent: "text-brand-700", sub: `${availableBooks} disponibles` },
    { label: "Empruntes", value: borrowedBooks, accent: "text-rose-600" },
    { label: "Emprunts actifs", value: activeLoans, accent: "text-blue-600" },
    { label: "En retard", value: overdueLoans, accent: "text-amber-600" },
    { label: "Reservations", value: pendingReservations, accent: "text-violet-600", sub: "en attente" },
    { label: "Utilisateurs", value: totalUsers, accent: "text-ink-700", adminOnly: true },
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

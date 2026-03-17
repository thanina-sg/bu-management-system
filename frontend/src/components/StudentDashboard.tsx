import { useState } from "react";
import { Link } from "react-router-dom";
import { BOOKS, LOANS, RESERVATIONS, type Reservation, type User } from "../lib/books";
import { LoanStatusBadge, ReservationStatusBadge } from "./StatusBadges";

type StudentTab = "loans" | "reservations";

export function StudentDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [tab, setTab] = useState<StudentTab>("loans");
  const [reservations, setReservations] = useState<Reservation[]>(RESERVATIONS);
  const [toast, setToast] = useState<string | null>(null);

  const userLoans = LOANS.filter((l) => l.studentId === user.id);
  const userReservations = reservations.filter((r) => r.studentId === user.id && r.status !== "Cancelled");

  const activeLoans = userLoans.filter((l) => l.status === "Active" || l.status === "Overdue").length;
  const returnedLoans = userLoans.filter((l) => l.status === "Returned").length;

  const initials = user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const cancelReservation = (id: string) => {
    setReservations((prev) => prev.map((r) => r.id === id ? { ...r, status: "Cancelled" as const } : r));
    showToast("Reservation cancelled.");
  };

  return (
    <>
      {/* Header */}
      <div className="border-b border-ink-100 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-xs font-semibold text-white">
              {initials}
            </div>
            <div>
              <div className="text-sm font-semibold text-ink-900">{user.name}</div>
              <div className="text-[11px] text-ink-500">{user.role} &middot; {user.id}</div>
            </div>
          </div>
          <button onClick={onLogout} className="text-[10px] font-semibold text-ink-500 hover:text-ink-700">
            Sign Out
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2 px-5 pt-4">
        <div className="rounded-lg border border-ink-100 bg-surface-50 p-2.5 text-center">
          <div className="text-[9px] font-semibold uppercase tracking-wide text-ink-500">Active</div>
          <div className="mt-0.5 font-serif text-xl font-bold text-blue-600">{activeLoans}</div>
        </div>
        <div className="rounded-lg border border-ink-100 bg-surface-50 p-2.5 text-center">
          <div className="text-[9px] font-semibold uppercase tracking-wide text-ink-500">Returned</div>
          <div className="mt-0.5 font-serif text-xl font-bold text-emerald-600">{returnedLoans}</div>
        </div>
        <div className="rounded-lg border border-ink-100 bg-surface-50 p-2.5 text-center">
          <div className="text-[9px] font-semibold uppercase tracking-wide text-ink-500">Reserved</div>
          <div className="mt-0.5 font-serif text-xl font-bold text-amber-600">{userReservations.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-5 mt-4 flex rounded-lg border border-ink-100 bg-surface-50 p-0.5">
        <button
          onClick={() => setTab("loans")}
          className={tab === "loans"
            ? "flex-1 rounded-md bg-brand-700 px-3 py-1.5 text-[10px] font-semibold text-white"
            : "flex-1 rounded-md px-3 py-1.5 text-[10px] font-semibold text-ink-500 hover:text-ink-700"}
        >
          Loan History ({userLoans.length})
        </button>
        <button
          onClick={() => setTab("reservations")}
          className={tab === "reservations"
            ? "flex-1 rounded-md bg-brand-700 px-3 py-1.5 text-[10px] font-semibold text-white"
            : "flex-1 rounded-md px-3 py-1.5 text-[10px] font-semibold text-ink-500 hover:text-ink-700"}
        >
          Reservations ({userReservations.length})
        </button>
      </div>

      {toast && (
        <div className="mx-5 mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700">
          &#x2713; {toast}
        </div>
      )}

      {/* Content */}
      <div className="max-h-[360px] overflow-y-auto px-5 py-4">
        {tab === "loans" && (
          <>
            {userLoans.length === 0 ? (
              <div className="py-6 text-center">
                <div className="text-2xl text-ink-200">&#x1F4DA;</div>
                <p className="mt-2 text-xs text-ink-500">No loan history yet.</p>
                <Link to="/" className="mt-2 inline-block text-[10px] font-semibold text-brand-700 hover:text-brand-600">
                  Browse the catalog
                </Link>
              </div>
            ) : (
              <ul className="space-y-2">
                {userLoans.map((l) => {
                  const book = BOOKS.find((b) => b.isbn === l.isbn);
                  return (
                    <li key={l.id} className="rounded-lg border border-ink-100 bg-surface-50 p-3">
                      <div className="flex items-start gap-3">
                        {book?.coverUrl
                          ? <img src={book.coverUrl} alt="" className="h-14 w-10 shrink-0 rounded border border-ink-100 object-cover" />
                          : <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded border border-ink-100 bg-surface-100 text-[7px] text-ink-500">N/A</div>}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="truncate text-xs font-semibold text-ink-900">{l.bookTitle}</div>
                              <div className="text-[10px] text-ink-500">ISBN: {l.isbn}</div>
                            </div>
                            <LoanStatusBadge status={l.status} />
                          </div>
                          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-[10px] text-ink-500">
                            <span>Loaned: {l.loanDate}</span>
                            <span>Due: {l.returnDateExpected}</span>
                          </div>
                          {l.returnDateActual && (
                            <div className="mt-0.5 text-[10px] text-emerald-600">Returned: {l.returnDateActual}</div>
                          )}
                          {l.status === "Overdue" && (
                            <div className="mt-0.5 text-[10px] font-semibold text-rose-600">
                              Overdue by {Math.ceil((new Date("2026-03-17").getTime() - new Date(l.returnDateExpected).getTime()) / (1000 * 60 * 60 * 24))} day(s)
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}

        {tab === "reservations" && (
          <>
            {userReservations.length === 0 ? (
              <div className="py-6 text-center">
                <div className="text-2xl text-ink-200">&#x1F4CB;</div>
                <p className="mt-2 text-xs text-ink-500">No active reservations.</p>
                <Link to="/" className="mt-2 inline-block text-[10px] font-semibold text-brand-700 hover:text-brand-600">
                  Browse the catalog
                </Link>
              </div>
            ) : (
              <ul className="space-y-2">
                {userReservations.map((r) => {
                  const book = BOOKS.find((b) => b.isbn === r.isbn);
                  return (
                    <li key={r.id} className="rounded-lg border border-ink-100 bg-surface-50 p-3">
                      <div className="flex items-start gap-3">
                        {book?.coverUrl
                          ? <img src={book.coverUrl} alt="" className="h-14 w-10 shrink-0 rounded border border-ink-100 object-cover" />
                          : <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded border border-ink-100 bg-surface-100 text-[7px] text-ink-500">N/A</div>}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="truncate text-xs font-semibold text-ink-900">{r.bookTitle}</div>
                              <div className="text-[10px] text-ink-500">ISBN: {r.isbn}</div>
                            </div>
                            <ReservationStatusBadge status={r.status} />
                          </div>
                          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-[10px] text-ink-500">
                            <span>Reserved: {r.date}</span>
                            <span>Queue: #{r.queuePosition}</span>
                          </div>
                          {r.status === "Ready" && (
                            <div className="mt-1 text-[10px] font-semibold text-emerald-600">
                              Ready for pickup at the library
                            </div>
                          )}
                          {r.status === "Pending" && (
                            <button
                              onClick={() => cancelReservation(r.id)}
                              className="mt-2 rounded border border-rose-200 px-3 py-1 text-[10px] font-semibold text-rose-600 hover:bg-rose-50"
                            >
                              Cancel Reservation
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { type User, type Loan, type Reservation, type Book } from "../lib/api";
import { loans as loansAPI, reservations as reservationsAPI, books as booksAPI } from "../lib/api";
import { LoanStatusBadge, ReservationStatusBadge } from "./StatusBadges";

type StudentTab = "loans" | "reservations";

export function StudentDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [tab, setTab] = useState<StudentTab>("loans");
  const [userLoans, setUserLoans] = useState<Loan[]>([]);
  const [userReservations, setUserReservations] = useState<Reservation[]>([]);
  const [books, setBooks] = useState<Map<string, Book>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Fetch all data when component mounts or user changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch loans, reservations, and catalog
        const [loansData, reservationsData, booksData] = await Promise.all([
          loansAPI.getAll({ id_utilisateur: user.id }),
          reservationsAPI.getAll({ id_utilisateur: user.id }),
          booksAPI.getAll(),
        ]);

        setUserLoans(loansData);
        
        // Filter reservations to exclude cancelled ones
        const activeReservations = reservationsData.filter(r => r.statut !== 'ANNULEE');
        setUserReservations(activeReservations);

        // Create a map of ISBN -> Book for quick lookup
        const booksMap = new Map<string, Book>();
        booksData.forEach(book => {
          booksMap.set(book.isbn || '', book);
        });
        setBooks(booksMap);
      } catch (err) {
        setError("Impossible de charger votre espace. Veuillez reessayer.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  const activeLoans = userLoans.filter((l) => l.statut === "ACTIF" || l.statut === "EN_RETARD").length;
  const returnedLoans = userLoans.filter((l) => l.statut === "RETOURNE").length;

  const initials = `${user.prenom || ''} ${user.nom || ''}`.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const cancelReservation = async (id: string) => {
    try {
      await reservationsAPI.update(id, 'ANNULEE');
      setUserReservations((prev) => prev.filter((r) => r.id !== id));
      showToast("Reservation annulee.");
    } catch (err) {
      showToast("Echec de l'annulation de la reservation.");
      console.error(err);
    }

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
              <div className="text-sm font-semibold text-ink-900">{`${user.prenom || ''} ${user.nom || ''}`.trim()}</div>
              <div className="text-[11px] text-ink-500">{user.role} &middot; {user.id}</div>
            </div>
          </div>
          <button onClick={onLogout} className="text-[10px] font-semibold text-ink-500 hover:text-ink-700">
            Se deconnecter
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2 px-5 pt-4">
        <div className="rounded-lg border border-ink-100 bg-surface-50 p-2.5 text-center">
          <div className="text-[9px] font-semibold uppercase tracking-wide text-ink-500">Actifs</div>
          <div className="mt-0.5 font-serif text-xl font-bold text-blue-600">{activeLoans}</div>
        </div>
        <div className="rounded-lg border border-ink-100 bg-surface-50 p-2.5 text-center">
          <div className="text-[9px] font-semibold uppercase tracking-wide text-ink-500">Retournes</div>
          <div className="mt-0.5 font-serif text-xl font-bold text-emerald-600">{returnedLoans}</div>
        </div>
        <div className="rounded-lg border border-ink-100 bg-surface-50 p-2.5 text-center">
          <div className="text-[9px] font-semibold uppercase tracking-wide text-ink-500">Reserves</div>
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
          Historique des emprunts ({userLoans.length})
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
        {isLoading && (
            <div className="py-6 text-center">
            <div className="text-[10px] text-ink-500">Chargement de votre espace...</div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-[10px] text-rose-700">
            {error}
          </div>
        )}

        {!isLoading && !error && tab === "loans" && (
          <>
            {userLoans.length === 0 ? (
              <div className="py-6 text-center">
                <div className="text-2xl text-ink-200">&#x1F4DA;</div>
                <p className="mt-2 text-xs text-ink-500">Aucun emprunt pour le moment.</p>
                <Link to="/" className="mt-2 inline-block text-[10px] font-semibold text-brand-700 hover:text-brand-600">
                  Parcourir le catalogue
                </Link>
              </div>
            ) : (
              <ul className="space-y-2">
                {userLoans.map((l) => {
                  const book = books.get(l.isbn);
                  return (
                    <li key={l.id} className="rounded-lg border border-ink-100 bg-surface-50 p-3">
                      <div className="flex items-start gap-3">
                         {book?.couverture_url
                            ? <img src={book.couverture_url} alt="" className="h-14 w-10 shrink-0 rounded border border-ink-100 object-cover" />
                            : <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded border border-ink-100 bg-surface-100 text-[7px] text-ink-500">N/D</div>}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                               <div className="truncate text-xs font-semibold text-ink-900">{l.titre_livre}</div>
                              <div className="text-[10px] text-ink-500">ISBN: {l.isbn}</div>
                            </div>
                            <LoanStatusBadge status={l.statut as any} />
                          </div>
                          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-[10px] text-ink-500">
                             <span>Emprunte le: {l.date_emprunt}</span>
                             <span>Retour prevu: {l.date_retour_prevue}</span>
                           </div>
                            {l.date_retour_reelle && (
                             <div className="mt-0.5 text-[10px] text-emerald-600">Retourne le: {l.date_retour_reelle}</div>
                            )}
                          {l.statut === "EN_RETARD" && (
                            <div className="mt-0.5 text-[10px] font-semibold text-rose-600">
                              En retard de {Math.ceil((new Date("2026-03-17").getTime() - new Date(l.date_retour_prevue).getTime()) / (1000 * 60 * 60 * 24))} jour(s)
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

        {!isLoading && !error && tab === "reservations" && (
          <>
            {userReservations.length === 0 ? (
              <div className="py-6 text-center">
                <div className="text-2xl text-ink-200">&#x1F4CB;</div>
                <p className="mt-2 text-xs text-ink-500">Aucune reservation active.</p>
                <Link to="/" className="mt-2 inline-block text-[10px] font-semibold text-brand-700 hover:text-brand-600">
                  Parcourir le catalogue
                </Link>
              </div>
            ) : (
              <ul className="space-y-2">
                {userReservations.map((r) => {
                  const book = books.get(r.isbn);
                  return (
                    <li key={r.id} className="rounded-lg border border-ink-100 bg-surface-50 p-3">
                      <div className="flex items-start gap-3">
                         {book?.couverture_url
                            ? <img src={book.couverture_url} alt="" className="h-14 w-10 shrink-0 rounded border border-ink-100 object-cover" />
                            : <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded border border-ink-100 bg-surface-100 text-[7px] text-ink-500">N/D</div>}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                               <div className="truncate text-xs font-semibold text-ink-900">{r.titre_livre}</div>
                              <div className="text-[10px] text-ink-500">ISBN: {r.isbn}</div>
                            </div>
                            <ReservationStatusBadge status={r.statut as any} />
                          </div>
                          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-[10px] text-ink-500">
                            <span>Reserve le: {r.date_reservation}</span>
                            <span>File: #{r.position_file}</span>
                          </div>
                          {r.statut === "PRETE" && (
                            <div className="mt-1 text-[10px] font-semibold text-emerald-600">
                              Pret a retirer a la bibliotheque
                            </div>
                          )}
                          {r.statut === "EN_ATTENTE" && (
                            <button
                              onClick={() => cancelReservation(r.id)}
                              className="mt-2 rounded border border-rose-200 px-3 py-1 text-[10px] font-semibold text-rose-600 hover:bg-rose-50"
                            >
                              Annuler la reservation
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

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { books as booksAPI, type Book } from "../lib/api";
import { ReservationModal } from "../components/ReservationModal";

export function DetailsPage() {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [recommended, setRecommended] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReservation, setShowReservation] = useState(false);

  // Fetch book details on mount
  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const bookData = await booksAPI.getById(id);
        setBook(bookData);

        // Fetch recommendations
        const recommendedData = await booksAPI.getRecommendations(id);
        setRecommended(recommendedData.slice(0, 3));
      } catch (err) {
        setError("Impossible de charger les details du livre. Veuillez reessayer.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-ink-500 hover:text-ink-700"
        >
          ← Retour au catalogue
        </Link>
      </div>

      {isLoading && (
        <div className="mt-6 text-center">
          <div className="text-[10px] text-ink-500">Chargement des details du livre...</div>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {!isLoading && !error && !book && (
        <div className="mx-auto mt-6 max-w-4xl">
          <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-soft">
            <div className="text-lg font-semibold text-ink-900">Introuvable</div>
            <div className="mt-2 text-sm text-ink-500">Cette ressource n&apos;existe pas.</div>
          </div>
        </div>
      )}

      {!isLoading && !error && book && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[236px_1fr]">
            <div>
              <div className="rounded-lg border border-ink-100 bg-white p-3 shadow-soft">
                {book.couverture_url ? (
                  <img src={book.couverture_url} alt={book.titre} className="h-[438px] w-full rounded object-cover" />
                ) : (
                  <div className="flex h-[438px] items-center justify-center rounded bg-gradient-to-br from-brand-50 to-surface-100">
                    <span className="text-9xl">📚</span>
                  </div>
                )}
              </div>

              <div className="mt-3 rounded-lg border border-ink-100 bg-white p-4 shadow-soft">
                <div
                  className={
                    book.disponible
                      ? "text-sm font-semibold text-emerald-600"
                      : "text-sm font-semibold text-amber-600"
                  }
                >
                  {book.disponible ? 'Disponible' : 'Emprunte'}
                </div>
                {!book.disponible ? (
                  <button
                    type="button"
                    onClick={() => setShowReservation(true)}
                    className="mt-4 w-full rounded bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-amber-500"
                  >
                    Reserver la ressource
                  </button>
                ) : (
                <button
                  type="button"
                  className="mt-4 w-full rounded bg-brand-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-600"
                >
                  Emprunter la ressource
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-brand-700">
                 {book.categorie}
               </div>
              <h1 className="mt-2 font-serif text-4xl leading-[1.05] tracking-tight text-ink-900 md:text-6xl">
                 {book.titre}
               </h1>
               <div className="mt-3 text-base text-ink-500">◌ {book.auteur}</div>

              <div className="mt-5 border-t border-ink-100" />

              <h3 className="mt-8 font-serif text-3xl text-ink-900">A propos de cette ressource</h3>
               <p className="mt-2 max-w-4xl text-base leading-7 text-ink-600">{book.resume}</p>

              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded border border-ink-100 bg-white p-3">
                  <div className="text-[10px] text-ink-500"># ISBN</div>
                  <div className="mt-1 text-xs font-semibold text-ink-800">{book.isbn}</div>
                </div>
                <div className="rounded border border-ink-100 bg-white p-3">
                  <div className="text-[10px] text-ink-500">◷ Annee de publication</div>
                   <div className="mt-1 text-xs font-semibold text-ink-800">{book.annee}</div>
                </div>
              </div>

              <div className="mt-8 border-t border-ink-100" />

              <h3 className="mt-7 font-serif text-3xl text-ink-900">Ressources recommandees</h3>
              <p className="mt-1 text-xs text-ink-500">
                Les usagers ayant emprunte ce livre ont aussi consulte ces ressources
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {recommended.length > 0 ? (
                  recommended.map((r) => (
                    <Link key={r.id} to={`/book/${r.id}`} className="min-w-0">
                       {r.couverture_url ? (
                         <img
                           src={r.couverture_url}
                           alt={r.titre}
                           className="h-48 w-full rounded border border-ink-100 object-cover"
                         />
                      ) : (
                        <div className="flex h-48 items-center justify-center rounded border border-ink-100 bg-gradient-to-br from-brand-50 to-surface-100">
                          <span className="text-4xl">📚</span>
                        </div>
                      )}
                       <div className="mt-2 line-clamp-1 text-sm font-semibold text-ink-900">{r.titre}</div>
                       <div className="line-clamp-1 text-[11px] text-ink-500">{r.auteur}</div>
                     </Link>
                  ))
                ) : (
                  <div className="col-span-3 py-6 text-center">
                    <p className="text-[10px] text-ink-500">Aucune recommandation disponible</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {showReservation && (
              <ReservationModal
               bookTitle={book.titre || ''}
               isbn={book.isbn}
               onClose={() => setShowReservation(false)}
             />
          )}
        </>
      )}
    </div>
  );
}

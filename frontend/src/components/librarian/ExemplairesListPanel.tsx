import { useEffect, useState, useMemo } from "react";
import { books as booksAPI, type Book } from "../../lib/api";

interface Copy {
  id_exemplaire: string;
  isbn: string;
  etat: string;
  localisation: string;
  disponibilite: boolean;
}

export function ExemplairesListPanel() {
  const [books, setBooks] = useState<Book[]>([]);
  const [allCopies, setAllCopies] = useState<Copy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all books and copies
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load all books
        const booksData = await booksAPI.getAll();
        console.log("[EXEMPLAIRES] Books loaded:", booksData.length);
        setBooks(booksData);

        // Load ALL copies at once (same approach as books - no auth needed)
        try {
          const response = await fetch('/api/books/copies');
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const allCopiesData: Copy[] = await response.json();
          console.log("[EXEMPLAIRES] Total copies loaded:", allCopiesData.length);
          setAllCopies(allCopiesData);
        } catch (err) {
          console.warn("[EXEMPLAIRES] Failed to load copies:", err);
          setAllCopies([]);
        }
      } catch (err) {
        setError("Impossible de charger les livres.");
        console.error("[EXEMPLAIRES] ERROR:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group copies by ISBN
  const groupedByBook = useMemo(() => {
    const groups = new Map<string, { book: Book; copies: Copy[] }>();

    books.forEach((book) => {
      groups.set(book.isbn, {
        book,
        copies: allCopies.filter((copy) => copy.isbn === book.isbn),
      });
    });

    return Array.from(groups.values());
  }, [books, allCopies]);

  const totalCopies = allCopies.length;
  const availableCopies = allCopies.filter((c) => c.disponibilite).length;

  if (isLoading) {
    return (
      <div className="w-full rounded-xl border border-ink-100 bg-white p-8 shadow-soft text-center">
        <p className="text-sm text-ink-500">Chargement des exemplaires...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="rounded-xl border border-ink-100 bg-white shadow-soft">
        <div className="border-b border-ink-100 px-5 py-4">
          <h2 className="font-serif text-2xl text-ink-900">Exemplaires par livre</h2>
          <p className="mt-1 text-xs text-ink-500">{availableCopies} disponible(s) sur {totalCopies}</p>
        </div>

        <div className="space-y-4 p-5">
          {groupedByBook.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-500">Aucun exemplaire trouvé.</p>
          ) : (
            groupedByBook.map(({ book, copies }) => (
              <div key={book.isbn} className="rounded-lg border border-ink-100 bg-surface-50">
                <div className="border-b border-ink-100 px-4 py-3 bg-white rounded-t-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-ink-900 truncate">{book.titre}</h3>
                      <p className="text-xs text-ink-500 mt-0.5">{book.auteur} • ISBN: {book.isbn}</p>
                    </div>
                    <span className="whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-semibold bg-brand-100 text-brand-700">
                      {copies.length} exemplaire{copies.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {copies.length === 0 ? (
                  <div className="px-4 py-3 text-center text-xs text-ink-500">
                    Aucun exemplaire disponible
                  </div>
                ) : (
                  <>
                    <div className="hidden md:block">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-ink-100 text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">État</th>
                            <th className="px-4 py-2">Localisation</th>
                            <th className="px-4 py-2">Disponibilité</th>
                          </tr>
                        </thead>
                        <tbody>
                          {copies.map((copy) => (
                            <tr key={copy.id_exemplaire} className="border-b border-ink-100 last:border-b-0">
                              <td className="px-4 py-2">
                                <code className="text-[9px] text-ink-600">{copy.id_exemplaire.substring(0, 8)}...</code>
                              </td>
                              <td className="px-4 py-2">
                                <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-semibold ${
                                  copy.etat === 'BON' ? 'bg-emerald-100 text-emerald-700' :
                                  copy.etat === 'ABIME' || copy.etat === 'ABIMÉ' ? 'bg-amber-100 text-amber-700' :
                                  'bg-ink-100 text-ink-700'
                                }`}>
                                  {copy.etat}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-ink-600">{copy.localisation || '-'}</td>
                              <td className="px-4 py-2">
                                <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-semibold ${
                                  copy.disponibilite ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                }`}>
                                  {copy.disponibilite ? 'Libre' : 'Prêté'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="md:hidden space-y-2 p-3">
                      {copies.map((copy) => (
                        <div key={copy.id_exemplaire} className="rounded border border-ink-100 bg-white p-2">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <code className="text-[8px] text-ink-500">{copy.id_exemplaire.substring(0, 12)}</code>
                            <span className={`rounded px-2 py-0.5 text-[9px] font-semibold ${
                              copy.disponibilite ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}>
                              {copy.disponibilite ? 'Libre' : 'Prêté'}
                            </span>
                          </div>
                          <div className="flex gap-2 text-[9px]">
                            <span className={`rounded px-1.5 py-0.5 font-semibold ${
                              copy.etat === 'BON' ? 'bg-emerald-100 text-emerald-700' :
                              copy.etat === 'ABIME' || copy.etat === 'ABIMÉ' ? 'bg-amber-100 text-amber-700' :
                              'bg-ink-100 text-ink-700'
                            }`}>
                              {copy.etat}
                            </span>
                            <span className="text-ink-500">{copy.localisation || '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

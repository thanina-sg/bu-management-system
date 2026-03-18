import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { books as booksAPI, type Book } from "../lib/api";
import { applyFilters, type Filters } from "../lib/filter";

const STATUSES = ["Tous", "Disponible", "Emprunte"];

export function HomePage() {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<Filters>({
    q: "",
    category: "Toutes categories",
    status: "Tous",
  });

  // Fetch books on mount
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await booksAPI.getAll();
        setAllBooks(data);
      } catch (err) {
        setError("Impossible de charger les livres. Veuillez reessayer.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Compute unique categories from books
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add("Toutes categories");
    allBooks.forEach((book) => {
      const cat = book.categorie;
      if (cat) cats.add(cat);
    });
    return Array.from(cats).sort();
  }, [allBooks]);

  const filtered = useMemo(() => applyFilters(allBooks, filters), [allBooks, filters]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-serif text-5xl tracking-tight text-ink-900">Catalogue des ressources academiques</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-ink-500">
          Recherchez des milliers de livres, journaux et ressources académiques dans les collections numeriques et physiques de l&apos;universite.
        </p>

        <div className="mt-6">
          <input
            value={filters.q}
            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
            placeholder="Rechercher par titre, auteur ou ISBN..."
            className="w-full rounded-lg border border-ink-100 bg-white px-4 py-3 text-sm text-ink-900 shadow-soft outline-none placeholder:text-ink-200 focus:border-brand-500"
          />
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-ink-100 bg-white p-3 shadow-soft">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs font-semibold text-ink-500">▽ Affiner les resultats</div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, category: e.target.value as Filters["category"] }))
                }
                className="w-full rounded-md border border-ink-100 bg-white px-3 py-2 text-xs text-ink-900 outline-none focus:border-brand-500 sm:w-44"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, status: e.target.value as Filters["status"] }))
                }
                className="w-full rounded-md border border-ink-100 bg-white px-3 py-2 text-xs text-ink-900 outline-none focus:border-brand-500 sm:w-40"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-6">
        {isLoading && (
          <div className="py-12 text-center">
            <div className="text-[10px] text-ink-500">Chargement des livres...</div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="mb-4 text-xs text-ink-500">
               <span className="font-semibold text-ink-700">{filtered.length}</span> resultat(s)
             </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((b) => (
                <article key={b.id} className="flex flex-col rounded-lg border border-ink-100 bg-white p-3 shadow-soft h-[420px]">
                  <div className="relative flex-shrink-0">
                    <div
                      className={
                        b.disponible
                          ? "absolute right-1 top-1 rounded bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700 z-10"
                          : "absolute right-1 top-1 rounded bg-rose-100 px-2 py-1 text-[10px] font-semibold text-rose-700 z-10"
                      }
                    >
                      {b.disponible ? 'Disponible' : 'Emprunte'}
                    </div>

                    {b.couverture_url ? (
                      <img
                        src={b.couverture_url}
                        alt={b.titre}
                        className="h-56 w-full rounded border border-ink-100 object-cover"
                      />
                    ) : (
                      <div className="flex h-56 items-center justify-center rounded border border-ink-100 bg-gradient-to-br from-brand-50 to-surface-100">
                        <span className="text-5xl">📚</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 mt-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                      {b.categorie}
                    </div>
                    <h3 className="mt-1 line-clamp-2 font-serif text-lg leading-tight text-ink-900">{b.titre}</h3>
                    <p className="mt-1 text-xs text-ink-500 line-clamp-1">{b.auteur}</p>

                    <div className="mt-auto pt-3">
                      <Link
                        to={`/book/${b.id}`}
                        className="inline-flex w-full items-center justify-center rounded bg-brand-700 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600"
                      >
                        Voir details
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <div className="text-2xl text-ink-200">&#x1F50D;</div>
                 <p className="mt-2 text-sm text-ink-500">Aucun livre ne correspond a votre recherche.</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

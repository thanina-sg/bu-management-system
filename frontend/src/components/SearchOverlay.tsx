import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { books as booksAPI, type Book } from "../lib/api";

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const nav = useNavigate();

  // Fetch all books on mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await booksAPI.getAll();
        setAllBooks(data);
      } catch (err) {
        console.error("Failed to load books for search", err);
      }
    };
    fetchBooks();
  }, []);

  const q = query.trim().toLowerCase();
  const results =
    q.length > 0
      ? allBooks.filter(
          (b) =>
            (b.title || b.titre || "").toLowerCase().includes(q) ||
            (b.author || b.auteur || "").toLowerCase().includes(q) ||
            (b.isbn || "").toLowerCase().includes(q)
        )
      : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink-900/40 pt-20" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl border border-ink-100 bg-white shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-ink-100 px-4 py-3">
          <span className="text-ink-500">&#x2315;</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books by title, author, or ISBN..."
            className="flex-1 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-200"
          />
          <button onClick={onClose} className="text-xs text-ink-500 hover:text-ink-700">ESC</button>
        </div>

        {results.length > 0 && (
          <ul className="max-h-72 overflow-y-auto p-2">
            {results.map((b) => (
              <li key={b.id}>
                <button
                  onClick={() => { nav(`/book/${b.id}`); onClose(); }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-surface-50"
                >
                  {b.coverUrl
                    ? <img src={b.coverUrl} alt="" className="h-10 w-7 rounded border border-ink-100 object-cover" />
                    : <div className="flex h-10 w-7 items-center justify-center rounded border border-ink-100 bg-surface-100 text-[8px] text-ink-500">N/A</div>}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-ink-900">{b.title || b.titre}</div>
                    <div className="text-[11px] text-ink-500">{b.author || b.auteur}</div>
                  </div>
                  <span className={(b.status || "Available") === "Available"
                    ? "rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"
                    : "rounded bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700"}>
                    {b.status || b.disponible === false ? "Borrowed" : "Available"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {q.length > 0 && results.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-ink-500">No results found.</div>
        )}
      </div>
    </div>
  );
}

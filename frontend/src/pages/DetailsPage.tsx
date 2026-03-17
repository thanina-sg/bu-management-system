import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BOOKS } from "../lib/books";
import { ReservationModal } from "../components/ReservationModal";

export function DetailsPage() {
  const { id } = useParams();
  const book = BOOKS.find((b) => b.id === id);
  const [showReservation, setShowReservation] = useState(false);

  if (!book) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-soft">
          <div className="text-lg font-semibold text-ink-900">Not found</div>
          <div className="mt-2 text-sm text-ink-500">This resource doesn&apos;t exist.</div>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-lg border border-ink-100 bg-white px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-surface-100"
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const recommended = BOOKS.filter((b) => b.id !== book.id && b.category === book.category).slice(0, 3);
  const fallbackRecommended =
    recommended.length < 3
      ? [...recommended, ...BOOKS.filter((b) => b.id !== book.id && !recommended.includes(b))].slice(0, 3)
      : recommended;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-ink-500 hover:text-ink-700"
        >
          ← Back to Catalog
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[236px_1fr]">
        <div>
          <div className="rounded-lg border border-ink-100 bg-white p-3 shadow-soft">
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} className="h-[438px] w-full rounded object-cover" />
            ) : (
              <div className="flex h-[438px] items-center justify-center rounded bg-surface-100 text-sm text-ink-500">
                No Cover
              </div>
            )}
          </div>

          <div className="mt-3 rounded-lg border border-ink-100 bg-white p-4 shadow-soft">
            <div
              className={
                book.status === "Available"
                  ? "text-sm font-semibold text-emerald-600"
                  : "text-sm font-semibold text-amber-600"
              }
            >
              {book.status}
            </div>
            <div className="mt-0.5 text-[11px] text-ink-500">Located in {book.location}</div>
            {book.status === "Borrowed" ? (
              <button
                type="button"
                onClick={() => setShowReservation(true)}
                className="mt-4 w-full rounded bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-amber-500"
              >
                Reserve Resource
              </button>
            ) : (
              <button
                type="button"
                className="mt-4 w-full rounded bg-brand-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-600"
              >
                Reserve Resource
              </button>
            )}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-brand-700">
            {book.category}
          </div>
          <h1 className="mt-2 font-serif text-4xl leading-[1.05] tracking-tight text-ink-900 md:text-6xl">
            {book.title}
          </h1>
          <div className="mt-3 text-base text-ink-500">◌ {book.author}</div>

          <div className="mt-5 border-t border-ink-100" />

          <h3 className="mt-8 font-serif text-3xl text-ink-900">About this resource</h3>
          <p className="mt-2 max-w-4xl text-base leading-7 text-ink-600">{book.description}</p>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded border border-ink-100 bg-white p-3">
              <div className="text-[10px] text-ink-500"># ISBN</div>
              <div className="mt-1 text-xs font-semibold text-ink-800">{book.isbn}</div>
            </div>
            <div className="rounded border border-ink-100 bg-white p-3">
              <div className="text-[10px] text-ink-500">◷ Publication Year</div>
              <div className="mt-1 text-xs font-semibold text-ink-800">{book.year}</div>
            </div>
          </div>

          <div className="mt-8 border-t border-ink-100" />

          <h3 className="mt-7 font-serif text-3xl text-ink-900">Recommended Resources</h3>
          <p className="mt-1 text-xs text-ink-500">
            Users who borrowed this book also borrowed these resources
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {fallbackRecommended.map((r) => (
              <Link key={r.id} to={`/book/${r.id}`} className="min-w-0">
                {r.coverUrl ? (
                  <img
                    src={r.coverUrl}
                    alt={r.title}
                    className="h-48 w-full rounded border border-ink-100 object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center rounded border border-ink-100 bg-surface-100 text-sm text-ink-500">
                    No Cover
                  </div>
                )}
                <div className="mt-2 line-clamp-1 text-sm font-semibold text-ink-900">{r.title}</div>
                <div className="line-clamp-1 text-[11px] text-ink-500">{r.author}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {showReservation && (
        <ReservationModal
          bookTitle={book.title}
          isbn={book.isbn}
          onClose={() => setShowReservation(false)}
        />
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { books as booksAPI, type Book } from "../../lib/api";
import { BookStatusBadge } from "../StatusBadges";
import { AddBookForm } from "./AddBookForm";
import type { LoggedInRole } from "./types";

export function BooksPanel({ role }: { role: LoggedInRole }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<{ status: string; location?: string; category?: string }>({ status: "Available", location: "", category: "" });
  const [toast, setToast] = useState<string | null>(null);

  // Fetch books on mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await booksAPI.getAll();
        setBooks(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooks();
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const startEdit = (b: Book) => { setEditingId(b.id || b.isbn); setEditFields({ status: b.status || "Available", location: b.location || "", category: b.category || b.categorie || "" }); };
  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id: string) => {
    try {
      await booksAPI.update(id, {
        status: editFields.status as 'Available' | 'Borrowed',
        location: editFields.location,
        category: editFields.category
      });
      setBooks((prev) => prev.map((b) => b.id === id ? { ...b, status: editFields.status as 'Available' | 'Borrowed', location: editFields.location, category: editFields.category } : b));
      const book = books.find((b) => b.id === id);
      const bookTitle = book ? (book.titre || book.title || 'Book') : 'Book';
      setEditingId(null);
      showToast(`"${bookTitle}" updated.`);
    } catch (err) {
      showToast("Failed to update book.");
      console.error(err);
    }
  };

  const deleteBook = async (id: string) => {
    try {
      await booksAPI.delete(id);
      const book = books.find((b) => b.id === id);
      const bookTitle = book ? (book.titre || book.title || 'Book') : 'Book';
      setBooks((prev) => prev.filter((b) => b.id !== id));
      showToast(`"${bookTitle}" removed from catalog.`);
    } catch (err) {
      showToast("Failed to delete book.");
      console.error(err);
    }
  };

  const handleAddBook = (book: Book) => {
    setBooks((prev) => [book, ...prev]);
    const bookTitle = book.titre || book.title || 'Book';
    showToast(`"${bookTitle}" added to catalog.`);
  };

  return (
    <div className="w-full space-y-6">
      <AddBookForm onAdd={handleAddBook} />

      <div className="rounded-xl border border-ink-100 bg-white shadow-soft">
        <div className="border-b border-ink-100 px-5 py-4">
          <h2 className="font-serif text-2xl text-ink-900">Book Catalog</h2>
          <p className="mt-1 text-xs text-ink-500">{books.length} book(s)</p>
        </div>

        {toast && <div className="mx-5 mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">&#x2713; {toast}</div>}

        <div className="hidden md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                <th className="px-5 py-3">Book</th><th className="px-5 py-3">ISBN</th><th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Year</th><th className="px-5 py-3">Location</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id} className="border-b border-ink-100 last:border-b-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {b.coverUrl ? <img src={b.coverUrl} alt="" className="h-12 w-8 shrink-0 rounded border border-ink-100 object-cover" />
                        : <div className="flex h-12 w-8 shrink-0 items-center justify-center rounded border border-ink-100 bg-surface-100 text-[8px] text-ink-500">N/A</div>}
                      <div className="min-w-0"><div className="max-w-[180px] truncate text-xs font-semibold text-ink-900">{b.title || b.titre}</div><div className="text-[10px] text-ink-500">{b.author || b.auteur}</div></div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-ink-700">{b.isbn}</td>
                  <td className="px-5 py-3">
                    {editingId === b.id
                      ? <select value={editFields.category || ''} onChange={(e) => setEditFields((f) => ({ ...f, category: e.target.value }))} className="rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500"><option value="Computer Science">Computer Science</option><option value="Software Engineering">Software Engineering</option></select>
                      : <span className="text-xs text-ink-700">{b.categorie}</span>}
                  </td>
                  <td className="px-5 py-3 text-xs text-ink-700">{b.year}</td>
                  <td className="px-5 py-3">
                    {editingId === b.id
                      ? <input value={editFields.location || ''} onChange={(e) => setEditFields((f) => ({ ...f, location: e.target.value }))} className="w-28 rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500" />
                      : <span className="text-xs text-ink-700">{b.location || ''}</span>}
                  </td>
                  <td className="px-5 py-3">
                    {editingId === b.id
                      ? <select value={editFields.status} onChange={(e) => setEditFields((f) => ({ ...f, status: e.target.value }))} className="rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500"><option value="Available">Available</option><option value="Borrowed">Borrowed</option></select>
                      : <BookStatusBadge status={b.status} />}
                  </td>
                  <td className="px-5 py-3">
                    {editingId === b.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(b.id || b.isbn)} className="rounded bg-brand-700 px-3 py-1 text-[10px] font-semibold text-white hover:bg-brand-600">Save</button>
                        <button onClick={cancelEdit} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-500 hover:bg-surface-50">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(b)} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-700 hover:bg-surface-50">Edit</button>
                        {role === "Admin" && (
                          <button onClick={() => deleteBook(b.id || b.isbn)} className="rounded border border-rose-200 px-3 py-1 text-[10px] font-semibold text-rose-600 hover:bg-rose-50">Delete</button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {books.map((b) => (
            <div key={b.id} className="rounded-lg border border-ink-100 bg-surface-50 p-4">
              <div className="flex items-start gap-3">
                {b.coverUrl ? <img src={b.coverUrl} alt="" className="h-16 w-11 shrink-0 rounded border border-ink-100 object-cover" />
                  : <div className="flex h-16 w-11 shrink-0 items-center justify-center rounded border border-ink-100 bg-surface-100 text-[8px] text-ink-500">N/A</div>}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0"><div className="truncate text-xs font-semibold text-ink-900">{b.title || b.titre}</div><div className="text-[10px] text-ink-500">{b.author || b.auteur}</div></div>
                    <BookStatusBadge status={editingId === b.id ? editFields.status : b.status} />
                  </div>
                  <div className="mt-1 flex gap-3 text-[10px] text-ink-500"><span>{b.isbn}</span><span>{b.year}</span></div>
                </div>
              </div>
              <div className="mt-3">
                {editingId === b.id ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <select value={editFields.status} onChange={(e) => setEditFields((f) => ({ ...f, status: e.target.value }))} className="rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500"><option value="Available">Available</option><option value="Borrowed">Borrowed</option></select>
                      <select value={editFields.category || ''} onChange={(e) => setEditFields((f) => ({ ...f, category: e.target.value }))} className="rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500"><option value="Computer Science">Computer Science</option><option value="Software Engineering">Software Engineering</option></select>
                    </div>
                    <input value={editFields.location || ''} onChange={(e) => setEditFields((f) => ({ ...f, location: e.target.value }))} placeholder="Location" className="w-full rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500" />
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(b.id || b.isbn)} className="rounded bg-brand-700 px-3 py-1 text-[10px] font-semibold text-white hover:bg-brand-600">Save</button>
                      <button onClick={cancelEdit} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-500 hover:bg-surface-50">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(b)} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-700 hover:bg-surface-50">Edit</button>
                    {role === "Admin" && <button onClick={() => deleteBook(b.id || b.isbn)} className="rounded border border-rose-200 px-3 py-1 text-[10px] font-semibold text-rose-600 hover:bg-rose-50">Delete</button>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

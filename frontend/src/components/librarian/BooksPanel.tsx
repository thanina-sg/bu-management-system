import { useEffect, useState, useMemo } from "react";
import { books as booksAPI, type Book } from "../../lib/api";
import { BookStatusBadge } from "../StatusBadges";
import { AddBookForm } from "./AddBookForm";
import type { LoggedInRole } from "./types";

export function BooksPanel({ role }: { role: LoggedInRole }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<{ disponible: boolean; localisation?: string; categorie?: string }>({ disponible: true, localisation: "", categorie: "" });
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

  // Compute unique categories from books
  const categories = useMemo(() => {
    const cats = new Set<string>();
    books.forEach((book) => {
      const cat = book.categorie;
      if (cat) cats.add(cat);
    });
    return Array.from(cats).sort();
  }, [books]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const startEdit = (b: Book) => { setEditingId(b.id || b.isbn); setEditFields({ disponible: !!b.disponible, localisation: b.localisation || "", categorie: b.categorie || "" }); };
  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id: string) => {
    try {
      await booksAPI.update(id, {
        disponible: editFields.disponible,
        localisation: editFields.localisation,
        categorie: editFields.categorie
      });
      setBooks((prev) => prev.map((b) => b.id === id ? { ...b, disponible: editFields.disponible, localisation: editFields.localisation, categorie: editFields.categorie || b.categorie } : b));
      const book = books.find((b) => b.id === id);
      const bookTitle = book ? (book.titre || 'Livre') : 'Livre';
      setEditingId(null);
      showToast(`"${bookTitle}" mis a jour.`);
    } catch (err) {
      showToast("Echec de la mise a jour du livre.");
      console.error(err);
    }
  };

  const deleteBook = async (id: string) => {
    try {
      await booksAPI.delete(id);
      const book = books.find((b) => b.id === id);
      const bookTitle = book ? (book.titre || 'Livre') : 'Livre';
      setBooks((prev) => prev.filter((b) => b.id !== id));
      showToast(`"${bookTitle}" supprime du catalogue.`);
    } catch (err) {
      showToast("Echec de la suppression du livre.");
      console.error(err);
    }
  };

  const handleAddBook = (book: Book) => {
    setBooks((prev) => [book, ...prev]);
    const bookTitle = book.titre || 'Livre';
    showToast(`"${bookTitle}" ajoute au catalogue.`);
  };

  return (
    <div className="w-full space-y-6">
      <AddBookForm onAdd={handleAddBook} categories={categories} />

      <div className="rounded-xl border border-ink-100 bg-white shadow-soft">
        <div className="border-b border-ink-100 px-5 py-4">
          <h2 className="font-serif text-2xl text-ink-900">Catalogue des livres</h2>
          <p className="mt-1 text-xs text-ink-500">{books.length} livre(s)</p>
        </div>

        {toast && <div className="mx-5 mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">&#x2713; {toast}</div>}

        <div className="hidden md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                <th className="px-5 py-3">Livre</th><th className="px-5 py-3">ISBN</th><th className="px-5 py-3">Categorie</th>
                <th className="px-5 py-3">Annee</th><th className="px-5 py-3">Localisation</th><th className="px-5 py-3">Statut</th><th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id} className="border-b border-ink-100 last:border-b-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {b.couverture_url ? <img src={b.couverture_url} alt="" className="h-12 w-8 shrink-0 rounded border border-ink-100 object-cover" />
                        : <div className="flex h-12 w-8 shrink-0 items-center justify-center rounded border border-ink-100 bg-surface-100 text-[8px] text-ink-500">N/A</div>}
                      <div className="min-w-0"><div className="max-w-[180px] truncate text-xs font-semibold text-ink-900">{b.titre}</div><div className="text-[10px] text-ink-500">{b.auteur}</div></div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-ink-700">{b.isbn}</td>
                  <td className="px-5 py-3">
                    {editingId === b.id
                      ? <select value={editFields.categorie || ''} onChange={(e) => setEditFields((f) => ({ ...f, categorie: e.target.value }))} className="rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500"><option value="">Selectionner une categorie...</option>{categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}</select>
                      : <span className="text-xs text-ink-700">{b.categorie}</span>}
                  </td>
                  <td className="px-5 py-3 text-xs text-ink-700">{b.annee}</td>
                  <td className="px-5 py-3">
                    {editingId === b.id
                      ? <input value={editFields.localisation || ''} onChange={(e) => setEditFields((f) => ({ ...f, localisation: e.target.value }))} className="w-28 rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500" />
                      : <span className="text-xs text-ink-700">{b.localisation || ''}</span>}
                  </td>
                  <td className="px-5 py-3">
                    {editingId === b.id
                      ? <select value={editFields.disponible ? 'true' : 'false'} onChange={(e) => setEditFields((f) => ({ ...f, disponible: e.target.value === 'true' }))} className="rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500"><option value="true">Disponible</option><option value="false">Emprunte</option></select>
                      : <BookStatusBadge disponible={b.disponible} />}
                  </td>
                  <td className="px-5 py-3">
                    {editingId === b.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(b.id || b.isbn)} className="rounded bg-brand-700 px-3 py-1 text-[10px] font-semibold text-white hover:bg-brand-600">Enregistrer</button>
                        <button onClick={cancelEdit} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-500 hover:bg-surface-50">Annuler</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(b)} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-700 hover:bg-surface-50">Modifier</button>
                        {role === "Admin" && (
                          <button onClick={() => deleteBook(b.id || b.isbn)} className="rounded border border-rose-200 px-3 py-1 text-[10px] font-semibold text-rose-600 hover:bg-rose-50">Supprimer</button>
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
                {b.couverture_url ? <img src={b.couverture_url} alt="" className="h-16 w-11 shrink-0 rounded border border-ink-100 object-cover" />
                  : <div className="flex h-16 w-11 shrink-0 items-center justify-center rounded border border-ink-100 bg-gradient-to-br from-brand-50 to-surface-100 text-lg">📚</div>}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0"><div className="truncate text-xs font-semibold text-ink-900">{b.titre}</div><div className="text-[10px] text-ink-500">{b.auteur}</div></div>
                    <BookStatusBadge disponible={editingId === b.id ? editFields.disponible : b.disponible} />
                  </div>
                  <div className="mt-1 flex gap-3 text-[10px] text-ink-500"><span>{b.isbn}</span><span>{b.annee}</span></div>
                </div>
              </div>
              <div className="mt-3">
                {editingId === b.id ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <select value={editFields.disponible ? 'true' : 'false'} onChange={(e) => setEditFields((f) => ({ ...f, disponible: e.target.value === 'true' }))} className="rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500"><option value="true">Disponible</option><option value="false">Emprunte</option></select>
                      <select value={editFields.categorie || ''} onChange={(e) => setEditFields((f) => ({ ...f, categorie: e.target.value }))} className="rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500"><option value="">Categorie...</option>{categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}</select>
                    </div>
                    <input value={editFields.localisation || ''} onChange={(e) => setEditFields((f) => ({ ...f, localisation: e.target.value }))} placeholder="Localisation" className="w-full rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500" />
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(b.id || b.isbn)} className="rounded bg-brand-700 px-3 py-1 text-[10px] font-semibold text-white hover:bg-brand-600">Enregistrer</button>
                      <button onClick={cancelEdit} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-500 hover:bg-surface-50">Annuler</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(b)} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-700 hover:bg-surface-50">Modifier</button>
                    {role === "Admin" && <button onClick={() => deleteBook(b.id || b.isbn)} className="rounded border border-rose-200 px-3 py-1 text-[10px] font-semibold text-rose-600 hover:bg-rose-50">Supprimer</button>}
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

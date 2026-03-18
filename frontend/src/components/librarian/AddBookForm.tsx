import { useState } from "react";
import { books as booksAPI, type Book } from "../../lib/api";

export function AddBookForm({ onAdd, categories = [] }: { onAdd: (book: Book) => void; categories?: string[] }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState(categories[0] || "");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const reset = () => { setTitle(""); setAuthor(""); setIsbn(""); setYear(""); setCategory(categories[0] || ""); setDescription(""); setError(""); };

  const handleAdd = async () => {
    if (!title.trim() || !author.trim() || !isbn.trim() || !year.trim()) { 
      setError("Le titre, l'auteur, l'ISBN et l'annee sont obligatoires."); 
      return; 
    }
    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear) || parsedYear < 1000 || parsedYear > 2100) { 
      setError("Veuillez saisir une annee valide."); 
      return; 
    }
    
    setError("");
    setIsLoading(true);
    
    try {
      const newBook = await booksAPI.create({
        titre: title.trim(),
        auteur: author.trim(),
        isbn: isbn.trim(),
        annee: parsedYear,
        categorie: category.trim() || "Science",
        localisation: "Main Library",
        resume: description.trim() || `${title.trim()} de ${author.trim()}.`,
      });
      onAdd(newBook);
      reset();
      setOpen(false);
    } catch (err) {
      setError("Echec de l'ajout du livre. L'ISBN existe peut-etre deja.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) {
    return <button onClick={() => setOpen(true)} className="rounded-lg bg-brand-700 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600">+ Ajouter un livre</button>;
  }

  return (
    <div className="rounded-xl border border-ink-100 border-t-4 border-t-brand-700 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl text-ink-900">Ajouter un livre</h3>
        <button onClick={() => { setOpen(false); reset(); }} className="text-xs font-semibold text-ink-500 hover:text-ink-700">Annuler</button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-ink-500">Titre *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. The Pragmatic Programmer" className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500" />
        </div>
        <div><label className="mb-1 block text-xs font-medium text-ink-500">Auteur *</label><input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g. David Thomas" className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500" /></div>
        <div><label className="mb-1 block text-xs font-medium text-ink-500">ISBN *</label><input value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="e.g. 978-0135957059" className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500" /></div>
        <div><label className="mb-1 block text-xs font-medium text-ink-500">Annee *</label><input value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2019" className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500" /></div>
        <div><label className="mb-1 block text-xs font-medium text-ink-500">Categorie</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500">
            <option value="">Selectionner une categorie...</option>{categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2"><label className="mb-1 block text-xs font-medium text-ink-500">Resume</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500" /></div>
      </div>
      {error && <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
      <button onClick={handleAdd} disabled={isLoading} className="mt-4 w-full rounded-lg bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:bg-brand-600 disabled:opacity-50">{isLoading ? "Ajout..." : "Ajouter au catalogue"}</button>
    </div>
  );
}

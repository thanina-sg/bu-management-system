import { useState } from "react";
import { type Book } from "../../lib/books";

export function AddBookForm({ onAdd }: { onAdd: (book: Book) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState<Book["category"]>("Computer Science");
  const [location, setLocation] = useState("Main Stack");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => { 
    setTitle(""); setAuthor(""); setIsbn(""); setYear(""); 
    setCategory("Computer Science"); setLocation("Main Stack"); 
    setDescription(""); setError(""); 
  };

  const handleAdd = async () => {
    // 1. Validations locales
    if (!title.trim() || !author.trim() || !isbn.trim() || !year.trim()) { 
      setError("Title, Author, ISBN, and Year are required."); 
      return; 
    }
    
    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear) || parsedYear < 1000 || parsedYear > 2100) { 
      setError("Please enter a valid year."); 
      return; 
    }

    setLoading(true);
    setError("");

    // 2. Préparation de l'objet selon ton Swagger/Model
    const newBookData = {
      isbn: isbn.trim(),
      titre: title.trim(),
      auteur: author.trim(),
      categorie: category,
      annee: parsedYear,
      description: description.trim() // Sera mappé vers 'resume' par ton controller/model
    };

    try {
      // 3. Appel à ton Backend Express
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBookData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save the book");
      }

      // 4. Récupération du livre créé (avec son ID généré par Supabase)
      const savedBook = await response.json();
      
      // On met à jour l'affichage local
      onAdd(savedBook); 
      
      reset();
      setOpen(false);
    } catch (err: any) {
      setError(err.message || "Server connection error");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="rounded-lg bg-brand-700 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600">
        + Add Book
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-ink-100 border-t-4 border-t-brand-700 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl text-ink-900">Add New Book</h3>
        <button onClick={() => { setOpen(false); reset(); }} className="text-xs font-semibold text-ink-500 hover:text-ink-700">Cancel</button>
      </div>
      
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-ink-500">Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. The Pragmatic Programmer" className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500" />
        </div>
        <div><label className="mb-1 block text-xs font-medium text-ink-500">Author *</label><input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g. David Thomas" className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500" /></div>
        <div><label className="mb-1 block text-xs font-medium text-ink-500">ISBN *</label><input value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="e.g. 978-0135957059" className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500" /></div>
        <div><label className="mb-1 block text-xs font-medium text-ink-500">Year *</label><input value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2019" className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500" /></div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-500">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as Book["category"])} className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500">
            <option value="Computer Science">Computer Science</option>
            <option value="Software Engineering">Software Engineering</option>
          </select>
        </div>
        <div className="sm:col-span-2"><label className="mb-1 block text-xs font-medium text-ink-500">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500" /></div>
      </div>

      {error && <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
      
      <button 
        onClick={handleAdd} 
        disabled={loading}
        className={`mt-4 w-full rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-soft ${loading ? 'bg-brand-400' : 'bg-brand-700 hover:bg-brand-600'}`}
      >
        {loading ? "Adding to Catalog..." : "Add to Catalog"}
      </button>
    </div>
  );
}
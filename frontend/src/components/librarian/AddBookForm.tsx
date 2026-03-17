import { useState } from "react";
import { BOOKS, type Book } from "../../lib/books";

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

  const reset = () => { setTitle(""); setAuthor(""); setIsbn(""); setYear(""); setCategory("Computer Science"); setLocation("Main Stack"); setDescription(""); setError(""); };

  const handleAdd = () => {
    if (!title.trim() || !author.trim() || !isbn.trim() || !year.trim()) { setError("Title, Author, ISBN, and Year are required."); return; }
    if (BOOKS.some((b) => b.isbn === isbn.trim())) { setError(`A book with ISBN "${isbn}" already exists.`); return; }
    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear) || parsedYear < 1000 || parsedYear > 2100) { setError("Please enter a valid year."); return; }
    setError("");
    onAdd({
      id: String(Date.now()),
      title: title.trim(), author: author.trim(), isbn: isbn.trim(), year: parsedYear,
      category, status: "Available", location: location.trim() || "Main Stack",
      description: description.trim() || `${title.trim()} by ${author.trim()}.`,
    });
    reset();
    setOpen(false);
  };

  if (!open) {
    return <button onClick={() => setOpen(true)} className="rounded-lg bg-brand-700 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600">+ Add Book</button>;
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
        <div><label className="mb-1 block text-xs font-medium text-ink-500">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as Book["category"])} className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500">
            <option value="Computer Science">Computer Science</option><option value="Software Engineering">Software Engineering</option>
          </select>
        </div>
        <div><label className="mb-1 block text-xs font-medium text-ink-500">Location</label><input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500" /></div>
        <div className="sm:col-span-2"><label className="mb-1 block text-xs font-medium text-ink-500">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500" /></div>
      </div>
      {error && <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
      <button onClick={handleAdd} className="mt-4 w-full rounded-lg bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:bg-brand-600">Add to Catalog</button>
    </div>
  );
}

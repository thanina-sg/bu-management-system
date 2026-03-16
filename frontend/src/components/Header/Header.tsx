import React, { useState, useEffect } from 'react';
// @ts-ignore
import LoginPopup from '../LoginPopup';
import { BookCard } from '../Book/BookCard';
import { Footer } from '../Footer/Footer';
import { BookPopup } from '../BookPopup';

export const Header = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState(''); 
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
    fetchBooks(); 
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search);
      if (category) params.append('categorie', category);
      if (status) params.append('disponibilite', status);

      const url = `http://localhost:5000/api/books?${params.toString()}`;
      const response = await fetch(url);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Erreur API:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] selection:bg-amber-100">
      
      {/* NAVBAR MINIMALISTE */}
      <header className="w-full bg-white/70 backdrop-blur-xl border-b border-stone-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-11 h-11 bg-stone-900 rounded-2xl flex items-center justify-center text-white font-serif text-xl font-black shadow-lg group-hover:bg-amber-800 transition-colors duration-500">U</div>
            <h1 className="text-sm font-black tracking-[0.3em] uppercase text-stone-900">Bibliothèque Universitaire</h1>
          </div>
          
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-black text-stone-500 uppercase tracking-widest">{user.prenom}</span>
                <button onClick={() => { localStorage.removeItem('user'); setUser(null); }} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-900 hover:text-amber-800 transition-colors">Se connecter</button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-8 py-16 w-full">
        {/* SECTION RECHERCHE TYPE "HERO" */}
        <section className="mb-24 text-center">
          <h2 className="font-serif text-5xl font-black text-stone-900 mb-10 tracking-tight">Que recherchez-vous ?</h2>
          <form onSubmit={(e) => { e.preventDefault(); fetchBooks(); }} className="max-w-5xl mx-auto">
            <div className="bg-white p-3 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.06)] border border-stone-100 flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center px-8">
                <input 
                  type="text" 
                  placeholder="Titre, auteur, ISBN..." 
                  className="w-full py-4 outline-none text-lg font-medium text-stone-800 placeholder:text-stone-300"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-3 p-1">
                <select 
                  className="px-6 py-4 bg-stone-50 rounded-[2rem] outline-none font-bold text-stone-500 text-sm cursor-pointer hover:bg-stone-100 transition-colors"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Catégories</option>
                  <option value="Roman">Roman</option>
                  <option value="Science">Science</option>
                  <option value="Informatique">Informatique</option>
                </select>
                <select 
                  className="px-6 py-4 bg-stone-50 rounded-[2rem] outline-none font-bold text-stone-500 text-sm cursor-pointer hover:bg-stone-100 transition-colors"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Tout</option>
                  <option value="true">Disponibles</option>
                </select>
                <button type="submit" className="bg-stone-900 text-white px-10 py-4 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-amber-800 transition-all shadow-lg active:scale-95">
                  Explorer
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* GRILLE DE RÉSULTATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
          {loading ? (
            <div className="col-span-full py-20 flex justify-center">
              <div className="w-12 h-12 border-2 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : books.length > 0 ? (
            books.map((book) => (
              <div key={book.isbn} onClick={() => { setSelectedBook(book); setIsDetailsOpen(true); }} className="cursor-pointer">
                <BookCard book={book} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center">
              <p className="font-serif text-2xl italic text-stone-300">Aucun trésor trouvé dans nos étagères.</p>
            </div>
          )}
        </div>
      </main>

      <Footer totalBooks={books.length} />

      {/* POPUPS */}
      <LoginPopup isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onAuthSuccess={(u: any) => { setUser(u); localStorage.setItem('user', JSON.stringify(u)); }} />
      <BookPopup 
        book={selectedBook}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        similarBooks={books.filter(b => b.categorie === selectedBook?.categorie && b.isbn !== selectedBook?.isbn).slice(0, 4)}
      />
    </div>
  );
};
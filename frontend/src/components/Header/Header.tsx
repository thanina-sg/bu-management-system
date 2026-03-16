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

  // 1. Initialisation : On récupère l'user s'il existe
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
    fetchBooks(); 
  }, []);

  // 2. Refresh des livres quand les filtres changent
  useEffect(() => {
    fetchBooks();
  }, [category, status]);

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

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    setUser(null);
  };

  const handleAuthSuccess = (u: any) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('userId', u.id_utilisateur || u.id);
    setIsAuthOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] selection:bg-amber-100">
      
      {/* NAVBAR : Full Width avec Glassmorphism */}
      <header className="w-full bg-white/70 backdrop-blur-xl border-b border-stone-100 sticky top-0 z-50">
        <div className="w-full px-[5%] py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-11 h-11 bg-stone-900 rounded-2xl flex items-center justify-center text-white font-serif text-xl font-black shadow-lg group-hover:bg-amber-800 transition-colors duration-500">U</div>
            <h1 className="hidden sm:block text-sm font-black tracking-[0.3em] uppercase text-stone-900">Bibliothèque Universitaire</h1>
          </div>
          
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-3">
                <div className="flex flex-col items-end">
                   <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest leading-none mb-1">Membre Actif</span>
                   <span className="text-[11px] font-black text-stone-900 uppercase tracking-widest">{user.prenom}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm"
                  title="Déconnexion"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)} 
                className="px-6 py-3 rounded-xl bg-stone-900 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-amber-800 transition-all shadow-xl shadow-stone-900/10"
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN : Contenu Large avec marges fluides */}
      <main className="flex-grow w-full px-[5%] py-12">
        
        {/* SECTION RECHERCHE MASSIVE */}
        <section className="mb-20 text-center">
          <h2 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-black text-stone-900 mb-8 tracking-tight leading-none">
            Que recherchez-vous <span className="text-amber-800">?</span>
          </h2>
          
          <form onSubmit={(e) => { e.preventDefault(); fetchBooks(); }} className="w-full max-w-[1400px] mx-auto">
            <div className="bg-white p-2 md:p-3 rounded-[2.5rem] md:rounded-[4rem] shadow-[0_40px_120px_rgba(0,0,0,0.07)] border border-stone-100 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-8">
                <svg className="w-6 h-6 text-stone-300 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input 
                  type="text" 
                  placeholder="Un titre, un auteur ou un code ISBN..." 
                  className="w-full py-5 outline-none text-lg md:text-xl font-medium text-stone-800 placeholder:text-stone-300"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 p-2">
                <select 
                  className="px-6 py-4 bg-stone-50 rounded-2xl md:rounded-[2.5rem] outline-none font-black text-stone-500 text-[10px] uppercase tracking-widest cursor-pointer hover:bg-stone-100 transition-colors border-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Toutes Catégories</option>
                  <option value="Roman">Roman</option>
                  <option value="Science">Science</option>
                  <option value="Informatique">Informatique</option>
                  <option value="Histoire">Histoire</option>
                </select>

                <button 
                  type="submit" 
                  className="bg-stone-900 text-white px-10 py-5 rounded-2xl md:rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.2em] hover:bg-amber-800 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                >
                  <span>Explorer</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* GRILLE ADAPTATIVE ULTRA-LARGE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-x-10 gap-y-16">
          {loading ? (
            <div className="col-span-full py-32 flex flex-col items-center gap-6">
              <div className="w-16 h-16 border-[3px] border-amber-800 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-black text-[10px] uppercase tracking-[0.4em] text-stone-400">Consultation des archives...</p>
            </div>
          ) : books.length > 0 ? (
            books.map((book) => (
              <div 
                key={book.isbn} 
                onClick={() => { setSelectedBook(book); setIsDetailsOpen(true); }} 
                className="transform transition-all duration-500 hover:-translate-y-2"
              >
                <BookCard book={book} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border-2 border-stone-100 border-dashed">
              <div className="text-6xl mb-6">📚</div>
              <p className="font-serif text-3xl italic text-stone-300">Aucun trésor trouvé dans nos étagères.</p>
              <button onClick={() => {setSearch(''); setCategory(''); fetchBooks();}} className="mt-8 text-[10px] font-black uppercase tracking-widest text-amber-800 border-b-2 border-amber-800/20 hover:border-amber-800 transition-all">Réinitialiser la recherche</button>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <Footer totalBooks={books.length} />

      {/* POPUPS */}
      <LoginPopup 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onAuthSuccess={handleAuthSuccess} 
      />
      
      {selectedBook && (
        <BookPopup 
          book={selectedBook}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          similarBooks={books.filter(b => b.categorie === selectedBook.categorie && b.isbn !== selectedBook.isbn).slice(0, 4)}
        />
      )}
    </div>
  );
};
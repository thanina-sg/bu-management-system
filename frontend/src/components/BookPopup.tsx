import React, { useState } from 'react';

export const BookPopup = ({ book, isOpen, onClose, similarBooks }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !book) return null;

  const handleEmprunt = async () => {
    // Récupération de l'ID utilisateur stocké lors du login
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert("⚠️ Connexion requise : Veuillez vous connecter pour emprunter cet ouvrage.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/emprunts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_utilisateur: userId,
          isbn: book.isbn
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("✨ Félicitations : " + (data.message || "Votre emprunt a été validé !"));
        onClose();
      } else {
        alert("❌ Action impossible : " + data.error);
      }
    } catch (err) {
      alert("❌ Erreur : Impossible de joindre le serveur de la bibliothèque.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay avec flou artistique profond */}
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-md transition-opacity duration-500" 
        onClick={onClose} 
      />

      {/* Conteneur Pop-up */}
      <div className="relative bg-[#FDFCFB] w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-500 ease-out">
        
        {/* Bouton Fermer Flottant */}
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 p-3 rounded-full bg-white shadow-lg hover:bg-stone-900 hover:text-white transition-all duration-300 z-10 group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div className="flex flex-col lg:flex-row min-h-[600px]">
          
          {/* COLONNE GAUCHE : VISUEL IMMERSIF */}
          <div className="lg:w-[42%] bg-stone-100 p-12 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/5 to-transparent opacity-50" />
            
            <div className="relative z-10 w-full group">
              <div className="aspect-[2/3] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.2)] transform transition-transform duration-700 group-hover:scale-[1.02]">
                {book.imageUrl ? (
                  <img src={book.imageUrl} alt={book.titre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-stone-200 flex items-center justify-center text-4xl font-serif text-stone-400">
                    {book.titre[0]}
                  </div>
                )}
              </div>
              
              {/* Badge dynamique avec nb_disponible */}
              <div className={`mt-8 py-3 rounded-2xl text-center font-black uppercase tracking-[0.2em] text-[10px] border shadow-sm transition-colors duration-300 ${
                book.nb_disponible > 0 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                  : 'bg-rose-50 border-rose-100 text-rose-700'
              }`}>
                {book.nb_disponible > 0 
                  ? `✓ ${book.nb_disponible} Exemplaire${book.nb_disponible > 1 ? 's' : ''} disponible${book.nb_disponible > 1 ? 's' : ''}` 
                  : '✗ Aucun exemplaire disponible'}
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : CONTENU ÉDITORIAL */}
          <div className="flex-1 p-10 lg:p-16 flex flex-col">
            <div className="mb-10">
              <span className="inline-block px-4 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-black uppercase tracking-widest mb-6">
                {book.categorie}
              </span>
              <h2 className="text-5xl font-serif font-black text-stone-900 leading-[1.1] mb-4">
                {book.titre}
              </h2>
              <p className="text-2xl italic text-stone-400 font-medium">par {book.auteur}</p>
            </div>

            {/* GRILLE D'INFOS : 3 COLONNES */}
            <div className="grid grid-cols-3 gap-6 mb-10 pb-10 border-b border-stone-100">
              <div>
                <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-2">Référence ISBN</h4>
                <p className="text-stone-800 font-bold font-mono text-base">{book.isbn}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-2">Publication</h4>
                <p className="text-stone-800 font-bold text-base">{book.annee || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-2">Stock</h4>
                <p className={`font-bold text-base ${book.nb_disponible > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {book.nb_disponible} unité{book.nb_disponible > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex-grow">
              <h4 className="text-[10px] font-black text-stone-900 uppercase tracking-[0.3em] mb-4">Synopsis</h4>
              <p className="text-stone-600 leading-relaxed text-lg font-serif italic">
                {book.resume || "Nous n'avons pas encore de résumé pour cet ouvrage dans notre catalogue numérique. Veuillez consulter la fiche physique en bibliothèque."}
              </p>
            </div>

            {/* Bouton d'action massif avec logique Emprunt / Réservation */}
            <div className="mt-12">
              <button 
                onClick={handleEmprunt}
                disabled={isSubmitting}
                className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-xs transition-all duration-500 shadow-xl active:scale-[0.98] ${
                  isSubmitting ? 'bg-stone-300 cursor-not-allowed' :
                  book.nb_disponible > 0 
                    ? 'bg-stone-900 text-white hover:bg-stone-700 shadow-stone-200' 
                    : 'bg-amber-700 text-white hover:bg-amber-900 shadow-amber-200'
                }`}
              >
                {isSubmitting ? 'Traitement de la demande...' : 
                 book.nb_disponible > 0 ? 'Emprunter cet ouvrage' : 'Réserver (File d\'attente)'}
              </button>
              
              {book.nb_disponible === 0 && !isSubmitting && (
                <p className="text-center mt-4 text-[10px] text-stone-400 font-medium uppercase tracking-widest animate-pulse">
                  Le livre est actuellement victime de son succès
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION RECOMMANDATIONS */}
        {similarBooks && similarBooks.length > 0 && (
          <div className="bg-stone-50/50 p-12 border-t border-stone-100">
            <h3 className="text-center text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] mb-12">
              Dans la même collection
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {similarBooks.map((simBook: any) => (
                <div key={simBook.isbn} className="group cursor-pointer">
                  <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500 mb-4">
                    <img src={simBook.imageUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                  <h5 className="text-xs font-bold text-stone-900 line-clamp-1 group-hover:text-amber-800 transition-colors">{simBook.titre}</h5>
                  <p className="text-[10px] text-stone-400 font-medium">{simBook.auteur}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
import React from 'react';

export const BookPopup = ({ book, isOpen, onClose, similarBooks }: any) => {
  if (!isOpen || !book) return null;

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
            {/* Dégradé d'ambiance en arrière-plan */}
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
              
              {/* Badge de disponibilité stylisé sous l'image */}
              <div className={`mt-8 py-3 rounded-2xl text-center font-black uppercase tracking-[0.2em] text-[10px] border shadow-sm ${
                book.est_disponible 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                  : 'bg-rose-50 border-rose-100 text-rose-700'
              }`}>
                {book.est_disponible ? '✓ Exemplaire Disponible' : '✗ Actuellement Emprunté'}
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

            <div className="grid grid-cols-2 gap-10 mb-10 pb-10 border-b border-stone-100">
              <div>
                <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-2">Référence ISBN</h4>
                <p className="text-stone-800 font-bold font-mono text-lg">{book.isbn}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-2">Publication</h4>
                <p className="text-stone-800 font-bold text-lg">{book.annee || "N/A"}</p>
              </div>
            </div>

            <div className="flex-grow">
              <h4 className="text-[10px] font-black text-stone-900 uppercase tracking-[0.3em] mb-4">Synopsis</h4>
              <p className="text-stone-600 leading-relaxed text-lg font-serif italic">
                {book.resume || "Nous n'avons pas encore de résumé pour cet ouvrage dans notre catalogue numérique. Veuillez consulter la fiche physique en bibliothèque."}
              </p>
            </div>

            {/* Bouton d'action massif */}
            <div className="mt-12">
              <button className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-xs transition-all duration-500 shadow-xl active:scale-[0.98] ${
                book.est_disponible 
                  ? 'bg-stone-900 text-white hover:bg-amber-800' 
                  : 'bg-amber-700 text-white hover:bg-amber-900'
              }`}>
                {book.est_disponible ? 'Réserver cet ouvrage' : 'Être alerté du retour'}
              </button>
            </div>
          </div>
        </div>

        {/* SECTION RECOMMANDATIONS FLUIDE */}
        {similarBooks.length > 0 && (
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
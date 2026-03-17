const getInitials = (title: string): string => {
  return title.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

export const BookCard = ({ book }: { book: any }) => {
  const isAvailable = book.est_disponible;

  return (
    <div className="group relative flex flex-col h-full transition-all duration-500">
      {/* Conteneur de l'image avec effet de zoom au survol */}
      <div className="relative aspect-[2/3] w-full rounded-[2.5rem] overflow-hidden mb-5 shadow-sm group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:-translate-y-2 transition-all duration-500 border border-stone-100">
        
        {book.imageUrl ? (
          <img 
            src={book.imageUrl} 
            alt={book.titre} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#F2F0EB] to-[#E5E1D3] flex flex-col items-center justify-center p-8 border-l-[10px] border-amber-900/20">
            <span className="font-serif text-5xl font-black text-amber-900/20 select-none">
              {getInitials(book.titre)}
            </span>
          </div>
        )}
        
        {/* Overlay au survol pour indiquer que c'est cliquable */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 flex items-center justify-center">
           <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              <span className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-stone-900 shadow-xl">
                Voir la fiche
              </span>
           </div>
        </div>

        {/* Badge de Statut flottant */}
        <div className="absolute top-5 right-5 z-10">
          <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm backdrop-blur-md ${
            isAvailable 
              ? 'bg-emerald-500/90 text-white' 
              : 'bg-rose-500/90 text-white'
          }`}>
            {isAvailable ? 'Disponible' : 'Indisponible'}
          </div>
        </div>
      </div>

      {/* Textes centrés et élégants */}
      <div className="px-2 text-center">
        <span className="text-[10px] font-black text-amber-800/60 uppercase tracking-[0.2em] mb-1 block">
          {book.categorie}
        </span>
        <h3 className="font-serif font-bold text-gray-900 text-lg leading-tight group-hover:text-amber-900 transition-colors line-clamp-2 px-2">
          {book.titre}
        </h3>
        <p className="text-stone-400 text-xs font-medium mt-2 italic">
          {book.auteur}
        </p>
      </div>
    </div>
  );
};

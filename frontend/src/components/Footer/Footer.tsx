export const Footer = ({ totalBooks }: { totalBooks?: number }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-[#1a1512] text-stone-400 mt-20 border-t border-amber-900/20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Identité & Statut du Catalogue */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-800 rounded flex items-center justify-center text-white font-bold shadow-lg shadow-amber-900/20">
                U
              </div>
              <h3 className="font-bold text-white text-lg tracking-tight uppercase font-serif">BU-UHA</h3>
            </div>
            <p className="text-sm leading-relaxed text-stone-500 max-w-xs font-medium italic">
              Système de gestion en temps réel du fonds documentaire de l'Université de Haute-Alsace.
            </p>
            {/* Affichage dynamique de la BDD si tu passes la prop totalBooks */}
            {totalBooks !== undefined && (
              <div className="inline-block px-3 py-1 bg-stone-800/50 rounded-lg border border-stone-700">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-tighter">
                  {totalBooks} Ouvrages répertoriés
                </p>
              </div>
            )}
          </div>

          {/* Contact Réel */}
          <div>
            <h3 className="font-black text-white mb-6 text-[10px] uppercase tracking-[0.3em] opacity-50">Assistance</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-stone-800/50 flex items-center justify-center group-hover:bg-amber-800 transition-all duration-300">
                  <svg className="w-4 h-4 text-amber-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-stone-500 uppercase">Email</p>
                  <p className="text-stone-300 font-medium">bu@uha.fr</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-stone-800/50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-stone-500 uppercase">Horaires</p>
                  <p className="text-stone-300 font-medium">Lun-Ven: 08h - 19h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Catégories Actives (Exemples de ce qui est en BDD) */}
          <div>
            <h3 className="font-black text-white mb-6 text-[10px] uppercase tracking-[0.3em] opacity-50">Exploration</h3>
            <div className="flex flex-wrap gap-2">
              {['Informatique', 'Roman', 'Science', 'Droit'].map((cat) => (
                <span key={cat} className="px-3 py-1.5 bg-stone-800/30 border border-stone-700/50 rounded-md text-[10px] font-bold text-stone-400 uppercase hover:text-amber-500 hover:border-amber-500/30 transition-all cursor-default">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-8 bg-amber-900/50"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-600">
              &copy; {currentYear} BU-UHA . Database Synced
            </p>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-stone-500">
            <span className="hover:text-amber-500 transition-colors cursor-pointer">Confidentialité</span>
            <span className="hover:text-amber-500 transition-colors cursor-pointer">Mentions Légales</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

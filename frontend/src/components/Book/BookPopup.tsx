import { useState } from 'react';

export const BookPopup = ({ book, isOpen, onClose, similarBooks }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sécurité d'affichage : si pas de livre ou popup fermé, on ne rend rien
  if (!isOpen || !book) return null;

  // --- 1. DONNÉES ÉDITION (Maintenant disponibles via ton correctif Backend) ---
  const anneeAffiche = (book.annee !== undefined && book.annee !== null) 
    ? book.annee 
    : "Non spécifiée";

  // --- 2. LOGIQUE DE STOCK & QUANTITÉ ---
  const stock = book.nb_disponible ?? 0;
  const isAvailable = stock > 0;

  const handleAction = async () => {
    // Récupération de l'UUID stocké lors de la connexion (clé 'userId')
    const userId = localStorage.getItem('userId');

    if (!userId || userId === "undefined") {
      alert("⚠️ Identification requise : Veuillez vous reconnecter.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Appel à la route /emprunts (conforme à ton OpenAPI/Supabase)
      const response = await fetch('http://localhost:5000/emprunts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_utilisateur: userId,
          isbn: book.isbn
        })
      });

      const data = await response.json();

      if (response.ok || response.status === 201) {
        alert(isAvailable 
          ? `✨ Emprunt validé ! Il reste encore ${stock - 1} exemplaires en rayon.` 
          : "📅 Réservation réussie ! Vous serez notifié dès qu'un exemplaire sera rendu."
        );
        onClose();
      } else {
        alert("❌ Erreur : " + (data.error || data.message || "Impossible de finaliser l'opération."));
      }
    } catch (err) {
      alert("❌ Erreur : Connexion au serveur impossible.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay sombre avec flou en arrière-plan */}
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Conteneur principal du Popup */}
      <div className="relative bg-[#FDFCFB] w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-500 ease-out">
        
        {/* Bouton Fermer (X) */}
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 p-3 rounded-full bg-white shadow-lg hover:bg-stone-900 hover:text-white transition-all z-[120] group"
        >
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div className="flex flex-col lg:flex-row min-h-[600px]">
          
          {/* SECTION GAUCHE : COUVERTURE & BADGE DE STOCK */}
          <div className="lg:w-[42%] bg-stone-100 p-12 flex flex-col items-center justify-center relative border-r border-stone-50">
            <div className="w-full max-w-[320px] aspect-[2/3] rounded-[2rem] overflow-hidden shadow-2xl mb-8 transform hover:scale-[1.02] transition-transform duration-500">
              {book.imageUrl ? (
                <img src={book.imageUrl} alt={book.titre} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400 font-serif text-5xl italic">
                  {book.titre?.[0]}
                </div>
              )}
            </div>
            
            {/* Badge d'état global */}
            <div className={`w-full py-4 rounded-2xl text-center font-black uppercase tracking-[0.2em] text-[10px] border shadow-sm transition-colors ${
              isAvailable 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                : 'bg-amber-50 text-amber-700 border-amber-100'
            }`}>
              {isAvailable ? `✓ DISPONIBLE EN RAYON` : '⚠ RUPTURE DE STOCK'}
            </div>
          </div>

          {/* SECTION DROITE : DÉTAILS ET ACTIONS */}
          <div className="flex-1 p-10 lg:p-16 flex flex-col">
            <div className="mb-8">
              <span className="inline-block px-4 py-1 rounded-full bg-amber-50 text-amber-800 text-[9px] font-black uppercase tracking-widest mb-6">
                {book.categorie}
              </span>
              <h2 className="text-5xl font-serif font-black text-stone-900 leading-[1.1] mb-4">
                {book.titre}
              </h2>
              <p className="text-2xl italic text-stone-400 font-medium">par {book.auteur}</p>
            </div>

            {/* GRILLE TECHNIQUE : ISBN | ANNÉE | QUANTITÉ */}
            <div className="grid grid-cols-3 gap-6 py-8 border-y border-stone-100 mb-8">
              <div>
                <h4 className="text-[10px] font-black text-stone-300 uppercase mb-2 tracking-widest">Référence ISBN</h4>
                <p className="text-stone-800 font-bold font-mono text-sm">{book.isbn}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-stone-300 uppercase mb-2 tracking-widest text-amber-800/60">Année d'édition</h4>
                <p className="text-stone-800 font-bold text-sm">{anneeAffiche}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-stone-300 uppercase mb-2 tracking-widest">Disponibilité</h4>
                <p className={`font-bold text-sm ${isAvailable ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {isAvailable ? `${stock} exemplaire(s)` : '0 exemplaire'}
                </p>
              </div>
            </div>

            {/* SECTION RÉSUMÉ (Récupéré dynamiquement) */}
            <div className="flex-grow mb-12">
              <h4 className="text-[10px] font-black text-stone-900 uppercase tracking-[0.3em] mb-4">Résumé</h4>
              <p className="text-stone-600 leading-relaxed text-lg font-serif italic line-clamp-6">
                {book.resume || "Le synopsis de cet ouvrage est en cours de mise à jour par nos bibliothécaires."}
              </p>
            </div>

            {/* BOUTON D'ACTION PRINCIPAL */}
            <div className="space-y-4">
              <button 
                onClick={handleAction}
                disabled={isSubmitting}
                className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] transition-all duration-300 shadow-xl transform active:scale-95 ${
                  isSubmitting ? 'bg-stone-200 text-stone-400 cursor-not-allowed' :
                  isAvailable 
                    ? 'bg-stone-900 text-white hover:bg-stone-800 shadow-stone-200' 
                    : 'bg-amber-700 text-white hover:bg-amber-800 shadow-amber-100'
                }`}
              >
                {isSubmitting ? 'Traitement en cours...' : isAvailable ? 'Emprunter ce livre' : 'Réserver ce livre'}
              </button>
              
              {!isAvailable && (
                <p className="text-center text-[9px] font-black text-amber-800/40 uppercase tracking-[0.2em] animate-pulse">
                   ⏳ Les réservations sont traitées par ordre d'arrivée
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION RECOMMANDATIONS */}
        {similarBooks && similarBooks.length > 0 && (
          <div className="bg-stone-50/50 p-12 border-t border-stone-100">
            <h3 className="text-center text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] mb-12">
              Dans la même catégorie
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {similarBooks.map((simBook: any) => (
                <div key={simBook.isbn} className="group cursor-pointer">
                  <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500 mb-4">
                    <img src={simBook.imageUrl} className="w-full h-full object-cover" alt={simBook.titre} />
                  </div>
                  <h5 className="text-xs font-bold text-stone-900 line-clamp-1 text-center">{simBook.titre}</h5>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

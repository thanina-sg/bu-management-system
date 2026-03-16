import React, { useState } from 'react';

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: '',
    nom: '',
    prenom: '',
    role: 'ETUDIANT'
  });
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isRegister ? formData : { email: formData.email }),
      });

      const data = await response.json();
      if (response.ok) {
        onAuthSuccess(data.user);
        onClose();
      } else {
        setError(data.error || "Une erreur est survenue.");
      }
    } catch (err) {
      setError("Le serveur ne répond pas. Vérifiez que l'API est lancée.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay avec Glassmorphism */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-md transition-opacity duration-500" 
        onClick={onClose} 
      />

      {/* Container de la Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[3.5rem] bg-[#FDFCFB] shadow-[0_50px_100px_rgba(0,0,0,0.4)] animate-in zoom-in-95 duration-300">
        
        {/* Header - Identité Visuelle BU */}
        <div className="relative bg-stone-900 p-12 text-center">
          {/* Motif décoratif en arrière-plan */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-800/20 rounded-full blur-[60px] -mr-16 -mt-16"></div>
          
          <button 
            onClick={onClose} 
            className="absolute right-8 top-8 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:bg-white hover:text-stone-900 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-amber-800 mb-6 shadow-2xl rotate-3">
             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
             </svg>
          </div>
          
          <h2 className="text-3xl font-serif font-black text-white tracking-tight leading-none mb-3">
            {isRegister ? 'Rejoindre la BU' : 'Accès Membre'}
          </h2>
          <p className="text-amber-200/50 text-[10px] font-black uppercase tracking-[0.3em]">
            Université de Haute-Alsace
          </p>
        </div>

        {/* Corps du Formulaire */}
        <form onSubmit={handleSubmit} className="p-10 md:p-12 space-y-8">
          {error && (
            <div className="flex items-center gap-4 rounded-2xl bg-rose-50 p-5 text-xs font-bold text-rose-700 border border-rose-100 animate-bounce">
              <span className="text-lg">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Email Universitaire</label>
            <div className="relative">
              <input
                name="email"
                type="email"
                required
                placeholder="prenom.nom@uha.fr"
                className="w-full rounded-2xl border-2 border-stone-100 bg-stone-50 p-5 outline-none focus:border-amber-800/30 focus:bg-white transition-all font-medium text-stone-800 placeholder:text-stone-300"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {isRegister && (
            <div className="space-y-8 animate-in slide-in-from-top-2 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Nom</label>
                  <input
                    name="nom"
                    type="text"
                    required
                    className="w-full rounded-2xl border-2 border-stone-100 bg-stone-50 p-5 outline-none focus:border-amber-800/30 focus:bg-white transition-all font-medium text-stone-800"
                    value={formData.nom}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Prénom</label>
                  <input
                    name="prenom"
                    type="text"
                    required
                    className="w-full rounded-2xl border-2 border-stone-100 bg-stone-50 p-5 outline-none focus:border-amber-800/30 focus:bg-white transition-all font-medium text-stone-800"
                    value={formData.prenom}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Profil académique</label>
                <div className="relative">
                  <select
                    name="role"
                    className="w-full rounded-2xl border-2 border-stone-100 bg-stone-50 p-5 outline-none focus:border-amber-800/30 focus:bg-white transition-all font-bold text-stone-600 cursor-pointer appearance-none"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="ETUDIANT"> Étudiant</option>
                    <option value="ENSEIGNANT"> Enseignant</option>
                    <option value="BIBLIOTHECAIRE"> Conservateur</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full rounded-2xl bg-stone-900 py-5 font-black text-[11px] uppercase tracking-[0.3em] text-white shadow-2xl shadow-stone-900/20 transition-all hover:bg-amber-800 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]"
            >
              {isRegister ? "S'inscrire" : "Se connecter"}
            </button>
          </div>

          <div className="text-center pt-2">
            <button 
              type="button"
              className="group text-[10px] font-black text-stone-400 uppercase tracking-widest hover:text-stone-900 transition-colors"
              onClick={() => {
                setError('');
                setIsRegister(!isRegister);
              }}
            >
              {isRegister ? (
                <>Déjà membre ? <span className="text-amber-800 border-b-2 border-amber-800/20 group-hover:border-amber-800 ml-2 transition-all">S'identifier</span></>
              ) : (
                <>Nouveau ? <span className="text-amber-800 border-b-2 border-amber-800/20 group-hover:border-amber-800 ml-2 transition-all">S'enregistrer</span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;
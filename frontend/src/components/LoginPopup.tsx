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
    
    // URLs basées sur ton OpenAPI
    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isRegister ? formData : { email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        // IMPORTANT : On récupère l'ID (UUID) selon ton schéma Utilisateur
        const userObj = data.user;
        const userId = userObj.id || userObj.utilisateurId;

        if (userId) {
          localStorage.setItem('user', JSON.stringify(userObj));
          localStorage.setItem('userId', userId);
        }
        
        onAuthSuccess(userObj);
        onClose();
      } else {
        setError(data.error || "Identifiants incorrects ou erreur serveur.");
      }
    } catch (err) {
      setError("Le serveur est injoignable.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-[3.5rem] bg-[#FDFCFB] shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="relative bg-stone-900 p-12 text-center">
          <button onClick={onClose} className="absolute right-8 top-8 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:bg-white hover:text-stone-900 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-amber-800 mb-6 shadow-2xl rotate-3 text-white">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h2 className="text-3xl font-serif font-black text-white mb-3">{isRegister ? 'Rejoindre la BU' : 'Accès Membre'}</h2>
          <p className="text-amber-200/50 text-[10px] font-black uppercase tracking-[0.3em]">UHA MULHOUSE</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && <div className="p-4 bg-rose-50 text-rose-700 text-xs font-bold rounded-2xl border border-rose-100">{error}</div>}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Email Universitaire</label>
            <input name="email" type="email" required placeholder="votre.nom@uha.fr" className="w-full rounded-2xl border-2 border-stone-100 bg-stone-50 p-5 outline-none focus:bg-white transition-all" value={formData.email} onChange={handleChange} />
          </div>

          {isRegister && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-2 gap-4">
                <input name="nom" placeholder="Nom" required className="w-full rounded-2xl border-2 border-stone-100 bg-stone-50 p-5 outline-none" value={formData.nom} onChange={handleChange} />
                <input name="prenom" placeholder="Prénom" required className="w-full rounded-2xl border-2 border-stone-100 bg-stone-50 p-5 outline-none" value={formData.prenom} onChange={handleChange} />
              </div>
              <select name="role" className="w-full rounded-2xl border-2 border-stone-100 bg-stone-50 p-5 outline-none font-bold text-stone-600" value={formData.role} onChange={handleChange}>
                <option value="ETUDIANT">Étudiant</option>
                <option value="ENSEIGNANT">Enseignant</option>
                <option value="BIBLIOTHECAIRE">Bibliothécaire</option>
              </select>
            </div>
          )}

          <button type="submit" className="w-full rounded-2xl bg-stone-900 py-5 font-black text-[11px] uppercase tracking-[0.3em] text-white hover:bg-amber-800 transition-all shadow-xl">
            {isRegister ? "S'inscrire" : "Se connecter"}
          </button>

          <button type="button" className="w-full text-[10px] font-black text-stone-400 uppercase tracking-widest" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Déjà membre ? S'identifier" : "Nouveau ? S'enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;
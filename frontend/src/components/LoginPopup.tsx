import React, { useState } from 'react';

// Définition des types attendus par le composant
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

  // Si la modal n'est pas ouverte, on n'affiche rien
  if (!isOpen) return null;

  // Gestion des changements dans les champs (Typage React robuste)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gestion de la soumission du formulaire
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
      {/* Overlay (cliquer à côté ferme la modal) */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity cursor-pointer" 
        onClick={onClose} 
      />

      {/* Container de la Modal */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
        
        {/* Header - Thème Amber (comme ton Library Header) */}
        <div className="bg-gradient-to-r from-amber-800 to-amber-950 p-6 text-white text-center">
          <button 
            onClick={onClose} 
            className="absolute right-4 top-4 rounded-full p-1 hover:bg-white/20 transition-colors text-2xl leading-none"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold">{isRegister ? 'Join Us' : 'Welcome Back'}</h2>
          <p className="text-amber-200 text-xs mt-1 uppercase tracking-wider font-semibold">
            {isRegister ? 'Create your library account' : 'Access your dashboard'}
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-100 italic">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email University</label>
            <input
              name="email"
              type="email"
              required
              placeholder="username@uha.fr"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-amber-700 focus:bg-white focus:ring-4 focus:ring-amber-700/10 transition-all"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {isRegister && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Last Name</label>
                  <input
                    name="nom"
                    type="text"
                    required
                    placeholder="Nom"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-amber-700 transition-all"
                    value={formData.nom}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">First Name</label>
                  <input
                    name="prenom"
                    type="text"
                    required
                    placeholder="Prénom"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-amber-700 transition-all"
                    value={formData.prenom}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Academic Status</label>
                <select
                  name="role"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 outline-none focus:border-amber-700 bg-white transition-all cursor-pointer"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="ETUDIANT">🎓 Étudiant</option>
                  <option value="ENSEIGNANT">Enseignant</option>
                  <option value="BIBLIOTHECAIRE"> Bibliothécaire</option>
                </select>
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="w-full rounded-xl bg-amber-800 py-3 font-bold text-white transition-all hover:bg-amber-900 hover:shadow-lg active:scale-95"
          >
            {isRegister ? "Create Account" : "Sign In"}
          </button>

          <div className="pt-2 text-center">
            <button 
              type="button"
              className="text-sm font-medium text-amber-800 hover:underline transition-colors"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Already have an account? Log in" : "New here? Register your account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;
import { useState } from 'react';

interface BorrowModalProps {
  bookTitle: string;
  isbn: string;
  onClose: () => void;
}

export function BorrowModal({ bookTitle, isbn, onClose }: BorrowModalProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-ink-100 bg-white p-6 shadow-lg">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-100 mx-auto">
            <span className="text-xl">📚</span>
          </div>

          <h3 className="mt-4 text-center text-lg font-semibold text-ink-900">
            Emprunter "{bookTitle}"
          </h3>

          <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">📍 Service de la bibliothèque</span>
            </p>
            <p className="text-xs text-blue-700 mt-2">
              Pour emprunter cette ressource, veuillez vous présenter au service de la bibliothèque avec votre carte d'étudiant.
            </p>
            <div className="mt-3 text-xs text-blue-600 space-y-1">
              <p>• <strong>Horaires:</strong> Lun-Ven 8h00-19h00, Sam 10h00-17h00</p>
              <p>• <strong>Durée:</strong> 14 jours (renouvelable 2 fois)</p>
              <p>• <strong>ISBN:</strong> {isbn}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-ink-200 bg-white px-6 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-50"
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="rounded-lg bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Aller à la bibliothèque →
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50" 
            onClick={() => setShowConfirm(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-lg border border-emerald-200 bg-emerald-50 p-6 shadow-lg">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mx-auto">
                <span className="text-xl">✓</span>
              </div>
              <h3 className="mt-4 text-center text-lg font-semibold text-emerald-900">
                À bientôt!
              </h3>
              <p className="mt-2 text-center text-sm text-emerald-800">
                Notre équipe vous accueillera à la bibliothèque pour finir votre emprunt.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Fermer
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

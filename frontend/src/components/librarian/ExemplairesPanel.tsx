import { useEffect, useState } from "react";
import { books as booksAPI } from "../../lib/api";

interface Copy {
  id_exemplaire: string;
  isbn: string;
  etat: string;
  localisation: string;
  disponibilite: boolean;
}

export function ExempairesPanel({ bookIsbn, bookTitle, onClose }: { bookIsbn: string; bookTitle: string; onClose: () => void }) {
  const [copies, setCopies] = useState<Copy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCopies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await booksAPI.getCopies(bookIsbn);
        setCopies(data);
      } catch (err) {
        setError("Impossible de charger les exemplaires.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCopies();
  }, [bookIsbn]);

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20">
        <div className="w-full max-w-2xl rounded-lg border border-ink-100 bg-white shadow-lg max-h-96 overflow-auto">
          {/* Header */}
          <div className="sticky top-0 border-b border-ink-100 bg-white px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-ink-900">
                Exemplaires de "{bookTitle}"
              </h3>
              <p className="mt-1 text-xs text-ink-500">ISBN: {bookIsbn}</p>
            </div>
            <button
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink-100 text-ink-500 hover:bg-ink-200"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading && (
              <div className="text-center py-8">
                <p className="text-sm text-ink-500">Chargement des exemplaires...</p>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            {!isLoading && !error && copies.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-ink-500">Aucun exemplaire disponible pour ce livre.</p>
              </div>
            )}

            {!isLoading && !error && copies.length > 0 && (
              <div className="hidden md:block">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink-100 text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                      <th className="px-4 py-3">ID Exemplaire</th>
                      <th className="px-4 py-3">État</th>
                      <th className="px-4 py-3">Localisation</th>
                      <th className="px-4 py-3">Disponibilité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {copies.map((copy) => (
                      <tr key={copy.id_exemplaire} className="border-b border-ink-100 last:border-b-0">
                        <td className="px-4 py-3">
                          <div className="text-xs font-mono text-ink-600 truncate" title={copy.id_exemplaire}>
                            {copy.id_exemplaire.substring(0, 12)}...
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-semibold ${
                            copy.etat === 'BON' ? 'bg-emerald-100 text-emerald-700' :
                            copy.etat === 'ABIME' ? 'bg-amber-100 text-amber-700' :
                            'bg-ink-100 text-ink-700'
                          }`}>
                            {copy.etat}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs">{copy.localisation || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-semibold ${
                            copy.disponibilite ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {copy.disponibilite ? 'Disponible' : 'Emprunté'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!isLoading && !error && copies.length > 0 && (
              <div className="md:hidden space-y-3">
                {copies.map((copy) => (
                  <div key={copy.id_exemplaire} className="rounded-lg border border-ink-100 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-ink-500 uppercase">ID</p>
                        <p className="text-xs font-mono text-ink-600 truncate mt-1">{copy.id_exemplaire}</p>
                      </div>
                      <span className={`whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-semibold ${
                        copy.disponibilite ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {copy.disponibilite ? 'Libre' : 'Prêté'}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] font-semibold text-ink-500 uppercase">État</p>
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold mt-1 ${
                          copy.etat === 'BON' ? 'bg-emerald-100 text-emerald-700' :
                          copy.etat === 'ABIME' ? 'bg-amber-100 text-amber-700' :
                          'bg-ink-100 text-ink-700'
                        }`}>
                          {copy.etat}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-ink-500 uppercase">Localisation</p>
                        <p className="text-xs text-ink-600 mt-1">{copy.localisation || '-'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

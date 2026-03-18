import { useState } from "react";
import { reservations as reservationsAPI, auth, APIError } from "../lib/api";

export function ReservationModal({
  bookTitle,
  isbn,
  onClose,
}: {
  bookTitle: string;
  isbn: string;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [queuePosition, setQueuePosition] = useState(0);

  const handleReserve = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Get current user
      const user = auth.getStoredUser();
      if (!user) {
        setError("Vous devez etre connecte pour reserver.");
        setIsLoading(false);
        return;
      }

      // Create reservation
      const reservation = await reservationsAPI.create({
        id_utilisateur: user.id,
        isbn,
      });

      setQueuePosition(reservation.position_file || 0);
      setSubmitted(true);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message || "Impossible de creer la reservation. Veuillez reessayer.");
      } else {
        setError("Une erreur inattendue est survenue. Veuillez reessayer.");
      }
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl border border-ink-100 bg-white shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        {!submitted ? (
          <>
            <div className="border-b border-ink-100 px-5 py-4">
              <h3 className="font-serif text-xl text-ink-900">Reserver la ressource</h3>
              <p className="mt-1 text-xs text-ink-500">
                Ce livre est actuellement emprunte. Vous serez ajoute a la file d'attente.
              </p>
            </div>

            <div className="px-5 py-4">
              <div className="rounded-lg border border-ink-100 bg-surface-50 p-3">
                <div className="text-xs font-semibold text-ink-900">{bookTitle}</div>
                <div className="mt-0.5 text-[10px] text-ink-500">ISBN: {isbn}</div>
              </div>

              {error && (
                <div className="mt-3 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
                  {error}
                </div>
              )}

              <p className="mt-4 text-xs text-ink-500">
                Vous serez notifie quand cette ressource sera disponible.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-ink-100 px-5 py-3">
              <button
                onClick={onClose}
                className="rounded-lg border border-ink-100 px-4 py-2 text-xs font-semibold text-ink-700 hover:bg-surface-50"
                disabled={isLoading}
              >
                Annuler
              </button>
              <button
                onClick={handleReserve}
                disabled={isLoading}
                className="rounded-lg bg-brand-700 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Traitement..." : "Confirmer la reservation"}
              </button>
            </div>
          </>
        ) : (
          <div className="px-5 py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-lg text-emerald-600">
              &#x2713;
            </div>
            <h3 className="mt-4 font-serif text-xl text-ink-900">Reservation confirmee</h3>
            <p className="mt-2 text-sm text-ink-500">
              Vous etes <span className="font-semibold text-amber-600">#{queuePosition}</span> dans la file
              d'attente pour cette ressource.
            </p>
            <div className="mt-4 rounded-lg border border-ink-100 bg-surface-50 p-3 text-left">
              <div className="text-xs font-semibold text-ink-900">{bookTitle}</div>
              <div className="mt-1 flex gap-4 text-[10px] text-ink-500">
                <span>Date: {new Date().toISOString().split('T')[0]}</span>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-ink-500">
              Vous serez notifie quand la ressource sera disponible.
            </p>
            <button
              onClick={onClose}
              className="mt-5 rounded-lg bg-brand-700 px-6 py-2 text-xs font-semibold text-white hover:bg-brand-600"
            >
              Terminer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

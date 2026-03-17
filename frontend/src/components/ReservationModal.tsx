import { useState } from "react";
import { RESERVATIONS } from "../lib/books";

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
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");

  const existingReservations = RESERVATIONS.filter((r) => r.isbn === isbn);
  const queuePosition = existingReservations.length + 1;

  const handleReserve = () => {
    if (!studentId.trim()) {
      setError("Please enter your Student ID.");
      return;
    }
    if (!/^[ST]-\d+$/.test(studentId.trim())) {
      setError("Invalid Student ID format. Use S-XXXXXX or T-XXXXXX.");
      return;
    }
    setError("");
    setSubmitted(true);
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
              <h3 className="font-serif text-xl text-ink-900">Reserve Resource</h3>
              <p className="mt-1 text-xs text-ink-500">
                This book is currently borrowed. You will be added to the waiting queue.
              </p>
            </div>

            <div className="px-5 py-4">
              <div className="rounded-lg border border-ink-100 bg-surface-50 p-3">
                <div className="text-xs font-semibold text-ink-900">{bookTitle}</div>
                <div className="mt-0.5 text-[10px] text-ink-500">ISBN: {isbn}</div>
                <div className="mt-1 text-[10px] text-amber-600 font-semibold">
                  Current queue position: #{queuePosition}
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-xs font-medium text-ink-500">Student ID</label>
                <input
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. S-100234"
                  className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500"
                />
              </div>

              {error && (
                <div className="mt-3 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
                  {error}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-ink-100 px-5 py-3">
              <button
                onClick={onClose}
                className="rounded-lg border border-ink-100 px-4 py-2 text-xs font-semibold text-ink-700 hover:bg-surface-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReserve}
                className="rounded-lg bg-brand-700 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600"
              >
                Confirm Reservation
              </button>
            </div>
          </>
        ) : (
          <div className="px-5 py-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-lg text-emerald-600">
              &#x2713;
            </div>
            <h3 className="mt-4 font-serif text-xl text-ink-900">Reservation Confirmed</h3>
            <p className="mt-2 text-sm text-ink-500">
              You are <span className="font-semibold text-amber-600">#{queuePosition}</span> in the waiting
              queue for this resource.
            </p>
            <div className="mt-4 rounded-lg border border-ink-100 bg-surface-50 p-3 text-left">
              <div className="text-xs font-semibold text-ink-900">{bookTitle}</div>
              <div className="mt-1 flex gap-4 text-[10px] text-ink-500">
                <span>Student: {studentId}</span>
                <span>Date: 2026-03-17</span>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-ink-500">
              You will be notified when the resource becomes available.
            </p>
            <button
              onClick={onClose}
              className="mt-5 rounded-lg bg-brand-700 px-6 py-2 text-xs font-semibold text-white hover:bg-brand-600"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

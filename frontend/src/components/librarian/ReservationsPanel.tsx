import { useState } from "react";
import { RESERVATIONS, USERS, type Reservation } from "../../lib/books";
import { ReservationStatusBadge } from "../StatusBadges";

export function ReservationsPanel() {
  const [reservations, setReservations] = useState<Reservation[]>(RESERVATIONS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<Reservation["status"]>("Pending");
  const [toast, setToast] = useState<string | null>(null);

  const userName = (id: string) => USERS.find((s) => s.id === id)?.name ?? id;

  const startEdit = (r: Reservation) => { setEditingId(r.id); setEditStatus(r.status); };
  const cancelEdit = () => setEditingId(null);
  const saveEdit = (id: string) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status: editStatus } : r)));
    setEditingId(null);
    showToast(`Reservation ${id} updated to "${editStatus}".`);
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  return (
    <div className="w-full">
      <div className="rounded-xl border border-ink-100 bg-white shadow-soft">
        <div className="border-b border-ink-100 px-5 py-4">
          <h2 className="font-serif text-2xl text-ink-900">Reservations</h2>
          <p className="mt-1 text-xs text-ink-500">{reservations.length} reservation(s)</p>
        </div>

        {toast && <div className="mx-5 mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">&#x2713; {toast}</div>}

        <div className="hidden md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Book</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Queue</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-b border-ink-100 last:border-b-0">
                  <td className="px-5 py-3 text-xs font-medium text-ink-700">{r.id}</td>
                  <td className="px-5 py-3"><div className="text-xs font-semibold text-ink-900">{userName(r.studentId)}</div><div className="text-[10px] text-ink-500">{r.studentId}</div></td>
                  <td className="px-5 py-3"><div className="max-w-[200px] truncate text-xs text-ink-900">{r.bookTitle}</div><div className="text-[10px] text-ink-500">{r.isbn}</div></td>
                  <td className="px-5 py-3 text-xs text-ink-700">{r.date}</td>
                  <td className="px-5 py-3 text-xs font-semibold text-ink-700">#{r.queuePosition}</td>
                  <td className="px-5 py-3">
                    {editingId === r.id ? (
                      <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as Reservation["status"])}
                        className="rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500">
                        <option value="Pending">Pending</option><option value="Ready">Ready</option><option value="Cancelled">Cancelled</option>
                      </select>
                    ) : <ReservationStatusBadge status={r.status} />}
                  </td>
                  <td className="px-5 py-3">
                    {editingId === r.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(r.id)} className="rounded bg-brand-700 px-3 py-1 text-[10px] font-semibold text-white hover:bg-brand-600">Save</button>
                        <button onClick={cancelEdit} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-500 hover:bg-surface-50">Cancel</button>
                      </div>
                    ) : <button onClick={() => startEdit(r)} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-700 hover:bg-surface-50">Edit</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {reservations.map((r) => (
            <div key={r.id} className="rounded-lg border border-ink-100 bg-surface-50 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-ink-900">{r.bookTitle}</div>
                  <div className="mt-0.5 text-[10px] text-ink-500">{userName(r.studentId)} &middot; {r.studentId}</div>
                </div>
                <ReservationStatusBadge status={r.status} />
              </div>
              <div className="mt-2 flex gap-4 text-[10px] text-ink-500"><span>{r.id}</span><span>{r.date}</span><span>#{r.queuePosition}</span></div>
              <div className="mt-3">
                {editingId === r.id ? (
                  <div className="flex items-center gap-2">
                    <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as Reservation["status"])}
                      className="rounded border border-ink-100 bg-white px-2 py-1 text-xs text-ink-900 outline-none focus:border-brand-500">
                      <option value="Pending">Pending</option><option value="Ready">Ready</option><option value="Cancelled">Cancelled</option>
                    </select>
                    <button onClick={() => saveEdit(r.id)} className="rounded bg-brand-700 px-3 py-1 text-[10px] font-semibold text-white hover:bg-brand-600">Save</button>
                    <button onClick={cancelEdit} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-500 hover:bg-surface-50">Cancel</button>
                  </div>
                ) : <button onClick={() => startEdit(r)} className="rounded border border-ink-100 px-3 py-1 text-[10px] font-semibold text-ink-700 hover:bg-surface-50">Edit</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

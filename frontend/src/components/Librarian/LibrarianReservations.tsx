import { useState } from 'react';
import { DataTable } from '../Dashboard/DataTable';

export const LibrarianReservations = () => {
  const [reservations] = useState([
    { id: '1', bookTitle: 'The Art of Programming', userName: 'John Doe', date: '2026-03-14', status: 'Pending' },
    { id: '2', bookTitle: 'Web Development 101', userName: 'Jane Smith', date: '2026-03-13', status: 'Ready' },
    { id: '3', bookTitle: 'Data Science Guide', userName: 'Bob Wilson', date: '2026-03-12', status: 'Pending' },
    { id: '4', bookTitle: 'Cloud Computing', userName: 'Alice Brown', date: '2026-03-11', status: 'Completed' },
  ]);

  const columns = [
    { key: 'bookTitle', header: 'Book Title' },
    { key: 'userName', header: 'Reserved By' },
    { key: 'date', header: 'Reservation Date' },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Manage Reservations</h3>
          <p className="text-sm text-gray-600">View and manage all book reservations</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          + New Reservation
        </button>
      </div>
      <DataTable columns={columns} data={reservations} title="All Reservations" />
    </div>
  );
};

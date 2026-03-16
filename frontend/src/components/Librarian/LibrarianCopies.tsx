import { useState } from 'react';
import { DataTable } from '../Dashboard/DataTable';

export const LibrarianCopies = () => {
  const [copies] = useState([
    { id: '1', bookTitle: 'The Art of Programming', isbn: '978-0201896831', status: 'Available', location: 'Shelf A-01' },
    { id: '2', bookTitle: 'The Art of Programming', isbn: '978-0201896831', status: 'Borrowed', location: 'User: John' },
    { id: '3', bookTitle: 'Web Development 101', isbn: '978-0596007973', status: 'Available', location: 'Shelf B-02' },
    { id: '4', bookTitle: 'Data Science Guide', isbn: '978-1491915325', status: 'Maintenance', location: 'Repair Center' },
  ]);

  const columns = [
    { key: 'bookTitle', header: 'Book Title' },
    { key: 'isbn', header: 'ISBN' },
    { key: 'status', header: 'Status' },
    { key: 'location', header: 'Location' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Manage Book Copies</h3>
          <p className="text-sm text-gray-600">Track and manage physical book copies</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          + Add Copy
        </button>
      </div>
      <DataTable columns={columns} data={copies} title="All Book Copies" />
    </div>
  );
};

import { useState } from 'react';
import { DataTable } from '../Dashboard/DataTable';

export const AdminBooks = () => {
  const [books] = useState([
    { id: '1', title: 'The Art of Programming', author: 'John Doe', category: 'CS', copies: 5, available: 3 },
    { id: '2', title: 'Web Development 101', author: 'Jane Smith', category: 'WEB', copies: 3, available: 1 },
    { id: '3', title: 'Data Science Guide', author: 'Bob Wilson', category: 'DATA', copies: 7, available: 4 },
    { id: '4', title: 'Cloud Computing', author: 'Alice Brown', category: 'CLOUD', copies: 2, available: 2 },
  ]);

  const columns = [
    { key: 'title', header: 'Book Title' },
    { key: 'author', header: 'Author' },
    { key: 'category', header: 'Category' },
    { key: 'copies', header: 'Total Copies' },
    { key: 'available', header: 'Available' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Manage Books</h3>
          <p className="text-sm text-gray-600">View and manage all books in the system</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          + Add New Book
        </button>
      </div>
      <DataTable columns={columns} data={books} title="All Books" />
    </div>
  );
};

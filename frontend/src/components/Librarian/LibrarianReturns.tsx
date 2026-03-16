import { useState } from 'react';
import { DataTable } from '../Dashboard/DataTable';

export const LibrarianReturns = () => {
  const [returns] = useState([
    { id: '1', bookTitle: 'The Art of Programming', userName: 'John Doe', dueDate: '2026-03-10', status: 'Overdue' },
    { id: '2', bookTitle: 'Web Development 101', userName: 'Jane Smith', dueDate: '2026-03-15', status: 'On Time' },
    { id: '3', bookTitle: 'Data Science Guide', userName: 'Bob Wilson', dueDate: '2026-03-20', status: 'On Time' },
    { id: '4', bookTitle: 'Cloud Computing', userName: 'Alice Brown', dueDate: '2026-03-08', status: 'Overdue' },
  ]);

  const columns = [
    { key: 'bookTitle', header: 'Book Title' },
    { key: 'userName', header: 'Borrowed By' },
    { key: 'dueDate', header: 'Due Date' },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Manage Returns</h3>
          <p className="text-sm text-gray-600">Process book returns and track due dates</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
          + Process Return
        </button>
      </div>
      <DataTable columns={columns} data={returns} title="Items to Return" />
    </div>
  );
};

import { useState } from 'react';
import { DataTable } from '../Dashboard/DataTable';

export const AdminUsers = () => {
  const [users] = useState([
    { id: '1', name: 'Nina Sg', email: 'nina@example.com', role: 'Librarian', status: 'Active' },
    { id: '2', name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active' },
    { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'Librarian', status: 'Inactive' },
    { id: '4', name: 'Bob Wilson', email: 'bob@example.com', role: 'User', status: 'Active' },
  ]);

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Manage Users</h3>
          <p className="text-sm text-gray-600">View and manage all users in the system</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          + Add New User
        </button>
      </div>
      <DataTable columns={columns} data={users} title="All Users" />
    </div>
  );
};

// /pages/admin/manage-tribus/index.js
'use client';
import { useState, useEffect } from 'react';

export default function ManageTribus() {
  const [tribes, setTribes] = useState([]);

  useEffect(() => {
    // Fetch tribe data from an API or database
    // Placeholder data
    setTribes([
      { id: '1', name: 'Mage' },
      { id: '2', name: 'Fighter' },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Tribes</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Tribe List</h2>
        <ul>
          {tribes.map(tribe => (
            <li key={tribe.id} className="border-b py-2">{tribe.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

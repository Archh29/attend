// /pages/admin/manage-year-levels/index.js
'use client';
import { useState, useEffect } from 'react';

export default function ManageYearLevels() {
  const [yearLevels, setYearLevels] = useState([]);

  useEffect(() => {
    // Fetch year level data from an API or database
    // Placeholder data
    setYearLevels([
      { id: '1', level: '1st Year' },
      { id: '2', level: '2nd Year' },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Year Levels</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Year Level List</h2>
        <ul>
          {yearLevels.map(level => (
            <li key={level.id} className="border-b py-2">{level.level}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

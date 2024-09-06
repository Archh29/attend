'use client';
import { useEffect, useState } from 'react';

export default function ManageData() {
  const [students, setStudents] = useState([]);
  const [tribus, setTribus] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);
  const [editStudent, setEditStudent] = useState(null);
  const [editTribu, setEditTribu] = useState(null);
  const [editYearLevel, setEditYearLevel] = useState(null);
  const [activeTab, setActiveTab] = useState('students');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost/attendance/manage-data.php?type=${activeTab}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (activeTab === 'students') setStudents(data);
      else if (activeTab === 'tribus') setTribus(data);
      else if (activeTab === 'yearLevels') setYearLevels(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      const response = await fetch(`http://localhost/attendance/manage-data.php?id=${id}&type=${type}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        fetchData();
      } else {
        console.error('Delete failed:', result.error);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const handleEdit = (item, type) => {
    if (type === 'students') setEditStudent(item);
    else if (type === 'tribus') setEditTribu(item);
    else if (type === 'yearLevels') setEditYearLevel(item);
  };

  const handleSave = async () => {
    try {
      const dataToSend = new URLSearchParams();
      dataToSend.append('type', activeTab);
      if (activeTab === 'students') {
        Object.entries(editStudent).forEach(([key, value]) => dataToSend.append(key, value));
      } else if (activeTab === 'tribus') {
        Object.entries(editTribu).forEach(([key, value]) => dataToSend.append(key, value));
      } else if (activeTab === 'yearLevels') {
        Object.entries(editYearLevel).forEach(([key, value]) => dataToSend.append(key, value));
      }

      const response = await fetch('http://localhost/attendance/manage-data.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: dataToSend.toString(),
      });

      const result = await response.json();

      if (result.error) {
        console.error('Error:', result.error);
      } else {
        fetchData(); // Refresh data after saving
        setEditStudent(null); // Reset edit form
        setEditTribu(null);
        setEditYearLevel(null);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const renderTableData = () => {
    if (activeTab === 'students') {
      return students.map((student) => (
        <tr key={student.student_id}>
          <td>{student.fname} {student.mname} {student.lname}</td>
          <td>{student.contact_information}</td>
          <td>{student.tribu_name || 'N/A'}</td>
          <td>{student.year_level || 'N/A'}</td>
          <td>
            <button onClick={() => handleEdit(student, 'students')} className="text-blue-500">Edit</button>
            <button onClick={() => handleDelete(student.student_id, 'students')} className="text-red-500">Delete</button>
          </td>
        </tr>
      ));
    } else if (activeTab === 'tribus') {
      return tribus.map((tribu) => (
        <tr key={tribu.tribu_id}>
          <td>{tribu.name}</td>
          <td>
            <button onClick={() => handleEdit(tribu, 'tribus')} className="text-blue-500">Edit</button>
            <button onClick={() => handleDelete(tribu.tribu_id, 'tribus')} className="text-red-500">Delete</button>
          </td>
        </tr>
      ));
    } else if (activeTab === 'yearLevels') {
      return yearLevels.map((level) => (
        <tr key={level.year_level_id}>
          <td>{level.level}</td>
          <td>
            <button onClick={() => handleEdit(level, 'yearLevels')} className="text-blue-500">Edit</button>
            <button onClick={() => handleDelete(level.year_level_id, 'yearLevels')} className="text-red-500">Delete</button>
          </td>
        </tr>
      ));
    }
  };

  const renderEditForm = () => {
    if (activeTab === 'students' && editStudent) {
      return (
        <div className="bg-gray-200 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-bold mb-4">Edit Student</h2>
          <input
            type="text"
            value={editStudent.fname || ''}
            onChange={(e) => setEditStudent({ ...editStudent, fname: e.target.value })}
            placeholder="First Name"
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={editStudent.mname || ''}
            onChange={(e) => setEditStudent({ ...editStudent, mname: e.target.value })}
            placeholder="Middle Name"
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={editStudent.lname || ''}
            onChange={(e) => setEditStudent({ ...editStudent, lname: e.target.value })}
            placeholder="Last Name"
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={editStudent.contact_information || ''}
            onChange={(e) => setEditStudent({ ...editStudent, contact_information: e.target.value })}
            placeholder="Contact Information"
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <select
            value={editStudent.tribu_id || ''}
            onChange={(e) => setEditStudent({ ...editStudent, tribu_id: e.target.value })}
            className="mb-2 p-2 border border-gray-300 rounded"
          >
            <option value="">Select Tribu</option>
            {tribus.map((tribu) => (
              <option key={tribu.tribu_id} value={tribu.tribu_id}>{tribu.name}</option>
            ))}
          </select>
          <select
            value={editStudent.year_level_id || ''}
            onChange={(e) => setEditStudent({ ...editStudent, year_level_id: e.target.value })}
            className="mb-2 p-2 border border-gray-300 rounded"
          >
            <option value="">Select Year Level</option>
            {yearLevels.map((level) => (
              <option key={level.year_level_id} value={level.year_level_id}>{level.level}</option>
            ))}
          </select>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </div>
      );
    } else if (activeTab === 'tribus' && editTribu) {
      return (
        <div className="bg-gray-200 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-bold mb-4">Edit Tribu</h2>
          <input
            type="text"
            value={editTribu.name || ''}
            onChange={(e) => setEditTribu({ ...editTribu, name: e.target.value })}
            placeholder="Tribu Name"
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </div>
      );
    } else if (activeTab === 'yearLevels' && editYearLevel) {
      return (
        <div className="bg-gray-200 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-bold mb-4">Edit Year Level</h2>
          <input
            type="text"
            value={editYearLevel.level || ''}
            onChange={(e) => setEditYearLevel({ ...editYearLevel, level: e.target.value })}
            placeholder="Year Level"
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </div>
      );
    }
  };

  return (
    <div>
      <div className="mb-4">
        <button onClick={() => setActiveTab('students')} className={`px-4 py-2 ${activeTab === 'students' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Students</button>
        <button onClick={() => setActiveTab('tribus')} className={`px-4 py-2 ${activeTab === 'tribus' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Tribus</button>
        <button onClick={() => setActiveTab('yearLevels')} className={`px-4 py-2 ${activeTab === 'yearLevels' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Year Levels</button>
      </div>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            {activeTab === 'students' && (
              <>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Contact</th>
                <th className="border border-gray-300 px-4 py-2">Tribu</th>
                <th className="border border-gray-300 px-4 py-2">Year Level</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </>
            )}
            {activeTab === 'tribus' && (
              <>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </>
            )}
            {activeTab === 'yearLevels' && (
              <>
                <th className="border border-gray-300 px-4 py-2">Level</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {renderTableData()}
        </tbody>
      </table>
      {renderEditForm()}
    </div>
  );
}

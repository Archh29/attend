'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AttendanceChecker() {
  const [loading, setLoading] = useState(true);
  const [attendanceRecord, setAttendanceRecord] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [action, setAction] = useState('check-in');

  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      setLoading(false);
    };
    loadData();
  }, []);

  const handleActionChange = (event) => {
    setAction(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (studentId.trim()) {
      const clientTime = new Date().toISOString();
      await logOrCheckAttendance(studentId, action, clientTime);
    } else {
      alert('Please enter a valid student ID.');
    }
  };

  const formatToPHT = (utcDate) => {
    return new Date(utcDate).toLocaleString('en-PH', { timeZone: 'Asia/Manila' });
  };

  const logOrCheckAttendance = async (studentId, action, clientTime) => {
    try {
      const response = await fetch('http://localhost/attendance/attendance.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, studentId, clientTime }),
      });
      const result = await response.json();

      if (result.success) {
        const formattedRecord = {
          ...result.record,
          check_in_time: result.record.check_in_time ? formatToPHT(result.record.check_in_time) : null,
          check_out_time: result.record.check_out_time ? formatToPHT(result.record.check_out_time) : null,
        };
        setAttendanceRecord(formattedRecord);
      } else {
        alert(result.message);
        console.error('Failed to log/check attendance:', result.message);
      }
    } catch (error) {
      console.error('Error logging/checking attendance:', error);
    }
  };

  if (loading) return <p className="text-center text-xl">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-indigo-800">Attendance Checker Dashboard</h1>
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="studentId" className="block text-lg font-medium text-gray-700 mb-2">Student ID</label>
            <input
              id="studentId"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              placeholder="Enter Student ID"
            />
          </div>
          <div>
            <label htmlFor="action" className="block text-lg font-medium text-gray-700 mb-2">Action</label>
            <select
              id="action"
              value={action}
              onChange={handleActionChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            >
              <option value="check-in">Check-In</option>
              <option value="check-out">Check-Out</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition">Submit</button>
        </form>

        {attendanceRecord && (
          <div className="mt-8 bg-indigo-50 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Attendance Record</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Student ID:</strong> {attendanceRecord.student_id}</p>
              <p><strong>Check-In Time:</strong> {attendanceRecord.check_in_time}</p>
              <p><strong>Check-Out Time:</strong> {attendanceRecord.check_out_time}</p>
              <p><strong>Is Late:</strong> {attendanceRecord.is_late ? 'Yes' : 'No'}</p>
              <p><strong>Is Early:</strong> {attendanceRecord.is_early ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

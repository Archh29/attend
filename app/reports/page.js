'use client';
import { useEffect, useState } from 'react';

export default function Reports() {
  const [attendance, setAttendance] = useState([]);
  const [yearLevel, setYearLevel] = useState('');
  const [tribu, setTribu] = useState('');
  const [yearLevels, setYearLevels] = useState([]);
  const [tribus, setTribus] = useState([]);
  const [reportType, setReportType] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [date, setDate] = useState(''); // New state for date

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        const yearLevelsRes = await fetch('http://localhost/attendance/data.php?action=getYearLevels');
        if (!yearLevelsRes.ok) throw new Error('Failed to fetch year levels');
        const yearLevelsData = await yearLevelsRes.json();

        if (Array.isArray(yearLevelsData)) {
          setYearLevels(yearLevelsData);
        } else {
          console.error('Year levels data is not an array', yearLevelsData);
        }

        const tribusRes = await fetch('http://localhost/attendance/data.php?action=getTribus');
        if (!tribusRes.ok) throw new Error('Failed to fetch tribus');
        const tribusData = await tribusRes.json();

        if (Array.isArray(tribusData)) {
          setTribus(tribusData);
        } else {
          console.error('Tribus data is not an array', tribusData);
        }
      } catch (error) {
        setError('Failed to fetch filters');
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const queryParams = new URLSearchParams({
          action: 'getAttendance',
          yearLevel,
          tribu,
          date, // Include the date in the query parameters
        }).toString();

        const response = await fetch(`http://localhost/attendance/data.php?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch attendance');
        const data = await response.json();

        if (Array.isArray(data)) {
          setAttendance(data);
        } else {
          console.error('Expected an array but got:', data);
          setAttendance([]);
        }
      } catch (error) {
        setError('Failed to fetch attendance');
        setAttendance([]);
      }
    };

    fetchAttendance();
  }, [yearLevel, tribu, date]); // Add date as a dependency

  const renderTableHeader = (columns) => (
    <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <tr>
        {columns.map((col, index) => (
          <th key={index} className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );

  const renderDailyReport = () => (
    <div className="space-y-8">
      {attendance.length > 0 ? (
        attendance.map((record) => (
          <div key={record.yearLevel} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">{record.yearLevel}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                {renderTableHeader(['Name', 'In', 'Out'])}
                <tbody>
                  {record.students.length > 0 ? (
                    record.students.map((student, index) => (
                      <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-700">{student.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{student.inTime}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{student.outTime}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-3 px-4 text-center text-gray-500">No records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No attendance data available</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-extrabold mb-8 text-indigo-600">Reports and Analytics</h1>
      <div className="bg-white shadow-2xl rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Filter Attendance</h2>
        {loading && <p className="text-gray-500">Loading filters...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div>
            <label htmlFor="yearLevel" className="block text-gray-700 mb-2">Year Level</label>
            <select
              id="yearLevel"
              value={yearLevel}
              onChange={(e) => setYearLevel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All</option>
              {yearLevels.map((level) => (
                <option key={level.id} value={level.name}>{level.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tribu" className="block text-gray-700 mb-2">Tribu</label>
            <select
              id="tribu"
              value={tribu}
              onChange={(e) => setTribu(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All</option>
              {tribus.map((tribuOption) => (
                <option key={tribuOption.id} value={tribuOption.name}>{tribuOption.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-gray-700 mb-2">Date</label> {/* New date filter */}
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="mt-8">
          {reportType === 'daily' ? renderDailyReport() : renderMultiDayReport()}
        </div>
      </div>
    </div>
  );
}

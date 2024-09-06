import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-10 flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-10 text-indigo-800 text-center">
        PHINMA-COC CITE IT Days Attendance Monitoring App
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-10 w-full max-w-6xl">
        <Link href="/admin">
          <div className="bg-white shadow-lg rounded-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300 cursor-pointer h-64 flex flex-col justify-center border border-gray-200 hover:border-indigo-600">
            <div className="mb-6">
              <i className="bi bi-gear-fill text-5xl text-indigo-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-indigo-800">Admin Dashboard</h2>
            <p className="mt-4 text-gray-700">Manage students, teams, and year levels.</p>
          </div>
        </Link>

        <Link href="/student">
          <div className="bg-white shadow-lg rounded-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300 cursor-pointer h-64 flex flex-col justify-center border border-gray-200 hover:border-indigo-600">
            <div className="mb-6">
              <i className="bi bi-person-plus-fill text-5xl text-indigo-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-indigo-800">Register</h2>
            <p className="mt-4 text-gray-700">Sign up and get your QR code for attendance.</p>
          </div>
        </Link>

        <Link href="/attendance">
          <div className="bg-white shadow-lg rounded-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300 cursor-pointer h-64 flex flex-col justify-center border border-gray-200 hover:border-indigo-600">
            <div className="mb-6">
              <i className="bi bi-check2-circle text-5xl text-indigo-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-indigo-800">Check Attendance</h2>
            <p className="mt-4 text-gray-700">Monitor and update your attendance records.</p>
          </div>
        </Link>

        <Link href="/reports">
          <div className="bg-white shadow-lg rounded-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300 cursor-pointer h-64 flex flex-col justify-center border border-gray-200 hover:border-indigo-600">
            <div className="mb-6">
              <i className="bi bi-bar-chart-fill text-5xl text-indigo-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-indigo-800">View Reports</h2>
            <p className="mt-4 text-gray-700">Access detailed reports on attendance by student, team, and year level.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

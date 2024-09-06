import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-10 text-indigo-600 text-center">
        PHINMA-COC CITE IT Days Attendance Monitoring App
      </h1>

      <div className="flex items-center justify-center w-full max-w-5xl">
        <Link href="/student/register">
          <div className="bg-white shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 cursor-pointer ">
            <div className="p-10 text-center">
              <div className="mb-6">
                <i className="bi bi-person-add text-6xl text-indigo-500"></i>
              </div>
              <h3 className="text-2xl font-bold text-indigo-600">Student Registration</h3>
              <p className="text-gray-600 mt-4">
                Register to participate in IT Days and get your QR code.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

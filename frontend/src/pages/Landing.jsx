import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Smart Campus Connect</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to Smart Campus Connect
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Secure, verified internal communication platform for colleges. 
            Book appointments, chat with teachers, and manage your academic communications efficiently.
          </p>
          
          {/* Role Selection */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {/* Student Card */}
            <div className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="text-5xl mb-4">🎓</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Student</h2>
              <p className="text-gray-600 mb-6">
                View teachers, book appointments, and communicate with your professors.
              </p>
              <div className="space-y-3">
                <Link
                  to="/student/login"
                  className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/student/register"
                  className="block w-full bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>

            {/* Teacher Card */}
            <div className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="text-5xl mb-4">👨‍🏫</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Teacher</h2>
              <p className="text-gray-600 mb-6">
                Manage your availability, accept appointments, and chat with students.
              </p>
              <div className="space-y-3">
                <Link
                  to="/teacher/login"
                  className="block w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/teacher/register"
                  className="block w-full bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>

            {/* Admin Card */}
            <div className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="text-5xl mb-4">⚙️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin</h2>
              <p className="text-gray-600 mb-6">
                Upload student/teacher data, manage users, and view analytics.
              </p>
              <Link
               to="/admin/login"

                className="block w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Access</h3>
              <p className="text-gray-600">Only authorized users can join using USN or Staff ID</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Appointments</h3>
              <p className="text-gray-600">Book appointments with teachers easily</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Chat</h3>
              <p className="text-gray-600">Chat with teachers after appointment approval</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure</h3>
              <p className="text-gray-600">JWT authentication and role-based access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Smart Campus Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

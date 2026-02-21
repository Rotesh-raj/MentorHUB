import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { useState, useEffect } from 'react';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/student/appointments');
        setAppointments(response.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/student" className="text-xl font-bold">Smart Campus Connect</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/student/teachers" className="hover:bg-blue-700 px-3 py-2 rounded">Teachers</Link>
              <Link to="/student/appointments" className="hover:bg-blue-700 px-3 py-2 rounded">Appointments</Link>
              <Link to="/profile" className="hover:bg-blue-700 px-3 py-2 rounded">Profile</Link>
              <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">USN: {user?.referenceId}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/student/teachers" className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold text-gray-900">View Teachers</h3>
            <p className="text-gray-600 mt-2">Browse and find teachers</p>
          </Link>
          
          <Link to="/student/appointments" className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900">My Appointments</h3>
            <p className="text-gray-600 mt-2">View appointment history</p>
          </Link>
          
          <Link to="/profile" className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-gray-900">Profile</h3>
            <p className="text-gray-600 mt-2">Manage your profile</p>
          </Link>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Appointments</h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : appointments.length === 0 ? (
            <p className="text-gray-600 py-8 text-center">No appointments yet. Book an appointment with a teacher!</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{appointment.teacherId?.name || 'Teacher'}</h3>
                      <p className="text-sm text-gray-600">Topic: {appointment.topic}</p>
                      <p className="text-sm text-gray-600">Date: {new Date(appointment.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <Link to="/student/appointments" className="block text-center text-blue-600 hover:underline mt-4">
            View all appointments →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

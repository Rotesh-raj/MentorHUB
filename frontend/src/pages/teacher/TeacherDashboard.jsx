import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/teacher/appointments');
        const appointments = response.data;
        
        setStats({
          pending: appointments.filter(a => a.status === 'pending').length,
          approved: appointments.filter(a => a.status === 'approved').length,
          completed: appointments.filter(a => a.status === 'completed').length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/teacher" className="text-xl font-bold">Smart Campus Connect</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/teacher/requests" className="hover:bg-green-700 px-3 py-2 rounded">Requests</Link>
              <Link to="/teacher/schedule" className="hover:bg-green-700 px-3 py-2 rounded">Schedule</Link>
              <Link to="/teacher/availability" className="hover:bg-green-700 px-3 py-2 rounded">Availability</Link>
              <Link to="/profile" className="hover:bg-green-700 px-3 py-2 rounded">Profile</Link>
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
          <p className="text-gray-600 mt-2">Staff ID: {user?.referenceId} | Department: {user?.department}</p>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-yellow-50 rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-gray-600">Pending Requests</div>
            </div>
            
            <div className="bg-green-50 rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-gray-600">Approved Appointments</div>
            </div>
            
            <div className="bg-blue-50 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="text-3xl font-bold text-blue-600">{stats.completed}</div>
              <div className="text-gray-600">Completed Sessions</div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6">
          <Link to="/teacher/requests" className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900">Appointment Requests</h3>
            <p className="text-gray-600 mt-2">View and manage requests</p>
          </Link>
          
          <Link to="/teacher/schedule" className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900">Today's Schedule</h3>
            <p className="text-gray-600 mt-2">View today's appointments</p>
          </Link>
          
          <Link to="/teacher/availability" className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">⏰</div>
            <h3 className="text-xl font-semibold text-gray-900">Set Availability</h3>
            <p className="text-gray-600 mt-2">Manage your free slots</p>
          </Link>
          
          <Link to="/profile" className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-gray-900">Profile</h3>
            <p className="text-gray-600 mt-2">Manage your profile</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalAppointments: 0,
    pendingAppointments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
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
      <nav className="bg-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/admin" className="text-xl font-bold">Smart Campus Connect - Admin</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/admin/upload/students" className="hover:bg-purple-700 px-3 py-2 rounded">Upload Students</Link>
              <Link to="/admin/upload/teachers" className="hover:bg-purple-700 px-3 py-2 rounded">Upload Teachers</Link>
              <Link to="/admin/manage-users" className="hover:bg-purple-700 px-3 py-2 rounded">Manage Users</Link>
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
          <p className="text-gray-600 mt-2">Admin Dashboard</p>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="text-3xl font-bold text-blue-600">{stats.totalStudents}</div>
              <div className="text-gray-600">Total Students</div>
            </div>
            
            <div className="bg-green-50 rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="text-3xl font-bold text-green-600">{stats.totalTeachers}</div>
              <div className="text-gray-600">Total Teachers</div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <div className="text-3xl font-bold text-yellow-600">{stats.pendingAppointments}</div>
              <div className="text-gray-600">Pending Appointments</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="text-3xl font-bold text-purple-600">{stats.totalAppointments}</div>
              <div className="text-gray-600">Total Appointments</div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/admin/upload/students" className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900">Upload Students</h3>
            <p className="text-gray-600 mt-2">Add approved student list via CSV</p>
          </Link>
          
          <Link to="/admin/upload/teachers" className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold text-gray-900">Upload Teachers</h3>
            <p className="text-gray-600 mt-2">Add approved teacher list via CSV</p>
          </Link>
          
          <Link to="/admin/manage-users" className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold text-gray-900">Manage Users</h3>
            <p className="text-gray-600 mt-2">View and manage registered users</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

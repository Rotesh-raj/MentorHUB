import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import api from '../../api/axios';

const Profile = () => {
  const { user, logout } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to={user?.role === 'student' ? '/student' : user?.role === 'teacher' ? '/teacher' : '/admin'} className="text-xl font-bold">
                Smart Campus Connect
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to={user?.role === 'student' ? '/student' : user?.role === 'teacher' ? '/teacher' : '/admin'} className="hover:bg-gray-700 px-3 py-2 rounded">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-600">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600 capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-gray-600">Email:</div>
                <div className="col-span-2 text-gray-900">{user?.email}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-gray-600">{user?.role === 'student' ? 'USN:' : 'Staff ID:'}</div>
                <div className="col-span-2 text-gray-900">{user?.referenceId}</div>
              </div>
              
              {user?.department && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-gray-600">Department:</div>
                  <div className="col-span-2 text-gray-900">{user.department}</div>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-gray-600">Account Status:</div>
                <div className="col-span-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-6">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';

const AppointmentRequests = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const { success, error } = useNotification();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/teacher/appointments');
        setAppointments(response.data);
      } catch (err) {
        error('Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.patch(`/teacher/appointment/${id}`, { status });
      success(`Appointment ${status} successfully!`);
      setAppointments(appointments.map(apt => 
        apt._id === id ? { ...apt, status } : apt
      ));
    } catch (err) {
      error('Failed to update appointment');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAppointments = appointments.filter(apt => apt.status === filter);

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
              <Link to="/teacher" className="hover:bg-green-700 px-3 py-2 rounded">Dashboard</Link>
              <Link to="/teacher/schedule" className="hover:bg-green-700 px-3 py-2 rounded">Schedule</Link>
              <Link to="/teacher/availability" className="hover:bg-green-700 px-3 py-2 rounded">Availability</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Appointment Requests</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-gray-700 font-medium">Filter by Status:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No appointments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-green-600">
                          {appointment.studentId?.name?.charAt(0) || 'S'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.studentId?.name || 'Student'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          USN: {appointment.studentId?.referenceId || 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-900">Topic: {appointment.topic}</p>
                      {appointment.description && (
                        <p className="text-sm text-gray-600 mt-1">Description: {appointment.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Requested on: {new Date(appointment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    
                    {appointment.status === 'pending' && (
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, 'approved')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, 'rejected')}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    
                    {appointment.status === 'approved' && (
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Mark Complete
                        </button>
                        <Link
                          to={`/teacher/chat/${appointment.studentId?._id}`}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                        >
                          Chat
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentRequests;

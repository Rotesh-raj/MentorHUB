import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const { error } = useNotification();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const url = department 
          ? `/student/teachers?department=${department}` 
          : '/student/teachers';
        const response = await api.get('/student/teachers');

setTeachers(response.data);

        
        // Extract unique departments
        const uniqueDepts = [...new Set(response.data.map(t => t.department).filter(Boolean))];
        setDepartments(uniqueDepts);
      } catch (err) {
        error('Failed to fetch teachers');
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [department]);

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
              <Link to="/student" className="hover:bg-blue-700 px-3 py-2 rounded">Dashboard</Link>
              <Link to="/student/appointments" className="hover:bg-blue-700 px-3 py-2 rounded">Appointments</Link>
              <Link to="/profile" className="hover:bg-blue-700 px-3 py-2 rounded">Profile</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-gray-700 font-medium">Filter by Department:</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Teachers Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : teachers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No teachers found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <div key={teacher._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {teacher.name?.charAt(0) || 'T'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{teacher.name}</h3>
                    <p className="text-gray-600">{teacher.department}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    <span className="font-medium">Staff ID:</span> {teacher.referenceId}
                  </p>
                  
                  <div className="flex space-x-2">
                    <Link
                      to={`/student/book/${teacher._id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Book Appointment
                    </Link>
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

export default TeachersList;

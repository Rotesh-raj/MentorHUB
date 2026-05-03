import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import { 
  Search, 
  Filter, 
  User, 
  BookOpen, 
  BadgeCheck, 
  Calendar, 
  ChevronRight,
  GraduationCap,
  MapPin
} from 'lucide-react';

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const { error } = useNotification();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const url = department 
          ? `/student/teachers/department/${department}` 
          : '/student/teachers';
        const response = await api.get(url);
        setTeachers(response.data);

        // Extract unique departments from initial load
        if (!department) {
          const uniqueDepts = [...new Set(response.data.map(t => t.department).filter(Boolean))];
          setDepartments(uniqueDepts);
        }
      } catch (err) {
        error('Failed to fetch teachers');
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [department]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                MentorHub
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/student" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Dashboard</Link>
              <Link to="/student/appointments" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Appointments</Link>
              <Link to="/profile" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all">
                <User size={18} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Explore Mentors</h1>
              <p className="text-slate-500 mt-2 text-lg">Connect with expert faculty members across all departments.</p>
            </div>
            
            {/* Filter */}
            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 w-full md:w-72">
              <div className="pl-3 text-slate-400">
                <Filter size={18} />
              </div>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-slate-700 font-semibold w-full cursor-pointer outline-none"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
            <p className="text-slate-500 font-medium animate-pulse">Finding best mentors for you...</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Mentors Found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((teacher) => (
              <div 
                key={teacher._id} 
                className="group bg-white rounded-3xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden"
              >
                {/* Card Header/Image */}
                <div className="relative h-32 bg-gradient-to-r from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                  <div className="absolute -bottom-10 left-6">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
                      {teacher.profilePic ? (
                        <img src={teacher.profilePic} alt={teacher.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <User size={32} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                      {teacher.department}
                    </span>
                  </div>
                </div>

                <div className="p-6 pt-12">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {teacher.name}
                    </h3>
                    <BadgeCheck size={18} className="text-blue-500" />
                  </div>
                  
                  <p className="text-slate-500 text-sm line-clamp-2 min-h-[40px] mb-6">
                    {teacher.bio || `${teacher.name} is a dedicated educator in the ${teacher.department} department, specialized in academic guidance.`}
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-slate-600">
                      <BookOpen size={16} className="text-slate-400" />
                      <span className="text-xs font-medium">{teacher.specialization || 'General Academic Mentoring'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Calendar size={16} className="text-slate-400" />
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Available for Bookings</span>
                    </div>
                  </div>

                  <Link
                    to={`/student/book-appointment/${teacher._id}`}
                    className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all active:scale-95 group/btn"
                  >
                    <span>Book Appointment</span>
                    <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
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

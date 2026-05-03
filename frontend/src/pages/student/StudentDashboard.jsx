import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { useState, useEffect } from "react";
import RightMenu from "../components/RightMenu";
import AIInsightsPanel from "../components/AIInsightsPanel";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get("/student/appointments");
        setAppointments(response.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= NAVBAR ================= */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link to="/student" className="text-xl font-bold tracking-wide flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🎓</span>
              </div>
              MentorHub
            </Link>

            <div className="flex items-center space-x-4">
              <Link to="/student/teachers" className="hover:bg-blue-700 px-3 py-2 rounded">
                Teachers
              </Link>
              <Link to="/student/appointments" className="hover:bg-blue-700 px-3 py-2 rounded">
                Appointments
              </Link>
              <Link to="/profile" className="hover:bg-blue-700 px-3 py-2 rounded">
                Profile
              </Link>

              <RightMenu />

              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded shadow"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ===== AI Insights ===== */}
        <AIInsightsPanel />

        {/* ===== Student Info Card (Premium Design) ===== */}
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl border border-white/50 p-8 mb-8 transition-all hover:shadow-blue-500/10">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>

          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar Section */}
            <div className="flex-shrink-0 group">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-blue-500/20 transform transition-transform group-hover:scale-105 overflow-hidden border-4 border-white">
                {user?.profilePic ? (
                  <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0)
                )}
              </div>
              <div className="mt-3 text-center">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full tracking-wider uppercase">
                  Active
                </span>
              </div>
            </div>

            {/* Profile Content */}
            <div className="flex-grow text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                  {user?.name}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded-lg">
                    {user?.referenceId || "USN N/A"}
                  </span>
                  <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-lg">
                    {user?.college || "College N/A"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Course/Dept</p>
                  <p className="text-lg font-bold text-gray-800">{user?.department || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Academic Year</p>
                  <p className="text-lg font-bold text-gray-800">{user?.year || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Section</p>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold border border-blue-100">
                      {user?.section || "?"}
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                      {user?.section ? "Assigned" : "Pending"}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Email Address</p>
                  <p className="text-sm font-medium text-gray-600 truncate max-w-[150px]">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Quick Action Cards ===== */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Link
            to="/student/teachers"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
          >
            <div className="text-4xl mb-3">👨‍🏫</div>
            <h3 className="text-lg font-semibold">Browse Teachers</h3>
            <p className="text-gray-500 text-sm mt-2">
              Find and connect with faculty members
            </p>
          </Link>

          <Link
            to="/student/appointments"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
          >
            <div className="text-4xl mb-3">📅</div>
            <h3 className="text-lg font-semibold">My Appointments</h3>
            <p className="text-gray-500 text-sm mt-2">
              Track your bookings and status
            </p>
          </Link>

          <Link
            to="/profile"
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition"
          >
            <div className="text-4xl mb-3">👤</div>
            <h3 className="text-lg font-semibold">Manage Profile</h3>
            <p className="text-gray-500 text-sm mt-2">
              Update your account details
            </p>
          </Link>
        </div>

        {/* ===== Recent Appointments ===== */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Recent Appointments
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : appointments.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No appointments yet. Book one now!
            </p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="border border-gray-200 rounded-lg p-5 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {appointment.teacherId?.name || "Teacher"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Topic: {appointment.topic}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(appointment.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Link
            to="/student/appointments"
            className="block text-center text-blue-600 hover:underline mt-6"
          >
            View All Appointments →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
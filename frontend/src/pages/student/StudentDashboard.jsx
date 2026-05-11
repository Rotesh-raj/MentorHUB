import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sparkles, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import RightMenu from "../components/RightMenu";
import AIInsightsPanel from "../components/AIInsightsPanel";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const getStatusVariant = (status) => {
    switch (status) {
      case "pending": return "warning";
      case "approved": return "success";
      case "rejected": return "danger";
      case "completed": return "primary";
      default: return "neutral";
    }
  };

  const navLinks = [
    { to: "/student/teachers", label: "Teachers" },
    { to: "/student/appointments", label: "Appointments" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ================= NAVBAR ================= */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link to="/student" className="text-xl font-black text-primary-600 flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
                  <span className="text-white text-xs">MH</span>
                </div>
                <span className="hidden sm:inline">MentorHub</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map(link => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  className="px-4 py-2 text-sm font-bold text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-6 w-px bg-neutral-200 mx-2" />
              <div className="flex items-center gap-3">
                <RightMenu />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-red-600 hover:bg-red-50"
                >
                  Logout
                </Button>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <RightMenu />
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-neutral-100 overflow-hidden bg-white"
            >
              <div className="px-4 py-6 space-y-2">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-base font-bold text-neutral-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 text-base font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  Logout Session
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>


      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ===== AI Insights ===== */}
        <AIInsightsPanel />

        {/* ===== Student Info Card (Premium Design) ===== */}
        <Card className="mb-8 relative overflow-hidden group">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-colors duration-500"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-accent-500/5 rounded-full blur-3xl group-hover:bg-accent-500/10 transition-colors duration-500"></div>

          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar Section */}
            <div className="flex-shrink-0 group">
              <div className="w-28 h-28 bg-gradient-to-br from-primary-600 to-accent-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-primary-500/20 transform transition-transform group-hover:scale-105 overflow-hidden border-4 border-white">
                {user?.profilePic ? (
                  <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0)
                )}
              </div>
              <div className="mt-4 text-center">
                <Badge variant="success">Active</Badge>
              </div>
            </div>

            {/* Profile Content */}
            <div className="flex-grow text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
                <h1 className="text-4xl font-black text-neutral-900 tracking-tight">
                  {user?.name}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <Badge variant="neutral">{user?.referenceId || "USN N/A"}</Badge>
                  <Badge variant="primary">{user?.college || "College N/A"}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black text-neutral-400 tracking-widest">Course/Dept</p>
                  <p className="text-lg font-bold text-neutral-800">{user?.department || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black text-neutral-400 tracking-widest">Academic Year</p>
                  <p className="text-lg font-bold text-neutral-800">{user?.year || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black text-neutral-400 tracking-widest">Section</p>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="w-8 h-8 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center font-black border border-primary-100">
                      {user?.section || "?"}
                    </span>
                    <Badge variant={user?.section ? "success" : "warning"}>
                      {user?.section ? "Assigned" : "Pending"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black text-neutral-400 tracking-widest">Email Address</p>
                  <p className="text-sm font-medium text-neutral-500 truncate max-w-[150px] mx-auto md:mx-0">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ===== Quick Action Cards ===== */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Link to="/student/teachers">
            <Card className="h-full hover:-translate-y-1 transition-all duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👨‍🏫</div>
              <h3 className="text-lg font-black text-neutral-900">Browse Teachers</h3>
              <p className="text-neutral-400 text-sm mt-2 font-medium">
                Find and connect with faculty members
              </p>
            </Card>
          </Link>

          <Link to="/student/appointments">
            <Card className="h-full hover:-translate-y-1 transition-all duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📅</div>
              <h3 className="text-lg font-black text-neutral-900">My Appointments</h3>
              <p className="text-neutral-400 text-sm mt-2 font-medium">
                Track your bookings and status
              </p>
            </Card>
          </Link>

          <Link to="/profile">
            <Card className="h-full hover:-translate-y-1 transition-all duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👤</div>
              <h3 className="text-lg font-black text-neutral-900">Manage Profile</h3>
              <p className="text-neutral-400 text-sm mt-2 font-medium">
                Update your account details
              </p>
            </Card>
          </Link>
        </div>

        {/* ===== Recent Appointments ===== */}
        <Card className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-neutral-900">
              Recent Appointments
            </h2>
            <Link to="/student/appointments">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-400 font-medium">
                No appointments yet. Book one now!
              </p>
              <Link to="/student/teachers" className="mt-4 inline-block">
                <Button variant="primary">Browse Teachers</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="group border border-neutral-100 rounded-2xl p-5 flex justify-between items-center hover:bg-neutral-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 font-black">
                      {appointment.teacherId?.name?.charAt(0) || "T"}
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900">
                        {appointment.teacherId?.name || "Teacher"}
                      </h3>
                      <p className="text-xs text-neutral-400 font-medium">
                        Topic: {appointment.topic} • {new Date(appointment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Badge variant={getStatusVariant(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
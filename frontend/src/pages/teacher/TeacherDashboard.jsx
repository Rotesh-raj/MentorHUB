import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Clock, Calendar, User as UserIcon, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import RightMenu from '../components/RightMenu';
import AIInsightsPanel from '../components/AIInsightsPanel';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const navLinks = [
    { to: "/teacher/requests", label: "Requests", icon: Users },
    { to: "/teacher/schedule", label: "Schedule", icon: Calendar },
    { to: "/teacher/availability", label: "Availability", icon: Clock },
    { to: "/profile", label: "Profile", icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navbar */}
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
              <Link to="/teacher" className="text-xl font-black text-secondary-600 flex items-center gap-2">
                <div className="w-8 h-8 bg-secondary-600 rounded-lg flex items-center justify-center shadow-lg shadow-secondary-500/20">
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
                  className="px-4 py-2 text-sm font-bold text-neutral-600 hover:text-secondary-600 hover:bg-secondary-50 rounded-xl transition-all flex items-center gap-2"
                >
                  <link.icon size={16} />
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
                    className="flex items-center gap-3 px-4 py-3 text-base font-bold text-neutral-600 hover:bg-secondary-50 hover:text-secondary-600 rounded-xl transition-all"
                  >
                    <link.icon size={20} />
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={logout}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 text-base font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut size={20} />
                  Logout Session
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Insights */}
        <AIInsightsPanel />

        {/* Welcome Section */}
        <Card className="mb-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-secondary-500/10 transition-colors duration-500"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-white shadow-premium bg-neutral-50 flex-shrink-0">
              {user?.profilePic ? (
                <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-secondary-50 flex items-center justify-center text-secondary-600 text-4xl font-black">
                  {user?.name?.charAt(0)}
                </div>
              )}
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Welcome, {user?.name}!</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <Badge variant="neutral">Staff ID: {user?.referenceId}</Badge>
                <Badge variant="secondary">Dept: {user?.department}</Badge>
                <Badge variant="success">Active Status</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        {!loading && (
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Card className="group hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                  <Clock size={24} />
                </div>
                <Badge variant="warning">Action Needed</Badge>
              </div>
              <p className="text-3xl font-black text-neutral-900 mb-1">{stats.pending}</p>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Pending Requests</p>
            </Card>
            
            <Card className="group hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-secondary-50 rounded-2xl flex items-center justify-center text-secondary-600">
                  <Calendar size={24} />
                </div>
                <Badge variant="secondary">Scheduled</Badge>
              </div>
              <p className="text-3xl font-black text-neutral-900 mb-1">{stats.approved}</p>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Approved Appointments</p>
            </Card>
            
            <Card className="group hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                  <CheckCircle size={24} />
                </div>
                <Badge variant="primary">Archive</Badge>
              </div>
              <p className="text-3xl font-black text-neutral-900 mb-1">{stats.completed}</p>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Completed Sessions</p>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Link to="/teacher/requests" className="group">
            <Card className="h-full hover:-translate-y-1 transition-all duration-300 group hover:border-secondary-100">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📋</div>
              <h3 className="text-sm font-black text-neutral-900 mb-1">Requests</h3>
              <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Manage Applications</p>
            </Card>
          </Link>
          
          <Link to="/teacher/schedule" className="group">
            <Card className="h-full hover:-translate-y-1 transition-all duration-300 group hover:border-secondary-100">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📅</div>
              <h3 className="text-sm font-black text-neutral-900 mb-1">Schedule</h3>
              <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Today's Timeline</p>
            </Card>
          </Link>
          
          <Link to="/teacher/availability" className="group">
            <Card className="h-full hover:-translate-y-1 transition-all duration-300 group hover:border-secondary-100">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⏰</div>
              <h3 className="text-sm font-black text-neutral-900 mb-1">Availability</h3>
              <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Time Management</p>
            </Card>
          </Link>
          
          <Link to="/profile" className="group">
            <Card className="h-full hover:-translate-y-1 transition-all duration-300 group hover:border-secondary-100">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👤</div>
              <h3 className="text-sm font-black text-neutral-900 mb-1">Profile</h3>
              <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Account Settings</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

// CheckCircle icon is missing from imports, adding it
const CheckCircle = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default TeacherDashboard;

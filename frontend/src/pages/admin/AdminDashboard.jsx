import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import Sidebar from "./Sidebar";
import AIInsightsPanel from "../components/AIInsightsPanel";
import {
  GraduationCap, BookOpen, Users, CalendarCheck,
  Upload, Bell, LogOut, TrendingUp, Clock, CheckCircle, ArrowRight
} from "lucide-react";

/* ─── Skeleton loader ─── */
const StatSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-xl" />
      <div className="w-16 h-4 bg-gray-200 rounded" />
    </div>
    <div className="w-16 h-8 bg-gray-200 rounded mb-1" />
    <div className="w-24 h-3 bg-gray-100 rounded" />
  </div>
);

/* ─── Stat Card ─── */
const StatCard = ({ label, value, icon: Icon, color, bg, trend }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
        <Icon size={22} className={color} />
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 text-emerald-500 text-xs font-medium bg-emerald-50 px-2 py-1 rounded-full">
          <TrendingUp size={12} />
          <span>Active</span>
        </div>
      )}
    </div>
    <p className="text-3xl font-bold text-gray-800 mb-1">{value ?? '—'}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

/* ─── Quick Action Card ─── */
const ActionCard = ({ to, icon: Icon, label, desc, color, bg }) => (
  <Link to={to} className="group">
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full">
      <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
        <Icon size={22} className={color} />
      </div>
      <h3 className="text-gray-800 font-semibold text-sm mb-1">{label}</h3>
      <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
      <div className={`mt-4 flex items-center gap-1 text-xs font-medium ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
        <span>Open</span>
        <ArrowRight size={12} />
      </div>
    </div>
  </Link>
);

/* ══════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════ */
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();

  const [stats, setStats] = useState({
    students: 0, teachers: 0, appointments: 0, pendingAppointments: 0
  });
  const [loading, setLoading]           = useState(true);
  const [showProfile, setShowProfile]   = useState(false);
  const [showNotif, setShowNotif]       = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Stats fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const isDashboard = location.pathname === "/admin";

  const handleLogout = () => {
    logout();
    navigate("/admin-auth");
  };

  /* ── page title from route ── */
  const pageTitle = (() => {
    if (location.pathname === "/admin") return "Dashboard";
    if (location.pathname.includes("students")) return "Upload Students";
    if (location.pathname.includes("teachers")) return "Upload Teachers";
    if (location.pathname.includes("manage"))   return "Manage Users";
    return "Admin";
  })();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">

        {/* ───── TOP NAVBAR ───── */}
        <header className="bg-white border-b border-gray-100 shadow-sm px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          {/* Left: breadcrumb */}
          <div className="flex items-center gap-2 pl-10 lg:pl-0">
            <span className="text-xs text-gray-400 hidden sm:block">Admin</span>
            <span className="text-gray-300 hidden sm:block">/</span>
            <span className="text-sm font-semibold text-gray-700">{pageTitle}</span>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">

            {/* Notification bell */}
            <div className="relative">
              <button
                id="notif-btn"
                onClick={() => { setShowNotif(p => !p); setShowProfile(false); }}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors relative"
              >
                <Bell size={18} />
                {stats.pendingAppointments > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">Notifications</p>
                  {stats.pendingAppointments > 0 ? (
                    <div className="px-4 py-3 hover:bg-gray-50 rounded-xl mx-2 flex items-start gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock size={14} className="text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{stats.pendingAppointments} pending appointments</p>
                        <p className="text-xs text-gray-400 mt-0.5">Awaiting action</p>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <CheckCircle size={24} className="text-emerald-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">All caught up!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                id="profile-btn"
                onClick={() => { setShowProfile(p => !p); setShowNotif(false); }}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ───── MAIN CONTENT ───── */}
        <main className="flex-1 p-6 overflow-auto" onClick={() => { setShowProfile(false); setShowNotif(false); }}>

          {/* ── DASHBOARD HOME ── */}
          {isDashboard && (
            <>
              {/* Welcome Banner */}
              <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 rounded-2xl p-6 mb-8 overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl" />

                <div className="relative">
                  <p className="text-blue-300 text-sm font-medium mb-1">{today}</p>
                  <h1 className="text-white text-3xl font-bold mb-2 flex items-center gap-2">
                    {user?.department} Department Admin
                  </h1>
                  <div className="space-y-1">
                    <p className="text-blue-100 font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      {user?.college}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      to="/admin/upload/students"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-xl transition-colors"
                    >
                      <Upload size={13} /> Upload CSV
                    </Link>
                    <Link
                      to="/admin/manage-users"
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-4 py-2 rounded-xl transition-colors"
                    >
                      <Users size={13} /> Manage Users
                    </Link>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <AIInsightsPanel />

              {/* ── STAT CARDS ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {loading ? (
                  [1,2,3,4].map(i => <StatSkeleton key={i} />)
                ) : (
                  <>
                    <StatCard
                      label="Total Students"
                      value={stats.students}
                      icon={GraduationCap}
                      color="text-blue-600"
                      bg="bg-blue-50"
                      trend
                    />
                    <StatCard
                      label="Total Teachers"
                      value={stats.teachers}
                      icon={BookOpen}
                      color="text-emerald-600"
                      bg="bg-emerald-50"
                      trend
                    />
                    <StatCard
                      label="Pending Appointments"
                      value={stats.pendingAppointments}
                      icon={Clock}
                      color="text-amber-600"
                      bg="bg-amber-50"
                    />
                    <StatCard
                      label="Total Appointments"
                      value={stats.appointments}
                      icon={CalendarCheck}
                      color="text-violet-600"
                      bg="bg-violet-50"
                      trend
                    />
                  </>
                )}
              </div>

              {/* ── QUICK ACTIONS ── */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-800">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <ActionCard
                    to="/admin/upload/students"
                    icon={GraduationCap}
                    label="Upload Students"
                    desc="Import student records via CSV file"
                    color="text-blue-600"
                    bg="bg-blue-50"
                  />
                  <ActionCard
                    to="/admin/upload/teachers"
                    icon={BookOpen}
                    label="Upload Teachers"
                    desc="Import teacher records via CSV file"
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                  />
                  <ActionCard
                    to="/admin/manage-users"
                    icon={Users}
                    label="Manage Users"
                    desc="Approve or reject user registrations"
                    color="text-violet-600"
                    bg="bg-violet-50"
                  />
                </div>
              </div>

              {/* ── STATUS STRIP ── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Campus Status",    value: "Online",   dot: "bg-emerald-400", text: "text-emerald-600" },
                  { label: "Database",          value: "Connected", dot: "bg-emerald-400", text: "text-emerald-600" },
                  { label: "Approval Queue",    value: stats.pendingAppointments > 0 ? `${stats.pendingAppointments} pending` : "All clear", dot: stats.pendingAppointments > 0 ? "bg-amber-400" : "bg-emerald-400", text: stats.pendingAppointments > 0 ? "text-amber-600" : "text-emerald-600" },
                ].map(s => (
                  <div key={s.label} className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">
                    <span className="text-xs text-gray-500">{s.label}</span>
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${s.text}`}>
                      <span className={`w-2 h-2 rounded-full ${s.dot} animate-pulse`} />
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── NESTED ROUTE OUTLET ── */}
          {!isDashboard && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[60vh]">
              <Outlet />
            </div>
          )}

          {/* Always render outlet (hidden when at root for layout) */}
          {isDashboard && (
            <div className="hidden">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
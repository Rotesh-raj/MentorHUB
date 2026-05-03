import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Code2,
  Headphones,
  LifeBuoy,
  MessageCircleHeart,
  Home,
  ShieldCheck,
  FileText,
  Github,
  Linkedin,
  User as UserIcon,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Bell,
  Settings
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function RightMenu() {
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      name: "Home",
      path: "/",
      icon: Home,
      color: "text-blue-400 bg-blue-500/10",
    },
    {
      name: "Developer Details",
      path: "/developer",
      icon: Code2,
      color: "text-indigo-400 bg-indigo-500/10",
    },
    {
      name: "Contact Us",
      path: "/contact",
      icon: Headphones,
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      name: "Help & Support",
      path: "/help",
      icon: LifeBuoy,
      color: "text-purple-400 bg-purple-500/10",
    },
    {
      name: "Feedback",
      path: "/feedback",
      icon: MessageCircleHeart,
      color: "text-orange-400 bg-orange-500/10",
    },
  ];

  const legalItems = [
    {
      name: "Privacy Policy",
      path: "/privacy-policy",
      icon: ShieldCheck,
    },
    {
      name: "Terms & Conditions",
      path: "/terms-and-conditions",
      icon: FileText,
    },
  ];

  const handleLogout = () => {
    logout();
    setOpenMenu(false);
    navigate("/");
  };

  // Close menu on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpenMenu(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* ================= MENU TRIGGER (AVATAR) ================= */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpenMenu(true)}
        className="relative group focus:outline-none z-30"
      >
        <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl transition-all group-hover:border-blue-400 group-hover:shadow-blue-500/20">
          {user?.profilePic ? (
            <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black">
              {user?.name?.charAt(0) || <UserIcon size={18} />}
            </div>
          )}
        </div>
        {user && (
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
        )}
      </motion.button>

      {/* ================= OVERLAY ================= */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[60]"
            onClick={() => setOpenMenu(false)}
          />
        )}
      </AnimatePresence>

      {/* ================= SIDEBAR ================= */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[320px] bg-slate-900 border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-[70] flex flex-col"
          >
            {/* ===== HEADER / BRAND ===== */}
            <div className="p-6 pb-4 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-white font-black text-sm tracking-tighter">MH</span>
                </div>
                <div>
                  <h2 className="text-white font-black tracking-tight text-lg leading-tight">MentorHub</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">SaaS Communication</p>
                </div>
              </div>
              <motion.button
                whileHover={{ rotate: 90, backgroundColor: "rgba(255,255,255,0.05)" }}
                onClick={() => setOpenMenu(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* ===== USER CARD (IF LOGGED IN) ===== */}
            {user && (
              <div className="px-6 py-6 border-b border-white/5">
                <div className="bg-white/5 rounded-3xl p-4 border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-blue-600/10 transition-colors" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/10 shadow-inner bg-slate-800">
                      {user.profilePic ? (
                        <img src={user.profilePic} alt="Me" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-blue-400 font-bold">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold truncate text-sm">{user.name}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{user.role}</p>
                    </div>
                    <Link to="/profile" onClick={() => setOpenMenu(false)} className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* ===== MAIN NAVIGATION ===== */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-hide">
              {/* Menu Section */}
              <div className="space-y-1">
                <p className="px-3 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Navigation</p>
                {user && (
                   <Link
                    to={user.role === 'student' ? '/student' : user.role === 'teacher' ? '/teacher' : '/admin'}
                    onClick={() => setOpenMenu(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 group ${
                      location.pathname.startsWith('/student') || location.pathname.startsWith('/teacher') || location.pathname.startsWith('/admin')
                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                        : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                    }`}
                  >
                    <div className={`p-2 rounded-xl bg-blue-500/10 text-blue-400`}>
                      <LayoutDashboard size={18} />
                    </div>
                    <span className="font-bold text-sm">Dashboard</span>
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </Link>
                )}
                
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={index}
                      to={item.path}
                      onClick={() => setOpenMenu(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 group ${
                        isActive
                          ? "bg-white/5 text-white border border-white/10"
                          : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${item.color} group-hover:scale-110 transition-transform`}>
                        <Icon size={18} />
                      </div>
                      <span className="font-bold text-sm">{item.name}</span>
                      {isActive && (
                        <motion.div 
                          layoutId="active-nav"
                          className="ml-auto w-1 h-4 bg-blue-500 rounded-full" 
                        />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Legal Section */}
              <div className="space-y-1">
                <p className="px-3 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Institutional</p>
                {legalItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={() => setOpenMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all text-sm font-medium"
                  >
                    <item.icon size={16} />
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Socials Section */}
              <div className="flex items-center gap-2 px-3 pt-4">
                <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                  <Github size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            {/* ===== FOOTER ACTIONS ===== */}
            <div className="p-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-sm">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl font-black text-sm transition-all active:scale-[0.98] border border-red-500/20 hover:border-red-500 group"
                >
                  <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                  Logout Session
                </button>
              ) : (
                <div className="text-center space-y-4">
                   <Link
                    to="/student/login"
                    onClick={() => setOpenMenu(false)}
                    className="w-full flex items-center justify-center py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20"
                  >
                    Get Started
                  </Link>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                    © 2026 MentorHub Platform
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
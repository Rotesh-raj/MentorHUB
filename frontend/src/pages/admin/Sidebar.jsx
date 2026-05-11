import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Upload, Users, BookOpen, GraduationCap,
  LogOut, Menu, X, ChevronRight, Bell, Settings
} from 'lucide-react';

const menuItems = [
  { path: '/admin',                  label: 'Dashboard',       icon: LayoutDashboard },
  { path: '/admin/upload/students',  label: 'Upload Students', icon: GraduationCap },
  { path: '/admin/upload/teachers',  label: 'Upload Teachers', icon: BookOpen },
  { path: '/admin/manage-users',     label: 'Manage Users',    icon: Users },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin-auth');
  };

  const NavLink = ({ item }) => {
    const Icon = item.icon;
    const active = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={() => setIsOpen(false)}
        className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
          active
            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Icon size={18} className={active ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
        <span className="uppercase tracking-widest text-[11px]">{item.label}</span>
        {active && <ChevronRight size={14} className="ml-auto opacity-70" />}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <span className="text-white font-black text-sm">MH</span>
          </div>
          <div>
            <p className="text-white font-black text-sm leading-tight uppercase tracking-widest">MentorHub</p>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Admin Info */}
      <div className="px-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-slate-700 flex items-center justify-center text-primary-500 font-black text-sm flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-black truncate uppercase tracking-widest">{user?.name || 'Admin'}</p>
            <p className="text-slate-500 text-[10px] truncate font-medium">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider px-4 mb-3">Main Menu</p>
        {menuItems.map(item => <NavLink key={item.path} item={item} />)}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile close button */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="fixed top-4 right-4 z-[60] lg:hidden w-10 h-10 bg-slate-800 text-white rounded-xl flex items-center justify-center"
        >
          <X size={20} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;

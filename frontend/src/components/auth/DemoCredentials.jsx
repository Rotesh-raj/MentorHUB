import React from 'react';
import { Copy, Check, LogIn, ShieldCheck, User, BookOpen, LayoutDashboard, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DemoCredentials = ({ role, onAutoFill }) => {
  const [copied, setCopied] = React.useState(false);

  const credentials = {
    student: {
      email: 'student@mentorhub.com',
      password: 'student123',
      color: 'from-blue-500 to-indigo-600',
      icon: <User className="w-5 h-5" />,
      label: 'Student Demo'
    },
    teacher: {
      email: 'teacher@mentorhub.com',
      password: 'teacher123',
      color: 'from-emerald-500 to-teal-600',
      icon: <BookOpen className="w-5 h-5" />,
      label: 'Teacher Demo'
    },
    admin: {
      email: 'admin@mentorhub.com',
      password: 'admin123',
      color: 'from-violet-500 to-purple-600',
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Admin Demo'
    },
    superadmin: {
      email: 'superadmin@mentorhub.com',
      password: 'super123',
      color: 'from-amber-500 to-orange-600',
      icon: <Star className="w-5 h-5" />,
      label: 'SuperAdmin Demo'
    }
  };

  const current = credentials[role] || credentials.student;

  const handleCopy = () => {
    navigator.clipboard.writeText(`Email: ${current.email}\nPassword: ${current.password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 mb-4 overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl"
    >
      <div className={`bg-gradient-to-r ${current.color} p-4 text-white flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            {current.icon}
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider">{current.label}</h4>
            <p className="text-[10px] text-white/70 font-medium tracking-tight">Quick Access for Presentation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors group relative"
            title="Copy Credentials"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute -top-8 right-0 bg-black text-white text-[10px] py-1 px-2 rounded-md font-bold whitespace-nowrap"
                >
                  COPIED!
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Email</span>
            <code className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md block truncate">
              {current.email}
            </code>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Password</span>
            <code className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md block truncate">
              {current.password}
            </code>
          </div>
        </div>

        <button
          onClick={() => onAutoFill(current.email, current.password)}
          className={`w-full py-3 rounded-xl bg-gradient-to-r ${current.color} text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all group`}
        >
          <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          One-Click Demo Login
        </button>
      </div>
      
      <div className="bg-slate-50/50 border-t border-slate-100 p-2 text-center">
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Security Validation Bypassed for Demo
        </p>
      </div>
    </motion.div>
  );
};

export default DemoCredentials;

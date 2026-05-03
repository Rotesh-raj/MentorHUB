import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import RightMenu from "./components/RightMenu";
import { 
  Bot, CalendarDays, MessageSquare, ShieldCheck, UploadCloud, 
  GraduationCap, Users, Settings, ArrowRight, Sparkles, 
  CheckCircle2, LayoutDashboard, Moon, Sun, Shield, UserCheck, Search, Bell,
  Calendar, Mail
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('dsi-theme');
    if (savedTheme === 'dark') setIsDark(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('dsi-theme', newTheme ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} font-sans transition-colors duration-500 overflow-x-hidden`}>
      
      {/* 1. Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? (isDark ? 'bg-slate-900/80 backdrop-blur-lg shadow-lg shadow-black/20 py-3' : 'bg-white/80 backdrop-blur-lg shadow-lg shadow-slate-200/50 py-3') : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
               <GraduationCap className="text-white" size={24} />
            </div>
            <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              MentorHub
            </span>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800 text-yellow-400' : 'hover:bg-slate-200 text-slate-500'}`}>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="hidden md:flex items-center gap-4">
               <Link to="/student/login" className={`font-medium px-4 py-2 rounded-lg transition-colors ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>Log in</Link>
               <Link to="/student/register" className="font-medium px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95">Get Started</Link>
            </div>
            <div className={isDark ? "dark-menu" : ""}>
               <RightMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] opacity-40 pointer-events-none">
          <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-blue-600/20 via-indigo-900/10' : 'from-blue-400/20 via-indigo-200/10'} to-transparent blur-3xl rounded-full`} />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 shadow-sm border ${isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-100'}`}
            >
              <Sparkles size={16} />
              <span>Institutional AI Connection Platform</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight"
            >
              Connecting Campus <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                Life Intelligently
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-lg md:text-xl mb-10 max-w-3xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
            >
              An AI-powered appointment management system designed for seamless interaction between students, teachers, and departments with multi-role secure verification.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/student/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 group text-lg">
                Start Connecting <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#about" className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold transition-all hover:-translate-y-1 flex items-center justify-center gap-2 border ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-lg shadow-slate-200/50'} text-lg`}>
                Learn More
              </a>
            </motion.div>
          </div>

          {/* Hero Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className={`relative rounded-2xl border ${isDark ? 'border-slate-700 bg-slate-800/40' : 'border-slate-200 bg-white/40'} backdrop-blur-xl p-3 md:p-4 shadow-2xl`}>
              <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-slate-50'} border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <div className={`flex items-center gap-2 px-4 py-3 border-b ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className={`mx-auto px-6 py-1 rounded-md text-xs font-medium ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                    smart-campus-connect.edu
                  </div>
                </div>
                <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 opacity-95">
                   <div className={`lg:col-span-2 rounded-2xl p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} border shadow-sm`}>
                     <div className="flex justify-between items-center mb-6">
                       <h3 className="font-semibold text-lg">Appointment Flow</h3>
                       <span className="text-blue-500 text-sm font-bold bg-blue-50 px-2 py-1 rounded-md">Live Preview</span>
                     </div>
                     <div className="space-y-4">
                        <div className={`p-4 rounded-xl flex items-center justify-between ${isDark ? 'bg-slate-700/40' : 'bg-slate-50'} border border-transparent hover:border-blue-400/30 transition-all`}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Search size={18}/></div>
                            <div>
                              <p className="font-semibold text-sm">Find Teacher</p>
                              <p className="text-xs text-slate-500 italic">Institutional CSV verification</p>
                            </div>
                          </div>
                          <CheckCircle2 size={18} className="text-emerald-500" />
                        </div>
                        <div className={`p-4 rounded-xl flex items-center justify-between ${isDark ? 'bg-slate-700/40' : 'bg-slate-50'} border border-transparent hover:border-blue-400/30 transition-all`}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><Calendar size={18}/></div>
                            <div>
                              <p className="font-semibold text-sm">Book Slot</p>
                              <p className="text-xs text-slate-500 italic">Slot duplication prevention</p>
                            </div>
                          </div>
                          <CheckCircle2 size={18} className="text-emerald-500" />
                        </div>
                        <div className={`p-4 rounded-xl flex items-center justify-between ${isDark ? 'bg-slate-700/40' : 'bg-slate-50'} border border-transparent hover:border-blue-400/30 transition-all`}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Bell size={18}/></div>
                            <div>
                              <p className="font-semibold text-sm">Email Notification</p>
                              <p className="text-xs text-slate-500 italic">Teacher receives instant update</p>
                            </div>
                          </div>
                          <CheckCircle2 size={18} className="text-emerald-500" />
                        </div>
                     </div>
                   </div>
                   <div className={`rounded-2xl p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} border shadow-sm flex flex-col`}>
                      <div className="flex items-center gap-2 mb-6">
                        <Bot className="text-blue-500" size={24} />
                        <h3 className="font-semibold text-lg">AI Support</h3>
                      </div>
                      <div className={`flex-1 rounded-xl p-4 mb-4 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'} text-sm space-y-4`}>
                        <div className="flex gap-3">
                           <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white shadow-md"><Bot size={16}/></div>
                           <div className={`p-3 rounded-2xl rounded-tl-sm ${isDark ? 'bg-slate-700 text-slate-200' : 'bg-white text-slate-700'} shadow-sm text-xs`}>
                             Academic content verified. AI responses are assistive guidance only.
                           </div>
                        </div>
                      </div>
                      <div className="mt-auto space-y-2">
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-3/4"></div>
                        </div>
                        <p className="text-[10px] text-center text-slate-400 uppercase tracking-tighter font-bold">Verification Secure</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Role-Based Management System */}
      <section id="about" className={`py-24 relative ${isDark ? 'bg-slate-900 border-t border-slate-800' : 'bg-white border-t border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6">MentorHub: Five Roles. One Ecosystem.</h2>
            <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              MentorHub operates using five secure role levels to maintain institutional authenticity and academic integrity.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { role: "Student", icon: GraduationCap, color: "bg-blue-500", desc: "Book appointments, chat in real-time, and get AI guidance." },
              { role: "Teacher", icon: Users, color: "bg-emerald-500", desc: "Manage availability, approve requests via instant email." },
              { role: "Admin", color: "bg-purple-500", icon: Settings, desc: "Manage departmental data and CSV institutional records." },
              { role: "Dept SuperAdmin", color: "bg-pink-500", icon: ShieldCheck, desc: "Verify Admin registrations and validate CSV records." },
              { role: "Main SuperAdmin", color: "bg-slate-800", icon: Shield, desc: "Platform-wide monitoring and institutional activation." },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-3xl border flex flex-col items-center text-center ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} hover:shadow-xl transition-all group`}
              >
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon size={24} />
                </div>
                <h3 className="font-bold mb-2 text-sm uppercase tracking-wider">{item.role}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Feature Highlights */}
      <section className={`py-24 ${isDark ? 'bg-slate-800/30' : 'bg-slate-50/50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
               <h2 className="text-3xl md:text-5xl font-black leading-tight">
                 Institutional Integrity <br/>
                 <span className="text-blue-600">Built In.</span>
               </h2>
               <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0"><Shield size={20}/></div>
                    <div>
                      <h4 className="font-bold mb-1">CSV-Backed Registration</h4>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Accounts are only activated if data matches approved departmental CSV records, preventing fake registrations.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0"><CalendarDays size={20}/></div>
                    <div>
                      <h4 className="font-bold mb-1">Slot Duplication Prevention</h4>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Once a student books a specific slot, it becomes unavailable to others, ensuring zero scheduling conflicts.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0"><Mail size={20}/></div>
                    <div>
                      <h4 className="font-bold mb-1">Instant Email Alerts</h4>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Teachers review appointment topics directly from their inbox and approve or reject efficiently.</p>
                    </div>
                  </div>
               </div>
            </div>
            <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-2xl relative overflow-hidden`}>
               <div className="absolute top-0 right-0 p-4"><Bot className="text-blue-500 opacity-20" size={120} /></div>
               <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 relative z-10"><MessageSquare className="text-blue-500" /> Secure Real-Time Chat</h3>
               <div className="space-y-4 relative z-10">
                 <div className={`p-4 rounded-2xl rounded-bl-sm ${isDark ? 'bg-slate-700' : 'bg-slate-50'} text-sm max-w-[80%]`}>
                    Hello Prof, I had a doubt regarding the project architecture.
                 </div>
                 <div className={`p-4 rounded-2xl rounded-br-sm bg-blue-600 text-white text-sm max-w-[80%] ml-auto shadow-lg`}>
                    Sure! Let's discuss this tomorrow at our scheduled appointment.
                 </div>
                 <div className="text-center pt-4">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Academic Purposes Only</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Professional Tagline CTA */}
      <section className="py-20 bg-blue-600 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 italic">"Empowering Academic Communication Through MentorHub."</h2>
          <p className="text-blue-100 mb-8 text-lg">MentorHub: Connecting Students, Teachers, and Departments Smarter 🚀</p>
          <Link to="/student/register" className="inline-block px-10 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all hover:shadow-xl hover:-translate-y-1">
             Join the Connection Now
          </Link>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className={`${isDark ? 'bg-slate-950 border-t border-slate-900 text-slate-400' : 'bg-slate-900 text-slate-400'} pt-20 pb-10`}>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 text-white mb-6">
               <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg"><GraduationCap size={24} className="text-white" /></div>
               <span className="text-2xl font-bold tracking-tight">MentorHub</span>
            </div>
            <p className="mb-8 leading-relaxed text-slate-400 max-w-md">
              A secure, multi-role academic appointment and real-time communication platform built to improve interaction within educational ecosystems.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Portals</h4>
            <ul className="space-y-3">
              <li><Link to="/student/login" className="hover:text-blue-400 transition-colors">Student Portal</Link></li>
              <li><Link to="/teacher/login" className="hover:text-blue-400 transition-colors">Teacher Portal</Link></li>
              <li><Link to="/admin-auth" className="hover:text-blue-400 transition-colors">Admin & SuperAdmin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
          <p>&copy; 2026 MentorHub. All rights reserved.</p>
          <div className="flex gap-6 opacity-60">
            <span>Built with MERN + Socket.io + AI Assistant</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

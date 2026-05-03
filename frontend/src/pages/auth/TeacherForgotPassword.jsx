import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { Mail, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, Sparkles, BookOpen } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";

export default function TeacherForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { success, error } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return error("Please enter your registered teacher email.");
    
    setLoading(true);
    try {
      const res = await api.post("/auth/teacher/forgot-password", {
        email: email.toLowerCase().trim(),
      });
      
      setSubmitted(true);
      success(res.data.message || "Reset link sent! Please check your faculty email. 📧");
    } catch (err) {
      console.error(err);
      error(err.response?.data?.message || "Teacher account not found or reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Left Side: Teacher Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-700 via-green-600 to-emerald-800 relative items-center justify-center p-12 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <div className="relative z-10 text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="text-green-600 w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Smart Campus Connect</h1>
            </div>
            <h2 className="text-5xl font-extrabold leading-tight mb-6">
              Faculty Password <br />
              <span className="text-emerald-200">Reset.</span> 👨‍🏫
            </h2>
            <p className="text-xl text-green-100 leading-relaxed mb-8">
              Access your faculty account securely. Enter your academic email to receive a secure reset link.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-slate-50 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-10"
              >
                <div className="mb-8 text-center">
                   <h3 className="text-3xl font-bold text-slate-900 mb-2">Faculty Portal</h3>
                   <p className="text-slate-500">Securely reset your password.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Faculty Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 transition-colors">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        required
                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 focus:bg-white transition-all"
                        placeholder="professor@college.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-green-600/20 hover:bg-green-700 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request Reset Link"}
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                  <Link
                    to="/teacher/login"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-green-600 transition-all font-medium text-sm"
                  >
                    <ArrowLeft size={16} />
                    Back to Faculty Login
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-10 text-center"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle2 className="text-green-500 w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-3">Link Sent!</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  A reset link has been successfully sent to <br />
                  <span className="font-semibold text-slate-700">{email}</span>. <br />
                  Please check your inbox and spam folder.
                </p>
                
                <Link to="/teacher/login" className="block w-full py-4 rounded-2xl bg-green-600 text-white font-bold shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all">
                  Return to Login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

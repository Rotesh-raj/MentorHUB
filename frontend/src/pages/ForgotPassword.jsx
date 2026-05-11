import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { Mail, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, Sparkles, UserCircle } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Enterprise-Grade Forgot Password Page
 * Supports Student, Teacher, and Admin roles via a unified selector.
 */
export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get("role") || "student");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { success, error } = useNotification();

  // Sync role with URL param if it changes
  useEffect(() => {
    const urlRole = searchParams.get("role");
    if (urlRole && ["student", "teacher", "admin"].includes(urlRole)) {
      setRole(urlRole);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email) {
    return error("Please enter your email address.");
  }

  setLoading(true);

  try {

    const res = await api.post(`/auth/${role}/forgot-password`, {
      email: email.toLowerCase().trim(),
    });


    setSubmitted(true);

    success(res.data.message || "Reset link sent successfully! 📧");

  } catch (err) {

    console.error("Forgot Password Error:", err);

    error(
      err.response?.data?.message ||
      "Something went wrong. Please try again."
    );

  } finally {
    setLoading(false);
  }
};

  const roles = [
    { id: "student", label: "Student", icon: "👨‍🎓" },
    { id: "teacher", label: "Teacher", icon: "👨‍🏫" },
    { id: "admin", label: "Admin", icon: "🛡️" }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Left Side: Dynamic Branding */}
      <div className="hidden md:flex md:w-1/2 bg-slate-950 relative items-center justify-center p-12 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-200">MentorHub</h1>
            </div>
            
            <h2 className="text-5xl font-extrabold leading-tight mb-6">
              Account <br />
              <span className="text-indigo-500">Recovery.</span> 🔐
            </h2>
            
            <p className="text-lg text-slate-400 leading-relaxed mb-10">
              Recover access to your {role} dashboard securely. We'll send a high-security validation link to your registered email.
            </p>

            <div className="space-y-4">
              {[
                "Encrypted One-Time Tokens",
                "10-Minute Security Window",
                "Automatic Account Locking",
                "Device Binding Protection"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-400">
                   <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                   <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: High-UX Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-slate-50">
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
                className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 md:p-10"
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Forgot Password?</h3>
                  <p className="text-slate-500 text-sm">Select your role and enter your email address.</p>
                </div>

                {/* Role Selector */}
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-8">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`py-2.5 rounded-xl text-sm font-bold transition-all flex flex-col items-center gap-1 ${
                        role === r.id 
                        ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" 
                        : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span className="text-base">{r.icon}</span>
                      {r.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        required
                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
                        placeholder="e.g. name@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Send Recovery Link
                        <ArrowLeft className="rotate-180" size={18} />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                  <Link
                    to={`/${role}/login`}
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all font-semibold text-sm"
                  >
                    <ArrowLeft size={16} />
                    Back to login
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50 p-10 text-center"
              >
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-indigo-600 w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Reset Link Sent!</h3>
                <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                  If an account exists for <span className="font-bold text-slate-800">{email}</span>, 
                  you will receive a reset link shortly. <br />
                  <span className="text-red-500 font-semibold italic mt-2 block underline decoration-red-200 underline-offset-4">This link expires in 10 minutes.</span>
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="w-full py-4 rounded-2xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                  >
                    Didn't get the email?
                  </button>
                  <Link
                    to="/"
                    className="block text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                  >
                    Return Home
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
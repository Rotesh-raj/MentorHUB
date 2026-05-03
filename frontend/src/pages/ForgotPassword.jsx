import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Mail, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devLink, setDevLink] = useState("");
  const { success, error } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return error("Please enter your email address.");
    
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", {
        email: email.toLowerCase().trim(),
      });
      
      if (res.data.devResetURL) {
        setDevLink(res.data.devResetURL);
      }
      
      setSubmitted(true);
      success(res.data.message || "Reset link sent! 📧");
    } catch (err) {
      console.error(err);
      error(err.response?.data?.message || "Failed to send reset link. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Left Side: Branding & Illustration */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 relative items-center justify-center p-12 overflow-hidden">
        {/* Animated Shapes */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"
        />

        <div className="relative z-10 text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <ShieldCheck className="text-blue-600 w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Smart Campus Connect</h1>
            </div>
            
            <h2 className="text-5xl font-extrabold leading-tight mb-6">
              Reset Your Password <br />
              <span className="text-blue-200">Securely.</span> 🔐
            </h2>
            
            <p className="text-xl text-blue-100 leading-relaxed mb-8">
              Don't worry, it happens to the best of us. Let's get you back into your account in just a few steps.
            </p>

            <div className="grid grid-cols-1 gap-4">
              {[
                "Secure Token Validation",
                "10-Minute Expiry Window",
                "Instant Email Notification"
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + (i * 0.1) }}
                  className="flex items-center gap-3 text-blue-50/80"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-400/30 flex items-center justify-center">
                    <Sparkles size={12} className="text-blue-200" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-slate-50 relative">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 md:hidden flex items-center gap-2">
           <ShieldCheck className="text-blue-600 w-6 h-6" />
           <span className="font-bold text-slate-800">Smart Campus</span>
        </div>

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
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password?</h3>
                  <p className="text-slate-500">Enter your email and we'll send you a link to reset your password.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        required
                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                        placeholder="yourname@college.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-black hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <ArrowLeft className="rotate-180" size={18} />
                        </motion.div>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-medium text-sm"
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
                className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-10 text-center"
              >
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                  >
                    <CheckCircle2 className="text-green-500 w-12 h-12" />
                  </motion.div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-3">Email Sent!</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  We've sent a password reset link to <br />
                  <span className="font-semibold text-slate-700">{email}</span>. <br />
                  The link will expire in 10 minutes.
                </p>

                {devLink && (
                  <div className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-left">
                    <p className="text-[10px] uppercase font-bold text-amber-600 mb-2 tracking-widest flex items-center gap-1">
                      <Sparkles size={12} /> Developer Testing Link
                    </p>
                    <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                      Since the SMTP server is not yet configured, use this link to test the reset flow:
                    </p>
                    <a 
                      href={devLink}
                      className="block p-3 bg-white border border-amber-200 rounded-xl text-blue-600 text-xs font-mono break-all hover:bg-blue-50 transition-colors"
                    >
                      {devLink}
                    </a>
                    <p className="text-[10px] text-amber-500 mt-2 italic">
                      * This section only appears in development mode.
                    </p>
                  </div>
                )}
                
                <div className="space-y-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="w-full py-4 rounded-2xl bg-slate-50 text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
                  >
                    Didn't get it? Try again
                  </button>
                  <Link
                    to="/"
                    className="block text-blue-600 font-bold hover:text-blue-700 transition-colors py-2"
                  >
                    Back to login
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
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { Mail, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, Sparkles, ShieldAlert, Copy, ExternalLink } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";
import { getDeviceFingerprint } from "../../utils/security";

export default function SuperAdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetLink, setResetLink] = useState("");
  const { success, error } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return error("Please enter your registered superadmin email.");
    
    setLoading(true);
    try {
      const fingerprint = getDeviceFingerprint();
      const res = await api.post("/auth/superadmin/forgot-password", {
        email: email.toLowerCase().trim(),
        deviceFingerprint: fingerprint,
      });
      
      if (res.data.resetURL) {
        setResetLink(res.data.resetURL);
      }
      
      setSubmitted(true);
      success(res.data.message || "SuperAdmin reset link generated! 🔐");
    } catch (err) {
      console.error(err);
      error(err.response?.data?.message || "SuperAdmin account not found or access denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Left Side: SuperAdmin Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-900 via-slate-900 to-black relative items-center justify-center p-12 overflow-hidden">
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"
        />
        <div className="relative z-10 text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <ShieldAlert className="text-indigo-900 w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Smart Campus Connect</h1>
            </div>
            <h2 className="text-5xl font-extrabold leading-tight mb-6">
              SuperAdmin <br />
              <span className="text-indigo-400">Recovery.</span> 🛡️
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              Critical access recovery for Super Administrators only. This action is logged and monitored for security.
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
                   <h3 className="text-3xl font-bold text-slate-900 mb-2">Super Portal</h3>
                   <p className="text-slate-500">Root level account recovery.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">SuperAdmin Email</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        required
                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white transition-all"
                        placeholder="root@college.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-900/20 hover:bg-black hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Root Access"}
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                  <Link
                    to="/admin-auth"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-900 transition-all font-medium text-sm"
                  >
                    <ArrowLeft size={16} />
                    Back to Portal
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-10 text-center"
              >
                <div className="w-20 h-20 bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-6">
                   <ShieldCheck className="text-white w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-3">Root Verified!</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Authentication process initiated for <br />
                  <span className="font-semibold text-slate-700">{email}</span>.
                </p>

                {resetLink && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-left"
                  >
                    <p className="text-[10px] uppercase font-bold text-indigo-600 mb-2 flex items-center gap-1">
                      <ShieldCheck size={12} /> Secure Reset Link (Temporary)
                    </p>
                    <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-indigo-200 shadow-sm">
                      <input 
                        readOnly 
                        value={resetLink} 
                        className="flex-1 bg-transparent text-xs text-slate-600 focus:outline-none truncate"
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(resetLink);
                          success("Link copied to clipboard!");
                        }}
                        className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                        title="Copy Link"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                    <p className="text-[10px] text-indigo-500 mt-2 font-medium italic">
                      ⚠️ Note: This link only works on this browser/device.
                    </p>
                    <a 
                      href={resetLink}
                      className="mt-4 w-full py-3 bg-indigo-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-sm hover:bg-black transition-all"
                    >
                      Go to Reset Page <ExternalLink size={14} />
                    </a>
                  </motion.div>
                )}
                
                <Link to="/admin-auth" className="block w-full py-4 rounded-2xl bg-indigo-900 text-white font-bold shadow-lg shadow-indigo-900/20 hover:bg-black transition-all">
                  Return to Portal
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

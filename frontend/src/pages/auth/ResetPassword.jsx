import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Eye, EyeOff, Lock, ShieldCheck, Loader2, KeyRound, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Enterprise-Grade Reset Password Page
 * Validates token and role from query parameters.
 */
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { success, error } = useNotification();

  // Extract from URL: /reset-password?token=XXX&role=student
  const token = searchParams.get("token");
  const role = searchParams.get("role") || "student";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Validate presence of token on mount
  useEffect(() => {
    if (!token) {
      error("Missing security token. Please request a new reset link.");
    }
  }, [token, error]);

  // Password Strength Logic
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    if (password.length >= 12) strength += 1;
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return error("Invalid or missing token.");
    if (password.length < 6) return error("Password must be at least 6 characters.");
    if (password !== confirmPassword) return error("Passwords do not match.");

    setLoading(true);
    try {
      // POST /api/auth/:role/reset-password
      await api.post(`/auth/${role}/reset-password`, {
        token,
        password
      });

      setResetSuccess(true);
      success("Password successfully updated! 🛡️");

      // Redirect based on role
      setTimeout(() => {
        navigate(`/${role}/login`);
      }, 4000);

    } catch (err) {
      console.error("Reset Password Error:", err);
      const msg = err.response?.data?.message || "Link expired or invalid. Please request a new reset link.";
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = ["bg-slate-200", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
  const strengthLabels = ["Too Weak", "Weak", "Fair", "Good", "Strong", "Excellent"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <AnimatePresence mode="wait">
          {!resetSuccess ? (
            <motion.div 
              key="reset-form"
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 md:p-10"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-slate-900/20">
                  <KeyRound className="text-white w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">New Password</h2>
                <p className="text-slate-500 mt-2 text-sm">
                  Recovery for <span className="text-indigo-600 font-bold capitalize">{role}</span> account.
                </p>
              </div>

              {!token ? (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 mb-6">
                   <AlertCircle size={20} />
                   <p className="text-sm font-medium">Reset token missing. Please request a new link.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Secure Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Lock size={18} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        className="block w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                        placeholder="Create strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    
                    {/* Strength UI */}
                    {password && (
                      <div className="px-1 pt-2">
                        <div className="flex justify-between items-center mb-1.5">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Strength</span>
                           <span className={`text-[10px] font-bold uppercase ${passwordStrength > 2 ? 'text-green-600' : 'text-slate-500'}`}>
                              {strengthLabels[passwordStrength]}
                           </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((idx) => (
                            <div 
                              key={idx}
                              className={`h-full flex-1 transition-all duration-500 ${idx <= passwordStrength ? strengthColors[passwordStrength] : "bg-transparent"}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Confirm Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <ShieldCheck size={18} />
                      </div>
                      <input
                        type="password"
                        required
                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">Passwords do not match</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !password || password !== confirmPassword}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-black hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
                    {!loading && <Sparkles size={18} className="text-amber-400" />}
                  </button>
                </form>
              )}

              <div className="mt-8 text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  Link expired? Request a new one
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="reset-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl p-10 text-center"
            >
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-green-500 w-10 h-10" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Password Changed!</h3>
              <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                Your account is now secure. Redirecting you to the <span className="font-bold capitalize">{role}</span> login page.
              </p>
              
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mb-8">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 4 }}
                   className="absolute inset-y-0 left-0 bg-indigo-600"
                 />
              </div>

              <button
                onClick={() => navigate(`/${role}/login`)}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-3"
              >
                Go to Login
                <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
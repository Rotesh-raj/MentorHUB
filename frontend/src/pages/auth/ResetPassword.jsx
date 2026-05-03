import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Eye, EyeOff, Lock, KeyRound, Loader2, ShieldCheck, ArrowRight, XCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { success, error } = useNotification();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Simple password strength calculation
  useEffect(() => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return error("Password must be at least 6 characters long.");
    }

    if (password !== confirmPassword) {
      return error("Passwords do not match. Please check again.");
    }

    try {
      setLoading(true);
      await api.put(`/auth/reset-password/${token}`, {
        password,
        confirmPassword
      });

      setResetSuccess(true);
      success("Password updated successfully! 🎉");
      
      // Auto redirect after 4 seconds
      setTimeout(() => {
        navigate("/");
      }, 4000);

    } catch (err) {
      console.error(err);
      error(err.response?.data?.message || "Reset link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-amber-500";
    return "bg-green-500";
  };

  const getStrengthLabel = () => {
    if (!password) return "";
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 3) return "Good";
    return "Strong";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4">
      {/* Decorative background elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60" 
      />

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
              className="bg-white/80 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-10"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-slate-900/20">
                  <KeyRound className="text-white w-8 h-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Set New Password</h2>
                <p className="text-slate-500 mt-2">Almost there! Create a strong new password for your account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">New Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="block w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  {/* Strength Indicator */}
                  {password && (
                    <div className="px-1 pt-2">
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Security Level</span>
                         <span className={`text-[10px] font-bold uppercase tracking-wider ${getStrengthColor().replace('bg-', 'text-')}`}>
                           {getStrengthLabel()}
                         </span>
                      </div>
                      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((idx) => (
                          <div 
                            key={idx}
                            className={`h-full flex-1 transition-all duration-500 ${idx <= passwordStrength ? getStrengthColor() : "bg-transparent"}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Confirm New Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <ShieldCheck size={18} />
                    </div>
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      className="block w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 mt-1.5 ml-1 flex items-center gap-1 font-medium"
                    >
                      <XCircle size={12} /> Passwords do not match
                    </motion.p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || (password && password.length < 6)}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-black hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <Sparkles size={18} className="text-amber-400" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link
                  to="/"
                  className="text-sm font-semibold text-slate-400 hover:text-slate-800 transition-colors"
                >
                  Cancel and go back
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="reset-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-10 text-center"
            >
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                >
                  <CheckCircle2 className="text-blue-500 w-12 h-12" />
                </motion.div>
              </div>
              
              <h3 className="text-3xl font-extrabold text-slate-900 mb-3">All Set!</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Your password has been changed successfully. <br />
                We're redirecting you to the login page now.
              </p>
              
              <div className="relative h-1 w-full bg-slate-100 rounded-full overflow-hidden mb-8">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 4 }}
                   className="absolute inset-y-0 left-0 bg-blue-600"
                 />
              </div>

              <button
                onClick={() => navigate("/")}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3"
              >
                Login Now
                <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
import { useNavigate, useSearchParams, useParams, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  Eye, EyeOff, Lock, ShieldCheck, Loader2,
  KeyRound, CheckCircle2, AlertCircle, Sparkles, ArrowRight
} from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Universal Reset Password Page
 *
 * Supports two URL formats:
 *  1. Path-param format (new):  /:role/reset-password/:token
 *     e.g. /student/reset-password/abc123
 *
 *  2. Query-param format (legacy): /reset-password?token=abc123&role=student
 *
 * Role is auto-detected from the URL pathname when using path-param format.
 * Falls back to the ?role= query-param, then defaults to "student".
 */
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const params = useParams();          // { token } when route is /:role/reset-password/:token
  const location = useLocation();
  const navigate = useNavigate();
  const { success, error } = useNotification();

  /* ── Token resolution ──────────────────────────────────────────────── */
  // Priority: path param token  →  query param token
  const token = params.token || searchParams.get("token");

  /* ── Role resolution ────────────────────────────────────────────────── */
  // If path is /student/reset-password/… the first segment is the role.
  const pathRole = location.pathname.split("/")[1]; // e.g. "student", "teacher", "admin", "superadmin"
  const validRoles = ["student", "teacher", "admin", "superadmin"];
  const role = validRoles.includes(pathRole)
    ? pathRole
    : searchParams.get("role") || "student";

  /* ── State ───────────────────────────────────────────────────────────── */
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  /* ── Token validation on mount ───────────────────────────────────────── */
  useEffect(() => {
    if (!token) {
      error("Missing security token. Please request a new reset link.");
    }
  }, [token]); // eslint-disable-line

  /* ── Password strength ───────────────────────────────────────────────── */
  useEffect(() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    if (password.length >= 12) s++;
    setPasswordStrength(s);
  }, [password]);

  /* ── Submit ──────────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token)                         return error("Invalid or missing reset token.");
    if (password.length < 6)            return error("Password must be at least 6 characters.");
    if (password !== confirmPassword)   return error("Passwords do not match.");

    setLoading(true);
    try {
      // POST /api/auth/:role/reset-password  { token, password }
      await api.post(`/auth/${role}/reset-password`, { token, password });

      setResetSuccess(true);
      success("Password updated successfully! 🛡️ Redirecting to login…");

      // Redirect to correct login page after 4 seconds
      setTimeout(() => {
        if (role === "admin" || role === "superadmin") {
          navigate("/admin-auth");
        } else {
          navigate(`/${role}/login`);
        }
      }, 4000);

    } catch (err) {
      console.error("Reset Password Error:", err);
      const msg =
        err.response?.data?.message ||
        "Link expired or invalid. Please request a new reset link.";
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Helpers ──────────────────────────────────────────────────────────── */
  const strengthColors = [
    "bg-slate-200", "bg-red-500", "bg-orange-500",
    "bg-yellow-500", "bg-blue-500", "bg-green-500"
  ];
  const strengthLabels = ["Too Weak", "Weak", "Fair", "Good", "Strong", "Excellent"];

  const roleColors = {
    student:    "from-blue-600 to-indigo-700",
    teacher:    "from-emerald-600 to-teal-700",
    admin:      "from-slate-700 to-slate-900",
    superadmin: "from-violet-600 to-purple-800",
  };
  const roleLabel = {
    student: "Student", teacher: "Teacher", admin: "Admin", superadmin: "Super Admin"
  };

  const forgotLink =
    role === "admin" || role === "superadmin"
      ? `/${role}/forgot-password`
      : `/${role}/forgot-password`;

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4">

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[15%] right-[10%] w-[45%] h-[45%] bg-blue-200 rounded-full blur-[120px]" />
        <div className="absolute bottom-[15%] left-[10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-md w-full relative z-10"
      >
        <AnimatePresence mode="wait">

          {/* ════════════ RESET FORM ════════════ */}
          {!resetSuccess ? (
            <motion.div
              key="reset-form"
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 p-10"
            >
              {/* Header */}
              <div className="text-center mb-10">
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${roleColors[role] || roleColors.student} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3`}
                >
                  <KeyRound className="text-white w-10 h-10 -rotate-3" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                  New Password
                </h2>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-3">
                  Account Recovery — <span className="text-indigo-600">{roleLabel[role] || role}</span>
                </p>
              </div>

              {/* No token warning */}
              {!token ? (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 mb-6">
                  <AlertCircle size={20} />
                  <p className="text-sm font-medium">
                    Reset token missing or invalid. Please request a new link.
                  </p>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Lock size={18} />
                      </div>
                      <input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        className="block w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                        placeholder="Create a strong password"
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

                    {/* Strength bar */}
                    {password && (
                      <div className="px-1 pt-2">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Strength
                          </span>
                          <span className={`text-[10px] font-bold uppercase ${passwordStrength > 2 ? "text-green-600" : "text-red-500"}`}>
                            {strengthLabels[passwordStrength]}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((idx) => (
                            <div
                              key={idx}
                              className={`h-full flex-1 transition-all duration-500 rounded-full ${
                                idx <= passwordStrength
                                  ? strengthColors[passwordStrength]
                                  : "bg-transparent"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <ShieldCheck size={18} />
                      </div>
                      <input
                        id="confirm-password"
                        type={showConfirm ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        className="block w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                        placeholder="Confirm your password"
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
                      <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium flex items-center gap-1">
                        <AlertCircle size={12} /> Passwords do not match
                      </p>
                    )}
                    {confirmPassword && password === confirmPassword && (
                      <p className="text-xs text-green-600 mt-1.5 ml-1 font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} /> Passwords match
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || !password || password !== confirmPassword || passwordStrength < 1}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-black hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading
                      ? <Loader2 className="w-5 h-5 animate-spin" />
                      : <>Update Password <Sparkles size={18} className="text-amber-400" /></>
                    }
                  </button>
                </form>
              )}

              {/* Back link */}
              <div className="mt-8 text-center">
                <Link
                  to={forgotLink}
                  className="text-sm font-semibold text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  Link expired? Request a new one →
                </Link>
              </div>
            </motion.div>

          ) : (

            /* ════════════ SUCCESS SCREEN ════════════ */
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
                Your <span className="font-bold capitalize">{roleLabel[role] || role}</span> account
                is now secure. Redirecting you to the login page in a few seconds…
              </p>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-8 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4 }}
                  className={`h-full bg-gradient-to-r ${roleColors[role] || roleColors.student} rounded-full`}
                />
              </div>

              <button
                onClick={() => {
                  if (role === "admin" || role === "superadmin") navigate("/admin-auth");
                  else navigate(`/${role}/login`);
                }}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-3"
              >
                Go to Login <ArrowRight size={18} />
              </button>
            </motion.div>

          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
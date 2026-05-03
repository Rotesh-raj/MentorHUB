import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Select from "react-select";

const BANGALORE_COLLEGES = [
  { value: "Dayananda Sagar College of Engineering (DSCE)", label: "Dayananda Sagar College of Engineering (DSCE)" },
  { value: "R.V. College of Engineering (RVCE)", label: "R.V. College of Engineering (RVCE)" },
  { value: "BMS College of Engineering (BMSCE)", label: "BMS College of Engineering (BMSCE)" },
  { value: "PES University", label: "PES University" },
  { value: "MS Ramaiah Institute of Technology (MSRIT)", label: "MS Ramaiah Institute of Technology (MSRIT)" },
  { value: "New Horizon College of Engineering", label: "New Horizon College of Engineering" },
  { value: "CMR Institute of Technology", label: "CMR Institute of Technology" },
  { value: "Acharya Institute of Technology", label: "Acharya Institute of Technology" },
  { value: "Sir M. Visvesvaraya Institute of Technology (Sir MVIT)", label: "Sir M. Visvesvaraya Institute of Technology (Sir MVIT)" },
  { value: "Jain University", label: "Jain University" },
  { value: "Other College", label: "Other College" }
];

export default function AdminLogin() {
  const [isLogin, setIsLogin] = useState(true);

  /* ── Login state ── */
  const [loginEmail, setLoginEmail]       = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  /* ── Register state ── */
  const [regRole, setRegRole]               = useState(""); // "admin" | "superadmin"
  const [regName, setRegName]               = useState("");
  const [regEmail, setRegEmail]             = useState("");
  const [regPassword, setRegPassword]       = useState("");
  const [regConfirm, setRegConfirm]         = useState("");
  const [regCollege, setRegCollege]         = useState(null);
  const [customCollege, setCustomCollege]   = useState("");
  const [regDepartment, setRegDepartment]   = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const { login, register } = useAuth();
  const navigate = useNavigate();

  /* ─────────────── SUBMIT ─────────────── */
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        /* ── LOGIN ── */
        if (!loginEmail || !loginPassword) {
          setError("Please enter email and password");
          return;
        }

        const user = await login(loginEmail, loginPassword);

        // ✅ Routes match what is defined in App.jsx
        if (user.role === "superadmin") {
          navigate("/superadmin");
        } else if (user.role === "admin") {
          navigate("/admin");
        } else {
          setError("Access denied: This portal is for Admins and SuperAdmins only.");
        }

      } else {
        /* ── REGISTER ── */
        const finalCollege = regCollege?.value === "Other College" ? customCollege : regCollege?.value;

        if (!regRole || !regName || !regEmail || !regPassword || !regConfirm || !finalCollege) {
          setError("Please fill all required fields.");
          return;
        }

        if (regRole === "admin" && !regDepartment) {
          setError("Please provide a department for Admin role.");
          return;
        }

        if (regPassword !== regConfirm) {
          setError("Passwords do not match.");
          return;
        }

        if (regPassword.length < 6) {
          setError("Password must be at least 6 characters.");
          return;
        }

        const finalDepartment = regRole === "superadmin" ? (regDepartment || "Management") : regDepartment;

        // ✅ Passes role + college name + department to backend
        const result = await register(regName, regEmail, regPassword, regConfirm, finalCollege, finalDepartment, regRole);

        if (result.success) {
          alert(`✅ ${regRole === "superadmin" ? "SuperAdmin" : "Admin"} registration submitted successfully.`);
          // Reset form and switch to login
          setRegRole(""); setRegName(""); setRegEmail(""); setRegPassword(""); setRegConfirm("");
          setRegCollege(null); setCustomCollege(""); setRegDepartment("");
          setIsLogin(true);
        } else {
          setError(result.message || "Registration failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("🔴 AUTH ERROR:", err);
      setError(err?.response?.data?.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────── INPUT CLASS ─────────────── */
  const inputCls =
    "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <form
        onSubmit={submit}
        className="bg-white/80 backdrop-blur-sm p-8 shadow-2xl rounded-3xl w-full max-w-md space-y-5 border border-white/50"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1">
            Admin Portal
          </h2>
          <p className="text-sm text-gray-500">
            {isLogin ? "Sign in to your account" : "Create new admin account"}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            type="button"
            id="tab-login"
            onClick={() => { setIsLogin(true); setError(""); }}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              isLogin
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            id="tab-register"
            onClick={() => { setIsLogin(false); setError(""); }}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              !isLogin
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Register
          </button>
        </div>

        {/* SuperAdmin hint (login tab only) */}
        {isLogin && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs">
            <strong>💡 SuperAdmin:</strong> Email: dsiconnection.project@gmail.com | Password: Riteshraj800@
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* ═══════════ LOGIN FORM ═══════════ */}
        {isLogin && (
          <>
            <input
              id="login-email"
              className={inputCls}
              placeholder="Email *"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
            <input
              id="login-password"
              className={inputCls}
              placeholder="Password *"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
            <div className="flex justify-end px-1">
              <Link
                to="/admin/forgot-password"
                className="text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </>
        )}

        {/* ═══════════ REGISTER FORM ═══════════ */}
        {!isLogin && (
          <>
            <select
              id="reg-role"
              className={inputCls}
              value={regRole}
              onChange={(e) => setRegRole(e.target.value)}
              disabled={loading}
              required
            >
              <option value="" disabled>Select Role *</option>
              <option value="admin">Admin</option>
              <option value="superadmin">SuperAdmin</option>
            </select>

            <input
              id="reg-name"
              className={inputCls}
              placeholder={regRole === "superadmin" ? "SuperAdmin Name *" : "Admin Name *"}
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              disabled={loading}
            />
            {/* ✅ College Searchable Dropdown */}
            <Select
              options={BANGALORE_COLLEGES}
              value={regCollege}
              onChange={(selected) => setRegCollege(selected)}
              placeholder="Select College *"
              isSearchable
              isDisabled={loading}
              styles={{
                control: (base, state) => ({
                  ...base,
                  padding: "6px 8px",
                  borderRadius: "0.75rem",
                  borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
                  boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
                  "&:hover": { borderColor: "#3b82f6" },
                  backgroundColor: "white",
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                }),
              }}
            />

            {regCollege?.value === "Other College" && (
              <input
                id="reg-custom-college"
                className={inputCls}
                placeholder="Enter your College Name *"
                value={customCollege}
                onChange={(e) => setCustomCollege(e.target.value)}
                disabled={loading}
              />
            )}
            
            {regRole !== "superadmin" && (
              <input
                id="reg-department"
                className={inputCls}
                placeholder="Department *"
                value={regDepartment}
                onChange={(e) => setRegDepartment(e.target.value)}
                disabled={loading}
              />
            )}
            <input
              id="reg-email"
              className={inputCls}
              placeholder="Email *"
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
            <input
              id="reg-password"
              className={inputCls}
              placeholder="Password * (min 6 chars)"
              type="password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              disabled={loading}
            />
            {/* ✅ Confirm password field */}
            <input
              id="reg-confirm"
              className={inputCls}
              placeholder="Confirm Password *"
              type="password"
              value={regConfirm}
              onChange={(e) => setRegConfirm(e.target.value)}
              disabled={loading}
            />
          </>
        )}

        {/* Submit */}
        <button
          id="auth-submit"
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            isLogin ? "Sign In" : "Create Account"
          )}
        </button>

        {/* Footer */}
        <div className="text-center pt-2">
          <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
            ← Back to Home
          </Link>
        </div>
      </form>
    </div>
  );
}

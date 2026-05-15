import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Select from "react-select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import DemoCredentials from "../../components/auth/DemoCredentials";
import { motion } from "framer-motion";
import { LayoutDashboard, ShieldCheck, Star } from "lucide-react";

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
  const submit = async (e, autoEmail, autoPassword) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    const email = autoEmail || loginEmail;
    const password = autoPassword || loginPassword;

    try {
      if (isLogin) {
        /* ── LOGIN ── */
        if (!email || !password) {
          setError("Please enter email and password");
          return;
        }

        const user = await login(email, password);

        // ✅ Routes match what is defined in App.jsx
        if (user.role === "superadmin") {
          navigate("/superadmin/dashboard");
        } else if (user.role === "admin") {
          navigate("/admin/dashboard");
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

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-100 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px] opacity-60"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <Card className="space-y-6 border-none shadow-2xl shadow-violet-500/10 bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-violet-500/20">
              <LayoutDashboard className="text-white w-10 h-10" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                Admin Portal
              </h2>
              <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-widest">
                {isLogin ? "Institutional Access" : "Admin Registration"}
              </p>
            </div>
          </div>

          {isLogin && (
            <div className="space-y-4">
               <div className="flex items-center gap-2 px-1">
                 <div className="h-[1px] flex-1 bg-slate-100"></div>
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Demo Accounts</span>
                 <div className="h-[1px] flex-1 bg-slate-100"></div>
               </div>
               <div className="grid grid-cols-1 gap-0">
                  <DemoCredentials 
                    role="admin" 
                    onAutoFill={(email, password) => { 
                      setLoginEmail(email); 
                      setLoginPassword(password);
                      submit(null, email, password);
                    }} 
                  />
                  <div className="h-4"></div>
                  <DemoCredentials 
                    role="superadmin" 
                    onAutoFill={(email, password) => { 
                      setLoginEmail(email); 
                      setLoginPassword(password);
                      submit(null, email, password);
                    }} 
                  />
               </div>
            </div>
          )}

        {/* Toggle */}
        <div className="flex bg-neutral-100 rounded-xl p-1">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(""); }}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-black transition-all ${
              isLogin
                ? "bg-white text-primary-600 shadow-sm"
                : "text-neutral-500 hover:text-primary-600"
            }`}
          >
            LOGIN
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(""); }}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-black transition-all ${
              !isLogin
                ? "bg-white text-primary-600 shadow-sm"
                : "text-neutral-500 hover:text-primary-600"
            }`}
          >
            REGISTER
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 animate-in fade-in slide-in-from-top-2">
            <p className="text-red-600 text-xs font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          {isLogin ? (
            <>
              <Input
                label="Email Address"
                placeholder="admin@college.edu"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                disabled={loading}
              />
              <Input
                label="Password"
                placeholder="••••••••"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                disabled={loading}
              />
              <div className="flex justify-end">
                <Link
                  to="/admin/forgot-password"
                  className="text-xs font-black text-neutral-400 hover:text-primary-600 uppercase tracking-widest transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-neutral-500 uppercase tracking-widest pl-1">Role</label>
                <select
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  disabled={loading}
                >
                  <option value="" disabled>Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">SuperAdmin</option>
                </select>
              </div>

              <Input
                label="Full Name"
                placeholder="John Doe"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                disabled={loading}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-black text-neutral-500 uppercase tracking-widest pl-1">College</label>
                <Select
                  options={BANGALORE_COLLEGES}
                  value={regCollege}
                  onChange={(selected) => setRegCollege(selected)}
                  placeholder="Select College"
                  isSearchable
                  isDisabled={loading}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      padding: "4px 8px",
                      borderRadius: "0.75rem",
                      borderColor: state.isFocused ? "#0ea5e9" : "#f1f5f9",
                      backgroundColor: "#f8fafc",
                      boxShadow: "none",
                      "&:hover": { borderColor: "#0ea5e9" },
                    }),
                    placeholder: (base) => ({ ...base, color: "#94a3b8", fontSize: "14px", fontWeight: "500" }),
                    menu: (base) => ({ ...base, borderRadius: "0.75rem", padding: "4px" }),
                  }}
                />
              </div>

              {regCollege?.value === "Other College" && (
                <Input
                  label="College Name"
                  placeholder="Custom College Name"
                  value={customCollege}
                  onChange={(e) => setCustomCollege(e.target.value)}
                  disabled={loading}
                />
              )}
              
              {regRole !== "superadmin" && (
                <Input
                  label="Department"
                  placeholder="CSE / ISE / ME"
                  value={regDepartment}
                  onChange={(e) => setRegDepartment(e.target.value)}
                  disabled={loading}
                />
              )}

              <Input
                label="Email"
                type="email"
                placeholder="admin@college.edu"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                disabled={loading}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Min 6 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                disabled={loading}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-lg"
          >
            {loading ? "PROCESSING..." : isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
          </Button>
        </form>

        <div className="text-center pt-2">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-violet-600 uppercase tracking-widest transition-all">
            <span>←</span> Back to Home
          </Link>
        </div>
        </Card>
        
        <p className="text-center text-[10px] font-bold text-slate-300 mt-8 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
          <ShieldCheck className="w-3 h-3" /> Secure Administrative Access · DSI Connection
        </p>
      </motion.div>
    </div>
  );
}

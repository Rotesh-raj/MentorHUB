import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DemoCredentials from '../../components/auth/DemoCredentials';
import { motion } from 'framer-motion';
import { BookOpen, ShieldCheck } from 'lucide-react';

const TeacherLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, autoEmail, autoPassword) => {
    if (e) e.preventDefault();
    setLoading(true);

    const email = autoEmail || formData.email;
    const password = autoPassword || formData.password;

    try {
      const user = await login(email, password);

      if (user.role !== 'teacher') {
        error("Please login from teacher section.");
        setLoading(false);
        return;
      }

      success('Login successful! Welcome to Faculty Dashboard.');
      navigate('/teacher/dashboard');
    } catch (err) {
      error(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-100 rounded-full blur-[120px] opacity-60"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <Card className="space-y-8 border-none shadow-2xl shadow-emerald-500/10 bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 -rotate-3">
              <BookOpen className="text-white w-10 h-10 rotate-3" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Faculty Login</h1>
              <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-widest">MentorHUB Smart Campus</p>
            </div>
          </div>

          <DemoCredentials 
            role="teacher" 
            onAutoFill={(email, password) => {
              setFormData({ email, password });
              handleSubmit(null, email, password);
            }} 
          />

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your.email@college.edu"
          />

          <div className="space-y-2">
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
            <div className="flex justify-end px-1">
              <Link
                to="/teacher/forgot-password"
                className="text-xs font-black text-neutral-400 hover:text-primary-600 uppercase tracking-widest transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-lg"
          >
            {loading ? 'LOGGING IN...' : 'SIGN IN'}
          </Button>
        </form>

        <div className="space-y-4 text-center">
          <p className="text-sm font-medium text-neutral-500">
            Don't have an account?{' '}
            <Link to="/teacher/register" className="text-primary-600 font-black uppercase tracking-wider hover:underline">
              Register
            </Link>
          </p>

          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-all">
            <span>←</span> Back to Home
          </Link>
        </div>
        </Card>
        
        <p className="text-center text-[10px] font-bold text-slate-300 mt-8 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
          <ShieldCheck className="w-3 h-3" /> Secure Faculty Access · DSI Connection
        </p>
      </motion.div>
    </div>
  );
};

export default TeacherLogin;

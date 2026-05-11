import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const StudentLogin = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);

      if (user?.role !== 'student') {
        if (user?.role === 'teacher') {
          error("Please login from teacher section.");
        } 
        else if (user?.role === 'admin') {
          error("Please login from admin section.");
        } 
        else {
          error("Unauthorized access.");
        }
        setLoading(false);
        return;
      }

      success("Login successful!");
      navigate("/student");
    } catch (err) {
      error(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-black text-neutral-900">Student Login</h1>
          <p className="text-neutral-400 font-medium mt-2">Welcome back!</p>
        </div>

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
                to="/forgot-password?role=student"
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
            <Link to="/student/register" className="text-primary-600 font-black uppercase tracking-wider hover:underline">
              Register
            </Link>
          </p>

          <Link to="/" className="inline-block text-[10px] font-black text-neutral-400 hover:text-primary-600 uppercase tracking-widest transition-colors">
            ← Back to Home
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default StudentLogin;

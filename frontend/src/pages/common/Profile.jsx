import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import api from '../../api/axios';
import BackButton from '../../components/common/BackButton';
import { 
  User as UserIcon, 
  Mail, 
  BookOpen, 
  GraduationCap, 
  Building, 
  Camera, 
  LogOut, 
  Save, 
  Trash2,
  ChevronRight,
  ShieldCheck,
  LayoutDashboard,
  BadgeCheck,
  MapPin
} from 'lucide-react';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(user?.profilePic || null);
  
  // Role-based initial form data
  const [formData, setFormData] = useState({
    year: user?.year || '',
    college: user?.college || '',
    section: user?.section || '',
    bio: user?.bio || '',
    specialization: user?.specialization || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        year: user.year || '',
        college: user.college || '',
        section: user.section || '',
        bio: user.bio || '',
        specialization: user.specialization || ''
      });
      if (user.profilePic) {
        setPreview(user.profilePic);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        error("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = user.role === 'student' ? '/student/profile' : '/teacher/profile';
    const data = new FormData();
    
    if (user.role === 'student') {
      data.append('year', formData.year);
      data.append('college', formData.college);
      data.append('section', formData.section);
    } else {
      data.append('bio', formData.bio);
      data.append('specialization', formData.specialization);
      // Teachers still show college/dept but usually these are set by admin, 
      // however, if we want them editable, we add them:
      data.append('college', formData.college);
    }
    
    if (fileInputRef.current?.files[0]) {
      data.append('profilePic', fileInputRef.current.files[0]);
    }

    try {
      const res = await api.put(endpoint, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      updateUser(res.data.user);
      success("Profile updated successfully! ✨");
    } catch (err) {
      error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isStudent = user?.role === 'student';

  return (
    <div className="min-h-screen bg-[#f8fafc] relative">
      <BackButton title="User Profile" />
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                MentorHub
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to={user?.role === 'student' ? '/student' : user?.role === 'teacher' ? '/teacher' : '/admin'} 
                className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
              >
                <LayoutDashboard size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition-all"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-center overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-10 group-hover:opacity-20 transition-opacity" />
              
              <div className="relative mt-4 mb-6">
                <div className="w-32 h-32 mx-auto rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-xl">
                  <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center border-4 border-white">
                    {preview ? (
                      <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={48} className="text-slate-300" />
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1/2 translate-x-12 bg-white text-indigo-600 p-2.5 rounded-full shadow-lg border border-slate-100 hover:scale-110 transition-transform active:scale-95"
                >
                  <Camera size={18} />
                </button>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <h2 className="text-2xl font-bold text-slate-800">{user?.name}</h2>
              <p className="text-slate-500 font-medium flex items-center justify-center gap-1.5 mt-1">
                <ShieldCheck size={16} className="text-emerald-500" />
                {user?.role?.toUpperCase()}
              </p>

              <div className="mt-8 space-y-4 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Email Address</p>
                    <p className="text-sm font-medium text-slate-700">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Department</p>
                    <p className="text-sm font-medium text-slate-700">{user?.department || 'Not Set'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                    <ChevronRight size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{user?.role === 'student' ? 'USN' : 'Staff ID'}</p>
                    <p className="text-sm font-medium text-slate-700">{user?.referenceId}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex gap-3">
              <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
              <div>
                <p className="text-sm font-bold text-emerald-800">Verified Account</p>
                <p className="text-xs text-emerald-600">Your identity has been verified by the institutional administrator.</p>
              </div>
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-800">
                  {isStudent ? 'Academic Settings' : 'Professional Profile'}
                </h3>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">
                  {user?.role} Profile
                </span>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {isStudent ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Academic Year */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <GraduationCap size={16} className="text-slate-400" />
                        Academic Year
                      </label>
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-slate-700 font-medium"
                      >
                        <option value="">Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>

                    {/* Section */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <LayoutDashboard size={16} className="text-slate-400" />
                        Section
                      </label>
                      <select
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-slate-700 font-medium"
                      >
                        <option value="">Select Section</option>
                        {['A', 'B', 'C', 'D'].map(sec => (
                          <option key={sec} value={sec}>Section {sec}</option>
                        ))}
                      </select>
                    </div>

                    {/* College */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Building size={16} className="text-slate-400" />
                        College / Block
                      </label>
                      <select
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-slate-700 font-medium"
                      >
                        <option value="">Select College</option>
                        <option value="DSI">DSI Main Campus</option>
                        <option value="Engineering Block">Engineering Block</option>
                        <option value="MBA Block">MBA Block</option>
                        <option value="Medical Campus">Medical Campus</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Teacher Specific Fields */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <BadgeCheck size={16} className="text-blue-500" />
                        Specialization
                      </label>
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        placeholder="e.g., Artificial Intelligence, Cyber Security"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <BookOpen size={16} className="text-blue-500" />
                        Professional Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell students about your academic journey and expertise..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 font-medium resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <MapPin size={16} className="text-blue-500" />
                        Office Location / College
                      </label>
                      <select
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 font-medium"
                      >
                        <option value="">Select College</option>
                        <option value="DSI">DSI Main Campus</option>
                        <option value="Engineering Block">Engineering Block</option>
                        <option value="MBA Block">MBA Block</option>
                        <option value="Medical Campus">Medical Campus</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Security & Account</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Two-Factor Authentication</p>
                      <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors border border-indigo-100 bg-white">Enable</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50/30 rounded-2xl border border-red-100/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl border border-red-100 flex items-center justify-center text-red-500 shadow-sm">
                      <Trash2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-red-800">Deactivate Account</p>
                      <p className="text-xs text-red-600/70">Permanently remove your account and all data.</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors border border-red-100 bg-white">Deactivate</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

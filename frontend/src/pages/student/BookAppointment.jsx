import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';
import { 
  Calendar, 
  Clock, 
  MessageSquare, 
  ChevronLeft, 
  GraduationCap,
  ShieldCheck,
  User,
  Info
} from 'lucide-react';

const BookAppointment = () => {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    slotId: '',
    topic: '',
    description: ''
  });
  const { success, error } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherRes, availRes] = await Promise.all([
          api.get(`/student/teacher/${teacherId}`),
          api.get(`/student/teacher/${teacherId}/availability`)
        ]);
        setTeacher(teacherRes.data);
        setAvailability(availRes.data);
      } catch (err) {
        error('Failed to fetch mentor details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [teacherId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/student/book', {
        teacherId,
        slotId: formData.slotId,
        topic: formData.topic,
        description: formData.description
      });
      success('Appointment booked successfully! ✨');
      navigate('/student/appointments');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
        <p className="text-slate-500 font-medium">Securing your session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <Link to="/student/teachers" className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-500">
                <ChevronLeft size={20} />
              </Link>
              <span className="text-lg font-bold text-slate-900">Book Session</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <GraduationCap size={20} />
              <span className="font-bold text-sm">MentorHub</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Mentor Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden border-4 border-slate-50 shadow-md mb-4">
                  {teacher?.profilePic ? (
                    <img src={teacher.profilePic} alt={teacher.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                      <User size={40} />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-slate-900">{teacher?.name}</h2>
                  <ShieldCheck size={18} className="text-blue-500" />
                </div>
                <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{teacher?.department}</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-50 text-sm">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-2">Mentor Bio</p>
                  <p className="text-slate-600 leading-relaxed">
                    {teacher?.bio || "Expert faculty member providing academic guidance and mentorship to students."}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-2"><Clock size={16} /> Avg Response</span>
                  <span className="font-bold text-slate-700">~2 hrs</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex gap-4">
              <Info className="text-indigo-500 shrink-0" size={20} />
              <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                Your appointment request will be sent to the mentor for approval. You'll receive an email notification once it's confirmed.
              </p>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 h-full">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Slot Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Calendar size={18} className="text-blue-500" />
                    Select Consultation Slot
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availability.length === 0 ? (
                      <div className="md:col-span-2 py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                        <p className="text-slate-500 font-medium">No slots available currently.</p>
                      </div>
                    ) : (
                      availability.map((slot) => (
                        <label 
                          key={slot._id}
                          className={`relative flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            formData.slotId === slot._id 
                            ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-50' 
                            : 'border-slate-100 hover:border-slate-200 bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="slotId"
                            value={slot._id}
                            onChange={handleChange}
                            className="absolute opacity-0"
                            required
                          />
                          <span className="text-sm font-bold text-slate-800">
                            {new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
                            <Clock size={12} />
                            {slot.startTime} - {slot.endTime}
                          </span>
                          {formData.slotId === slot._id && (
                            <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                              <ShieldCheck className="text-white" size={12} />
                            </div>
                          )}
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Topic & Description */}
                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <MessageSquare size={18} className="text-blue-500" />
                      Session Topic
                    </label>
                    <input
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Final Year Project Review"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all outline-none text-slate-700 font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Detailed Description (Optional)</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Briefly describe what you'd like to discuss..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all outline-none text-slate-700 font-medium resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || availability.length === 0}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <span>Confirm Appointment</span>
                      <ChevronLeft size={20} className="rotate-180" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;

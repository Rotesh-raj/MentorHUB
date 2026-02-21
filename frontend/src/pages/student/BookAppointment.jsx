import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useNotification } from '../../context/NotificationContext';

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
      // 1️⃣ Get teacher info
      const teacherRes = await api.get(`/student/teacher/${teacherId}`);
      setTeacher(teacherRes.data);

      // 2️⃣ Get teacher availability slots
      const availRes = await api.get(`/student/teacher/${teacherId}/availability`);
      setAvailability(availRes.data);

    } catch (err) {
      console.log(err);
      error('Failed to fetch teacher data');
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
      success('Appointment booked successfully!');
      navigate('/student/appointments');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/student" className="text-xl font-bold">Smart Campus Connect</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/student/teachers" className="hover:bg-blue-700 px-3 py-2 rounded">Back to Teachers</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Appointment</h1>
          
          {/* Teacher Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{teacher?.name}</h2>
            <p className="text-gray-600">{teacher?.department}</p>
            <p className="text-sm text-gray-500">Staff ID: {teacher?.referenceId}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Slot Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Available Slot
              </label>
              <select
                name="slotId"
                value={formData.slotId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a slot</option>
                {availability.map((slot) => (
                  <option key={slot._id} value={slot._id}>
                    {slot.day} - {slot.startTime} to {slot.endTime}
                  </option>
                ))}
              </select>
              {availability.length === 0 && (
                <p className="text-sm text-red-500 mt-2">No availability slots. Please check back later.</p>
              )}
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Project Discussion, Doubt Clearing"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of what you want to discuss..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting || availability.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useNotification } from "../../context/NotificationContext";

const Availability = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { success, error } = useNotification();

  const [formData, setFormData] = useState({
    date: "",
    startTime: "09:00",
    endTime: "10:00",
    maxStudents: 5
  });

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await api.get("/availability");
      setAvailability(response.data);
    } catch {
      error("Failed to fetch availability");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/availability", {
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        maxStudents: formData.maxStudents
      });

      success("Availability added successfully!");
      setShowForm(false);
      fetchAvailability();
    } catch (err) {
      error(err.response?.data?.message || "Failed to add availability");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/availability/${selectedId}`);
      success("Availability deleted successfully!");
      setAvailability(availability.filter((a) => a._id !== selectedId));
    } catch (err) {
      error(err.response?.data?.message || "Failed to delete availability");
    } finally {
      setShowDeleteModal(false);
      setSelectedId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/teacher" className="text-xl font-bold">
            Smart Campus Connect
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Availability Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
          >
            {showForm ? "Cancel" : "+ Add Slot"}
          </button>
        </div>

        {/* Add Slot Form */}
        {showForm && (
          <div className="bg-white shadow-xl rounded-xl p-6 mb-6">
            <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4">

              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  required
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  required
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max Students</label>
                <input
                  type="number"
                  name="maxStudents"
                  min="1"
                  required
                  value={formData.maxStudents}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="md:col-span-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {submitting ? "Adding..." : "Add Slot"}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Availability Table */}
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : availability.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            No availability slots created.
          </div>
        ) : (
          <div className="bg-white shadow rounded-xl overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Start</th>
                  <th className="px-6 py-3 text-left">End</th>
                  <th className="px-6 py-3 text-left">Capacity</th>
                  <th className="px-6 py-3 text-left">Booked</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {availability.map((slot) => (
                  <tr key={slot._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {new Date(slot.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{slot.startTime}</td>
                    <td className="px-6 py-4">{slot.endTime}</td>
                    <td className="px-6 py-4">{slot.maxStudents}</td>
                    <td className="px-6 py-4">
                      {slot.bookedStudents?.length || 0}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(slot._id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PROFESSIONAL DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-96 p-6">

            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Delete Availability Slot
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this slot?
              This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Availability;
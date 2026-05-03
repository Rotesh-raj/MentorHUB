import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const TodaySchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const fetchTodaySchedule = async () => {
      try {
        const response = await api.get("/teacher/today");
        setAppointments(response.data);

        if (response.data.length > 0) {
          setStatusMessage({
            type: "success",
            text: "✅ Your schedule is available for today"
          });
        } else {
          setStatusMessage({
            type: "info",
            text: "ℹ️ You have no schedule for today"
          });
        }

        // Auto hide message after 4 seconds
        setTimeout(() => {
          setStatusMessage(null);
        }, 4000);

      } catch (err) {
        setStatusMessage({
          type: "error",
          text: "❌ Failed to fetch schedule"
        });

        setTimeout(() => {
          setStatusMessage(null);
        }, 4000);
      } finally {
        setLoading(false);
      }
    };

    fetchTodaySchedule();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Professional Floating Status Popup */}
      {statusMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`px-6 py-4 rounded-xl shadow-lg text-white text-sm font-medium transition-all duration-300
              ${statusMessage.type === "success" ? "bg-green-600" :
                statusMessage.type === "info" ? "bg-blue-600" :
                "bg-red-600"}`}
          >
            {statusMessage.text}
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
          <Link to="/teacher" className="text-xl font-bold">
            Smart Campus Connect
          </Link>
          <div className="space-x-4">
            <Link to="/teacher" className="hover:bg-green-700 px-3 py-2 rounded">
              Dashboard
            </Link>
            <Link to="/teacher/requests" className="hover:bg-green-700 px-3 py-2 rounded">
              Requests
            </Link>
            <Link to="/teacher/availability" className="hover:bg-green-700 px-3 py-2 rounded">
              Availability
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Today's Schedule</h1>
        <p className="text-gray-600 mt-2">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center mt-6">
            <p className="text-gray-500 text-lg">
              No appointments scheduled for today
            </p>
          </div>
        ) : (
          <div className="space-y-6 mt-6">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {appointment.studentId?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      USN: {appointment.studentId?.referenceId}
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                      Topic: {appointment.topic}
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>

                    {appointment.status === "approved" && (
                      <Link
                        to={`/teacher/chat/${appointment.studentId?._id}`}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Chat
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaySchedule;
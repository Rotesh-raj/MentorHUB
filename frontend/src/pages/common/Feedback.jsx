import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "../../components/common/BackButton";

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "General",
    message: "",
  });

  const submitFeedback = (e) => {
    e.preventDefault();
    alert("Thank you for your feedback 🚀");
    setRating(0);
    setFormData({
      name: "",
      email: "",
      category: "General",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 py-16 px-6 relative">
      <BackButton title="Feedback Hub" />

      {/* Header */}

      
      <div className="text-center mb-14">
        <h1 className="text-5xl font-bold text-gray-800">
          Share Your <span className="text-orange-600">Feedback</span>
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          Help us improve Smart Campus Connect.
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-lg border border-white/40 rounded-3xl shadow-2xl p-10">

        <form onSubmit={submitFeedback} className="space-y-6">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="Enter your name"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-400 outline-none"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-400 outline-none"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Feedback Category
            </label>
            <select
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-400 outline-none"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option>General</option>
              <option>Bug Report</option>
              <option>Feature Request</option>
              <option>User Experience</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Rate Your Experience
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={28}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer transition ${
                    star <= rating
                      ? "text-orange-500 fill-orange-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Your Feedback
            </label>
            <textarea
              rows="5"
              required
              placeholder="Write your feedback here..."
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-400 outline-none"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium py-3 rounded-xl shadow-lg transition duration-300"
          >
            <Send size={18} />
            Submit Feedback
          </button>

        </form>
      </div>
    </div>
  );
}
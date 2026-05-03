import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import BackButton from "../../components/common/BackButton";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully 🚀");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 py-16 px-6 relative">
      <BackButton title="Contact Support" />

      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-800 tracking-tight">
          Contact <span className="text-blue-600">MentorHub </span>
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          Have questions? We’re here to help you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">

        {/* ================= LEFT SIDE ================= */}
        <div className="backdrop-blur-lg bg-white/70 border border-white/40 rounded-3xl shadow-2xl p-10 space-y-8">

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Get in Touch
          </h2>

          <div className="flex items-start gap-5 hover:translate-x-1 transition">
            <Mail className="text-blue-600 mt-1" />
            <div>
              <p className="font-medium text-gray-800">Email</p>
              <p className="text-gray-600">
                dsiconnection.project@gmail.com
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5 hover:translate-x-1 transition">
            <Phone className="text-green-600 mt-1" />
            <div>
              <p className="font-medium text-gray-800">Phone</p>
              <p className="text-gray-600">
                +91-XXXXXXXXXX
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5 hover:translate-x-1 transition">
            <MapPin className="text-red-600 mt-1" />
            <div>
              <p className="font-medium text-gray-800">Location</p>
              <p className="text-gray-600">
                Bangalore, Karnataka, India
              </p>
            </div>
          </div>

          <div className="pt-6 border-t text-gray-500 text-sm">
            ⏳ We typically respond within 24 hours.
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="backdrop-blur-lg bg-white/80 border border-white/40 rounded-3xl shadow-2xl p-10">

          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            Send Us a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Message
              </label>
              <textarea
                rows="5"
                required
                placeholder="Write your message..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-xl shadow-lg transition duration-300"
            >
              <Send size={18} />
              Send Message
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
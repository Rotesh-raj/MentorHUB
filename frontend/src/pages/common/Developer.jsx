import { Github, Linkedin, Mail } from "lucide-react";
import BackButton from "../../components/common/BackButton";

export default function Developer() {
  const developers = [
    {
      name: "Ritesh Raj",
      role: "Backend Design By",
      image: "https://gcdnb.pbrd.co/images/oAxcw5er3HIz.jpg?o=1",
      gradient: "from-green-500 to-emerald-600",
      description:
        "Passionate full-stack developer specializing in scalable academic platforms, real-time systems, and secure authentication systems.",
      skills: ["React", "Node.js", "MongoDB", "JWT", "Socket.io"],
    },
    {
      name: "Sarvind Yadav",
      role: "Frontend Design By",
      image: "https://avatars.githubusercontent.com/u/229431101?v=4",
      gradient: "from-blue-500 to-indigo-600",
      description:
        "Focused on frontend architecture, performance optimization, and building secure production-ready applications.",
      skills: ["Express.js", "REST APIs", "Database Design", "Security"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-20 px-6 relative">
      <BackButton title="Developer Info" />

      {/* ===== HEADER ===== */}
      <div className="text-center mb-20">
        <h1 className="text-5xl font-bold text-gray-800">
          Meet The Developers
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          The creators behind MentorHub 🚀
        </p>
      </div>

      {/* ===== CARDS ===== */}
      <div className="grid md:grid-cols-2 gap-14 max-w-6xl mx-auto">
        {developers.map((dev, index) => (
          <div
            key={index}
            className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition duration-500 overflow-hidden group"
          >
            {/* Gradient Top */}
            <div className={`h-32 bg-gradient-to-r ${dev.gradient}`} />

            {/* Floating Avatar */}
            <div className="absolute -top-0 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                {/* Glow Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-blue-400 blur-xl opacity-30 animate-pulse" />

                {/* Profile Image */}
                <img
                  src={dev.image}
                  alt={dev.name}
                  className="relative w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg"
                />
              </div>
            </div>

            {/* Card Content */}
            <div className="pt-20 p-8">

              {/* Name */}
              <h2 className="text-2xl font-bold text-gray-800">
                {dev.name}
              </h2>

              {/* Role */}
              <p className="text-indigo-600 font-medium mt-1">
                {dev.role}
              </p>

              {/* Description */}
              <p className="text-gray-600 mt-5 leading-relaxed">
                {dev.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mt-6">
                {dev.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Social Icons */}
              <div className="flex gap-5 mt-8 pt-6 border-t">
                <a
                  href="#"
                  className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition hover:scale-110"
                >
                  <Github size={20} />
                </a>
                <a
                  href="#"
                  className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition hover:scale-110"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="mailto:dsiconnection.project@gmail.com"
                  className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition hover:scale-110"
                >
                  <Mail size={20} />
                </a>
                
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== FOOTER ===== */}
      <div className="text-center mt-24 text-gray-500 text-sm">
        © 2026 MentorHub — Built with MERN Stack 💚
      </div>
    </div>
  );
}
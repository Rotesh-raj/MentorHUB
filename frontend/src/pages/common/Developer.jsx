import { Github, Linkedin, Mail, Server, Code2, Sparkles, ExternalLink } from "lucide-react";
import BackButton from "../../components/common/BackButton";

/* ─────────────────────────────────────────────────────────────────────────────
   Developer data — only edit this array to update any developer information
───────────────────────────────────────────────────────────────────────────── */
const developers = [
  {
    name: "Ritesh Raj",
    role: "Backend Developer",
    icon: Server,
    image: "https://gcdnb.pbrd.co/images/oAxcw5er3HIz.jpg?o=1",
    gradient: "from-emerald-400 via-teal-400 to-cyan-500",
    cardGlow: "rgba(16,185,129,0.18)",
    hoverGlow: "rgba(16,185,129,0.35)",
    badgeBg: "rgba(16,185,129,0.15)",
    badgeBorder: "rgba(16,185,129,0.3)",
    badgeText: "#6ee7b7",
    description:
      "Architected the entire backend infrastructure of MentorHUB — secure JWT authentication, real-time Socket.IO, AI-powered Groq API integration, role-based access control, and production-grade REST APIs.",
    skills: [
      "Node.js", "Express.js", "MongoDB", "JWT Authentication",
      "Socket.IO", "OpenAI / Groq API", "Nodemailer", "REST APIs",
      "Backend Security", "Role-Based Access Control", "Database Management",
    ],
    linkedin: "https://www.linkedin.com/in/rotesh-raj/",
    github:   "https://github.com/Rotesh-raj",
    email:    "mailto:roteshraj.dev@gmail.com",
  },
  {
    name: "Sarvind Yadav",
    role: "Frontend Developer",
    icon: Code2,
    image: "https://avatars.githubusercontent.com/u/229431101?v=4",
    gradient: "from-blue-400 via-indigo-400 to-violet-500",
    cardGlow: "rgba(99,102,241,0.18)",
    hoverGlow: "rgba(99,102,241,0.35)",
    badgeBg: "rgba(99,102,241,0.15)",
    badgeBorder: "rgba(99,102,241,0.3)",
    badgeText: "#a5b4fc",
    description:
      "Designed and built the complete frontend of MentorHUB — responsive dashboards, real-time chat UI, protected route architecture, pixel-perfect Tailwind CSS components, and seamless backend API integrations.",
    skills: [
      "React.js", "Tailwind CSS", "Vite", "React Router DOM",
      "Axios", "Responsive UI Design", "Dashboard UI/UX",
      "Frontend API Integration", "Protected Routes", "Real-Time Chat UI",
    ],
    linkedin: "https://www.linkedin.com/in/sarvind-yadav-082b493b1/",
    github:   "https://github.com/Sarvind-yadav",
    email:    "mailto:sarvindyadav111@gmail.com",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────────────────── */
export default function Developer() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #09090f 0%, #0f0c29 40%, #18103a 70%, #0a0a14 100%)" }}
    >
      {/* ── Ambient blobs ─────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
        <div className="absolute -bottom-32 -right-32 w-[450px] h-[450px] rounded-full blur-[120px] opacity-20"
          style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] opacity-10"
          style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }} />
      </div>

      <div className="relative z-10 py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

        {/* ── Back button ───────────────────────────────────────────── */}
        <div className="mb-10">
          <BackButton title="Developer Info" />
        </div>

        {/* ── Page Header ───────────────────────────────────────────── */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-6"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <Sparkles size={13} className="text-indigo-300" />
            <span className="text-indigo-200 text-[11px] font-bold uppercase tracking-widest">
              Meet The Team
            </span>
          </div>

          <h1
            className="text-5xl sm:text-6xl font-black text-white mb-5 leading-tight"
          >
            The{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #60a5fa, #818cf8, #34d399, #60a5fa)", backgroundSize: "300% auto" }}
            >
              Builders
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            The engineers who designed, built, and shipped{" "}
            <span className="font-bold text-white">MentorHUB</span> — a production-grade
            Smart Campus Connection Platform.
          </p>
        </div>

        {/* ── Developer Cards Grid ──────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {developers.map((dev) => {
            const RoleIcon = dev.icon;
            return (
              <div
                key={dev.name}
                className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: `0 8px 48px ${dev.cardGlow}`,
                }}
              >
                {/* Gradient top stripe */}
                <div className={`h-[3px] w-full bg-gradient-to-r ${dev.gradient} flex-shrink-0`} />

                {/* Hover glow layer */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${dev.hoverGlow} 0%, transparent 70%)` }}
                />

                <div className="relative p-7 sm:p-8 flex flex-col flex-1">

                  {/* ── Avatar + identity ── */}
                  <div className="flex items-start gap-5 mb-6">
                    <div className="relative flex-shrink-0">
                      {/* Glow halo */}
                      <div
                        className="absolute -inset-1 rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                        style={{ background: `linear-gradient(135deg, ${dev.hoverGlow} 0%, transparent 80%)` }}
                      />
                      <img
                        src={dev.image}
                        alt={`${dev.name} profile photo`}
                        className="relative w-20 h-20 rounded-2xl object-cover"
                        style={{ border: "2px solid rgba(255,255,255,0.15)" }}
                      />
                      {/* Active indicator */}
                      <span className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-emerald-400 rounded-full shadow-lg"
                        style={{ border: "2px solid #09090f" }} />
                    </div>

                    <div className="pt-1 min-w-0">
                      <h2 className="text-2xl font-black text-white leading-tight mb-2 truncate">
                        {dev.name}
                      </h2>
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-gradient-to-r ${dev.gradient}`}
                      >
                        <RoleIcon size={12} className="text-white flex-shrink-0" />
                        <span className="text-white text-[11px] font-bold tracking-wide whitespace-nowrap">
                          {dev.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ── Description ── */}
                  <p
                    className="text-sm text-slate-400 leading-relaxed mb-6 pl-4"
                    style={{ borderLeft: "2px solid rgba(255,255,255,0.08)" }}
                  >
                    {dev.description}
                  </p>

                  {/* ── Tech stack ── */}
                  <div className="mb-7">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 mb-3">
                      Technologies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {dev.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[11px] font-semibold px-3 py-1 rounded-full transition-transform duration-200 hover:scale-105 cursor-default"
                          style={{
                            background: dev.badgeBg,
                            border: `1px solid ${dev.badgeBorder}`,
                            color: dev.badgeText,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ── Social buttons (pushed to bottom) ── */}
                  <div
                    className="flex flex-wrap gap-2.5 pt-5 mt-auto"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    {/* LinkedIn */}
                    <a
                      href={dev.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${dev.name} LinkedIn`}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all duration-200 hover:scale-105 hover:-translate-y-0.5"
                      style={{
                        background: "rgba(10,102,194,0.15)",
                        border: "1px solid rgba(10,102,194,0.3)",
                        color: "#93c5fd",
                      }}
                    >
                      <Linkedin size={14} />
                      LinkedIn
                      <ExternalLink size={10} className="opacity-50" />
                    </a>

                    {/* GitHub */}
                    <a
                      href={dev.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${dev.name} GitHub`}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all duration-200 hover:scale-105 hover:-translate-y-0.5"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.14)",
                        color: "rgba(255,255,255,0.75)",
                      }}
                    >
                      <Github size={14} />
                      GitHub
                      <ExternalLink size={10} className="opacity-50" />
                    </a>

                    {/* Email */}
                    <a
                      href={dev.email}
                      aria-label={`Email ${dev.name}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all duration-200 hover:scale-105 hover:-translate-y-0.5"
                      style={{
                        background: "rgba(239,68,68,0.12)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        color: "#fca5a5",
                      }}
                    >
                      <Mail size={14} />
                      Email
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer branding ───────────────────────────────────────── */}
        <div className="flex justify-center">
          <div
            className="flex flex-col items-center gap-3 px-10 py-7 rounded-2xl text-center"
            style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
              This platform is
            </p>
            <span
              className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #60a5fa, #818cf8, #a78bfa, #60a5fa)", backgroundSize: "300% auto" }}
            >
              Powered by MentorHUB
            </span>
            <p className="text-slate-700 text-xs mt-1">
              © 2026 MentorHub — Smart Campus Connection Platform
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
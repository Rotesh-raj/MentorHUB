import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Server, MessageSquare, Bot, UserCheck, Globe, Mail, ArrowLeft, Users, FileCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';

const PrivacyPolicy = () => {
  const sections = [
    {
      id: "platform-overview",
      title: "1. Platform Overview",
      icon: <Globe className="text-blue-500" size={24} />,
      content: "MentorHub is an AI-powered educational communication and appointment management platform designed to improve interaction between students, teachers, departments, and institutional administrators. The platform enables secure academic communication, appointment scheduling, real-time chat, and department-level administration through a structured multi-role management system."
    },
    {
      id: "role-based-management",
      title: "2. Role-Based Data Management",
      icon: <Users className="text-indigo-500" size={24} />,
      content: (
        <div className="space-y-4 text-slate-600">
          <p>We manage data differently based on the user's role to ensure maximum security and institutional authenticity:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Student:</strong> Personal and academic data used for appointment booking and real-time chat with verified faculty.</li>
            <li><strong>Teacher:</strong> Availability data and communication records used to manage student interactions and mentorship.</li>
            <li><strong>Admin:</strong> Departmental data management, including the uploading of approved institutional CSV files.</li>
            <li><strong>Department SuperAdmin:</strong> Verification data used to approve Admin registrations and validate departmental records.</li>
            <li><strong>Main SuperAdmin:</strong> Platform-wide monitoring data to manage all departments and oversee institutional security.</li>
          </ul>
        </div>
      )
    },
    {
      id: "csv-verification",
      title: "3. CSV Verification & Security",
      icon: <FileCheck className="text-emerald-500" size={24} />,
      content: "To maintain institutional authenticity, we implement a strict CSV verification system. Student and Teacher accounts can only register if their information matches officially approved departmental CSV records. This process validates Names, Emails, Departments, and Staff/Student IDs to prevent unauthorized access and fake registrations."
    },
    {
      id: "collection",
      title: "4. Information We Collect",
      icon: <Eye className="text-amber-500" size={24} />,
      content: "We collect information necessary for the platform's operation, including: Institutional Identifiers (USN/Staff ID), Personal Details (Name, Email), Departmental Affiliation, Appointment Schedules, Chat Transcripts (for educational history), and CSV data uploaded by authorized Admins."
    },
    {
      id: "usage",
      title: "5. How We Use Information",
      icon: <Server className="text-blue-600" size={24} />,
      content: "Information is used for: facilitating the Appointment Booking System, managing Teacher Availability, preventing slot duplication, sending real-time Email Notifications for new requests, and providing an AI-powered Guidance Assistant for academic navigation."
    },
    {
      id: "security",
      title: "6. Security & Authentication",
      icon: <Lock className="text-red-500" size={24} />,
      content: "The platform uses industry-standard security measures including JWT (JSON Web Tokens) for session management, Bcrypt for password encryption, secure reset-password tokens, and strict Role-Based Access Control (RBAC). Admin and SuperAdmin accounts require manual verification levels before activation."
    },
    {
      id: "chat-system",
      title: "7. Real-Time Chat System",
      icon: <MessageSquare className="text-cyan-500" size={24} />,
      content: "Our secure real-time chat system is designed strictly for academic and educational purposes. Conversations between students and teachers are stored securely to maintain a smooth and interactive learning environment."
    },
    {
      id: "ai-disclaimer",
      title: "8. AI Assistant Disclaimer",
      icon: <Bot className="text-purple-500" size={24} />,
      content: "While our AI provides guidance on platform navigation and appointment recommendations, AI-generated responses may not always be 100% accurate. Users should verify critical academic or institutional information independently through official college channels."
    },
    {
      id: "rights",
      title: "9. User Rights & Data Protection",
      icon: <CheckCircle2 className="text-teal-500" size={24} />,
      content: "You have the right to access your profile data, request corrections, and understand how your information is being used within your department. We do not sell user data to third parties. Data is only accessible to authorized institutional roles as per the management hierarchy."
    },
    {
      id: "contact",
      title: "10. Contact Information",
      icon: <Mail className="text-indigo-600" size={24} />,
      content: "For privacy-related inquiries or data access requests, please contact our institutional privacy team at: dsiconnection.project@gmail.com"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <BackButton title="Privacy Center" />
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            MentorHub
          </div>
          <div className="text-sm font-medium text-slate-500">Last Updated: May 2026</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-4 border border-blue-100 uppercase tracking-wider">
            Institutional Privacy
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Empowering Academic Communication Through MentorHub. Learn how we handle your data with institutional integrity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Sidebar TOC - Desktop */}
          <aside className="hidden md:block col-span-1 sticky top-32 h-fit">
            <nav className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Navigation</p>
              {sections.map((section) => (
                <a 
                  key={section.id} 
                  href={`#${section.id}`}
                  className="block py-2 text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium border-l-2 border-transparent hover:border-blue-600 pl-4"
                >
                  {section.title.split('. ')[1]}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="col-span-1 md:col-span-3 space-y-10">
            {sections.map((section, idx) => (
              <motion.section 
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                    {section.icon}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    {section.title}
                  </h2>
                </div>
                <div className="text-slate-600 leading-relaxed text-lg">
                  {section.content}
                </div>
              </motion.section>
            ))}

            <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">MentorHub</h3>
              <p className="opacity-90">Connecting Students, Teachers, and Departments Smarter 🚀</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 MentorHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;

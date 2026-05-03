import React from 'react';
import { motion } from 'framer-motion';
import { FileText, User, ShieldAlert, BookOpen, UserCog, Ban, Bot, Copyright, AlertTriangle, RefreshCw, Scale, ArrowLeft, Users, Calendar, Mail, MessageSquare, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';

const TermsConditions = () => {
  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: <FileText className="text-blue-500" size={24} />,
      content: "By accessing MentorHub, users agree to abide by these Terms and Conditions. This platform is an AI-powered educational communication and appointment management system designed for institutional interaction. Use of this platform constitutes acceptance of all operational policies."
    },
    {
      id: "role-responsibilities",
      title: "2. Role-Based Responsibilities",
      icon: <Users className="text-indigo-500" size={24} />,
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <h4 className="font-bold text-blue-700 flex items-center gap-2 mb-2"><BookOpen size={18}/> Students</h4>
            <p className="text-sm text-slate-600">Must register only after institutional verification. Required to use the platform for legitimate academic purposes, project discussions, and mentorship requests. Misuse of the booking system is prohibited.</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <h4 className="font-bold text-emerald-700 flex items-center gap-2 mb-2"><UserCog size={18}/> Teachers</h4>
            <p className="text-sm text-slate-600">Responsible for setting accurate availability slots and managing appointment requests (Approve/Reject) professionally. Must respond to student communications through the secure real-time chat system.</p>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
            <h4 className="font-bold text-purple-700 flex items-center gap-2 mb-2"><ShieldCheck size={18}/> Admins & SuperAdmins</h4>
            <p className="text-sm text-slate-600">Admins upload approved departmental CSV data. Department SuperAdmins verify Admin registrations. The Main SuperAdmin oversees platform-wide verification and monitoring.</p>
          </div>
        </div>
      )
    },
    {
      id: "csv-security",
      title: "3. CSV Verification & Registration",
      icon: <ShieldAlert className="text-red-500" size={24} />,
      content: "To prevent fake registrations, accounts are only activated if they match approved departmental CSV records. CSV files must contain official institutional data. Only authorized institutional members can access platform-sensitive sections."
    },
    {
      id: "appointment-system",
      title: "4. Appointment Booking System",
      icon: <Calendar className="text-amber-500" size={24} />,
      content: "The platform implements a 'Slot Duplication Prevention' system. Once a slot is booked, it becomes unavailable to others. Teachers receive instant email notifications to review and approve/reject requests directly, ensuring efficient time management."
    },
    {
      id: "chat-system",
      title: "5. Real-Time Chat Usage",
      icon: <MessageSquare className="text-cyan-500" size={24} />,
      content: "The secure chat system is strictly for academic purposes. Smoother and interactive educational communication is encouraged. Any form of abusive or non-academic communication is a violation of these terms."
    },
    {
      id: "prohibited",
      title: "6. Prohibited Activities",
      icon: <Ban className="text-slate-800" size={24} />,
      content: "Users agree not to: create fake accounts, upload unauthorized data, bypass institutional verification, misuse appointment scheduling, engage in abusive communication, or attempt unauthorized access to other departmental records."
    },
    {
      id: "ai-usage",
      title: "7. AI Assistant Usage",
      icon: <Bot className="text-purple-600" size={24} />,
      content: "The AI assistant provides guidance and navigation support. However, users are responsible for independently verifying all critical academic or institutional information. AI suggestions do not constitute official college advice."
    },
    {
      id: "ip",
      title: "8. Intellectual Property",
      icon: <Copyright className="text-blue-600" size={24} />,
      content: "MentorHub platform design, code, and proprietary workflows are protected. Institutional data uploaded remains the property of the respective educational department."
    },
    {
      id: "suspension",
      title: "9. Account Suspension & Action",
      icon: <AlertTriangle className="text-orange-600" size={24} />,
      content: "Violations of platform usage policies will result in account suspension, access restriction, and potential administrative action by the institutional SuperAdmin or platform managers."
    },
    {
      id: "liability",
      title: "10. Limitation of Liability",
      icon: <Scale className="text-slate-700" size={24} />,
      content: "The platform serves as an assistive communication tool. We are not liable for scheduling conflicts, technical communication delays, or decisions made based on AI-generated guidance."
    },
    {
      id: "changes",
      title: "11. Changes to Terms",
      icon: <RefreshCw className="text-teal-600" size={24} />,
      content: "Platform policies may be updated to reflect changes in institutional requirements or technological improvements. Continued usage signifies agreement to the updated terms."
    },
    {
      id: "law",
      title: "12. Governing Law",
      icon: <Scale className="text-slate-900" size={24} />,
      content: "These terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts located in India."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <BackButton title="Operational Terms" />
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 italic">
            MentorHub
          </div>
          <div className="text-sm font-medium text-slate-500">Last Revised: May 2026</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-4 border border-indigo-100 uppercase tracking-wider">
            Operational Policies
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
            Terms & Conditions
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Governing academic communication and professional interaction within the MentorHub ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Sidebar TOC - Desktop */}
          <aside className="hidden md:block col-span-1 sticky top-32 h-fit">
            <nav className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Sections</p>
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

            <div className="mt-12 p-8 rounded-3xl bg-slate-900 text-white text-center">
              <h3 className="text-2xl font-bold mb-2 italic">MentorHub</h3>
              <p className="opacity-70">Connecting Students, Teachers, and Departments Smarter 🚀</p>
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

export default TermsConditions;

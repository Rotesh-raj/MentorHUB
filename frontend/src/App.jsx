import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AIProvider } from "./context/AIContext";
import AIFloatingButton from "./pages/components/AIFloatingButton";
import AIAssistant from "./pages/components/AIAssistant";

/* ================= LANDING & COMMON ================= */
import Landing from "./pages/Landing";
import AdminAuth from "./pages/admin/AdminAuth";
import Contact from "./pages/common/Contact";
import Help from "./pages/common/Help";
import Developer from "./pages/common/Developer";
import Feedback from "./pages/common/Feedback";
import Profile from "./pages/common/Profile";
import PrivacyPolicy from "./pages/common/PrivacyPolicy";
import TermsConditions from "./pages/common/TermsConditions";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

/* ================= ADMIN ================= */
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import UploadStudents from "./pages/admin/UploadStudents";
import UploadTeachers from "./pages/admin/UploadTeachers";

/* ================= STUDENT & TEACHER PAGES ================= */
import StudentLogin from "./pages/auth/StudentLogin";
import StudentRegister from "./pages/auth/StudentRegister";
import TeacherLogin from "./pages/auth/TeacherLogin";
import TeacherRegister from "./pages/auth/TeacherRegister";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeachersList from "./pages/student/TeachersList";
import BookAppointment from "./pages/student/BookAppointment";
import StudentAppointments from "./pages/student/StudentAppointments";
import Chat from "./pages/student/Chat";
import AppointmentRequests from "./pages/teacher/AppointmentRequests";
import TeacherAvailability from "./pages/teacher/Availability";
import TodaySchedule from "./pages/teacher/TodaySchedule";
import TeacherChat from "./pages/teacher/Chat";

function App() {
  const location = useLocation();

  useEffect(() => {
    console.log("Current Path:", location.pathname);
  }, [location]);

  return (
    <AIProvider>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Landing />} />
        
        {/* 🔥 Forgot & Reset (Unified High-Security) */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Auth Pages */}
        <Route path="/admin-auth" element={<AdminAuth />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/teacher/register" element={<TeacherRegister />} />

        {/* ================= PROTECTED ROUTES ================= */}
        
        {/* SuperAdmin */}
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard & Sub-routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="upload/students" element={<UploadStudents />} />
          <Route path="upload/teachers" element={<UploadTeachers />} />
        </Route>

        {/* Student Dashboard & Sub-routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/teachers"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <TeachersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/book-appointment/:teacherId"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/appointments"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/chat/:id"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* Teacher Dashboard & Sub-routes */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/requests"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <AppointmentRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/availability"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherAvailability />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/schedule"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TodaySchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/chat/:id"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherChat />
            </ProtectedRoute>
          }
        />

        {/* ================= COMMON PAGES ================= */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="/developer" element={<Developer />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />

        {/* ================= 404 CATCH-ALL ================= */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-10 text-center">
              <h1 className="text-9xl font-black text-slate-200">404</h1>
              <p className="text-2xl font-bold text-slate-800 -mt-8 mb-4">Page Not Found</p>
              <p className="text-slate-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all"
              >
                Go to Home
              </button>
              <p className="mt-8 text-xs text-slate-400 font-mono">Path: {location.pathname}</p>
            </div>
          }
        />
      </Routes>

      {/* Global Components */}
      <AIFloatingButton />
      <AIAssistant />
    </AIProvider>
  );
}

export default App;

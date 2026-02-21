import AdminLogin from './pages/auth/AdminLogin';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Pages
import Landing from './pages/Landing';
import StudentLogin from './pages/auth/StudentLogin';
import StudentRegister from './pages/auth/StudentRegister';
import TeacherLogin from './pages/auth/TeacherLogin';
import TeacherRegister from './pages/auth/TeacherRegister';
import StudentDashboard from './pages/student/StudentDashboard';
import TeachersList from './pages/student/TeachersList';
import BookAppointment from './pages/student/BookAppointment';
import StudentAppointments from './pages/student/StudentAppointments';
import StudentChat from './pages/student/Chat';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import Availability from './pages/teacher/Availability';
import AppointmentRequests from './pages/teacher/AppointmentRequests';
import TodaySchedule from './pages/teacher/TodaySchedule';
import TeacherChat from './pages/teacher/Chat';
import AdminDashboard from './pages/admin/AdminDashboard';
import UploadStudents from './pages/admin/UploadStudents';
import UploadTeachers from './pages/admin/UploadTeachers';
import ManageUsers from './pages/admin/ManageUsers';
import Profile from './pages/common/Profile';
import NotFound from './pages/common/NotFound';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/student/login" element={<StudentLogin />} />
              <Route path="/student/register" element={<StudentRegister />} />
              <Route path="/teacher/login" element={<TeacherLogin />} />
              <Route path="/teacher/register" element={<TeacherRegister />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              
              {/* Student Routes */}
              <Route path="/student" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/student/teachers" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <TeachersList />
                </ProtectedRoute>
              } />
              <Route path="/student/book/:teacherId" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <BookAppointment />
                </ProtectedRoute>
              } />
              <Route path="/student/appointments" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentAppointments />
                </ProtectedRoute>
              } />
              <Route path="/student/chat/:userId" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentChat />
                </ProtectedRoute>
              } />
              
              {/* Teacher Routes */}
              <Route path="/teacher" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherDashboard />
                </ProtectedRoute>
              } />
              <Route path="/teacher/availability" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <Availability />
                </ProtectedRoute>
              } />
              <Route path="/teacher/requests" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <AppointmentRequests />
                </ProtectedRoute>
              } />
              <Route path="/teacher/schedule" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TodaySchedule />
                </ProtectedRoute>
              } />
              <Route path="/teacher/chat/:userId" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherChat />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/upload/students" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UploadStudents />
                </ProtectedRoute>
              } />
              <Route path="/admin/upload/teachers" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UploadTeachers />
                </ProtectedRoute>
              } />
              <Route path="/admin/manage-users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageUsers />
                </ProtectedRoute>
              } />
              
              {/* Common Routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;

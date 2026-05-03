# Smart Campus Connection - Project File Structure

This file lists all backend and frontend files in the project for easy reference when debugging or sending to AI agents.

## Backend Files
```
backend/
├── hash.js
├── package-lock.json
├── package.json
├── server.js
├── config/
│   ├── db.js
│   └── socket.js
├── controllers/
│   ├── admin.controller.js
│   ├── ai.controller.js
│   ├── appointment.controller.js
│   ├── auth.controller.js
│   ├── availability.controller.js
│   ├── message.controller.js
│   ├── student.controller.js
│   └── superadmin.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   ├── role.middleware.js
│   └── upload.middleware.js
├── models/
│   ├── Appointment.js
│   ├── ApprovedStudent.js
│   ├── ApprovedTeacher.js
│   ├── Availability.js
│   ├── Message.js
│   └── User.js
├── routes/
│   ├── admin.routes.js
│   ├── ai.routes.js
│   ├── appointment.routes.js
│   ├── auth.routes.js
│   ├── availability.routes.js
│   ├── message.routes.js
│   ├── student.routes.js
│   ├── superadmin.routes.js
│   └── teacher.routes.js
├── uploads/ (contains CSV files - data uploads)
├── utils/
│   ├── csvParser.js
│   ├── emailTemplate.js
│   ├── jwt.js
│   ├── sendEmail.js
│   └── validators.js
```

## Frontend Files
```
frontend/
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── api/
│   │   └── axios.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── NotificationContext.jsx
│   │   └── SocketContext.jsx
│   ├── hooks/
│   │   └── useTokenExpiration.js
│   ├── pages/
│   │   ├── ForgotPassword.jsx
│   │   ├── Home.jsx
│   │   ├── Landing.jsx
│   │   ├── admin/
│   │   │   ├── AdminAuth.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageUsers.jsx
│   │   │   ├── UploadStudents.jsx
│   │   │   └── UploadTeachers.jsx
│   │   ├── auth/
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── StudentLogin.jsx
│   │   │   ├── StudentRegister.jsx
│   │   │   ├── TeacherLogin.jsx
│   │   │   └── TeacherRegister.jsx
│   │   ├── common/
│   │   │   ├── Contact.jsx
│   │   │   ├── Developer.jsx
│   │   │   ├── Feedback.jsx
│   │   │   ├── Help.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── Profile.jsx
│   │   ├── components/
│   │   │   ├── AIAssistant.jsx
│   │   │   └── RightMenu.jsx
│   │   ├── student/
│   │   │   ├── BookAppointment.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── StudentAppointments.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── TeachersList.jsx
│   │   ├── superadmin/
│   │   │   └── SuperAdminDashboard.jsx
│   │   └── teacher/
│   │       ├── AppointmentRequests.jsx
│   │       ├── Availability.jsx
│   │       ├── Chat.jsx
│   │       ├── DSi.png
│   │       ├── TeacherDashboard.jsx
│   │       └── TodaySchedule.jsx
│   └── routes/
│       ├── ProtectedRoute.jsx
│       └── RoleRoute.jsx
```

## Root Files
- README.md
- TODO.md
- project_overview.txt
- package-lock.json (root level, possibly shared)

This structure was generated from the project at `d:/PROJECT/Smart-campus-connection`. Use this to quickly identify files for error debugging with AI agents.
```


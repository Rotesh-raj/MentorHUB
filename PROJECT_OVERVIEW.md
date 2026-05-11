# 🎓 MentorHub: Smart Campus Connect
> **Enterprise-Grade Campus Management & Appointment Platform**

MentorHub is a full-stack, real-time platform designed to bridge the gap between Students, Teachers, and Administrators. It streamlines academic appointments, communication, and departmental management through a robust, role-based architecture.

---

## 🏗️ System Architecture & Tech Stack

### **Backend (The Core)**
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Real-time:** Socket.io for instant notifications and chat
- **Security:** JWT (JSON Web Tokens) with Role-Based Access Control (RBAC), Bcrypt.js for password hashing
- **Communications:** Nodemailer with Gmail SMTP for high-deliverability email alerts
- **Automation:** Built-in Cron logic for automatic availability cleanup
- **AI Integration:** OpenAI API for intelligent assistance

### **Frontend (The Interface)**
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS (Modern, Responsive Design)
- **State Management:** React Context API (Auth, Socket, Notifications)
- **Routing:** React Router 6 (Protected & Role-based routes)
- **Icons:** Lucide-React

---

## 👥 Role-Based Features

### **👨‍🎓 Students**
- **Profile Management:** USN-based registration and profile updates.
- **Appointment Booking:** Browse teachers by department and book available slots.
- **Real-time Chat:** Communicate with teachers regarding appointments.
- **Status Tracking:** Real-time updates on appointment status (Pending, Approved, Rejected, Completed).

### **👨‍🏫 Teachers**
- **Availability Management:** Set and manage weekly/daily availability slots.
- **Appointment Handling:** Approve or reject student requests with a single click.
- **Smart Cleanup:** Auto-deletion of past availability to keep the schedule clean.
- **Direct Messaging:** Integrated chat for student coordination.

### **🛡️ Admins**
- **User Management:** Approve/Reject student and teacher accounts.
- **Bulk Uploads:** Enterprise-grade CSV parsing for bulk student/teacher registration.
- **Departmental Stats:** Overview of appointments and user metrics.

### **⚡ SuperAdmins**
- **Global Control:** Full visibility over all colleges, departments, and users.
- **System Health:** Monitoring and high-level management of the entire platform.

---

## 🛠️ Key Technical Implementations

- **Single Device Policy:** Ensures security by invalidating old sessions if a user logs in from a new device.
- **Device Fingerprinting:** Enhanced security for login and registration flows.
- **CSV Processing:** Custom-built robust CSV parser with column mapping and validation.
- **Real-time Rooms:** Socket.io rooms segregated by userId for secure, private communication.
- **Secure Password Recovery:** High-security forgot-password system with expiration and rate limiting.

---

## 📂 Project Structure

```text
├── backend/
│   ├── server.js            # Entry point & Socket.io setup
│   ├── controllers/         # Business logic (Auth, Admin, Student, etc.)
│   ├── models/              # MongoDB Schemas (User, Appointment, Message, etc.)
│   ├── routes/              # Express API endpoints
│   ├── middlewares/         # Auth, Role, Device validation
│   └── utils/               # CSV Parsers, Email, JWT helpers
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance & interceptors
│   │   ├── context/         # Auth, Socket, Notification contexts
│   │   ├── pages/           # Role-specific dashboards & auth pages
│   │   ├── components/      # Reusable UI (AIAssistant, Sidebar, etc.)
│   │   └── routes/          # RBAC Protected Routes
```

---

## 🚀 Getting Started

### **Environment Setup**
Both `frontend` and `backend` require `.env` files for operation (Database URI, JWT Secret, Gmail App Password, etc.).

### **Execution**
- **Backend:** `npm run dev` (Runs on port 5000)
- **Frontend:** `npm run dev` (Runs on port 5173 via Vite)

---
*Created by the MentorHub Engineering Team*

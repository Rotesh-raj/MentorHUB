import express from "express";
import {
  studentRegister,
  teacherRegister,
  adminRegister,
  login,
  studentForgotPassword,
  teacherForgotPassword,
  adminForgotPassword,
  superadminForgotPassword,
  studentResetPassword,
  teacherResetPassword,
  adminResetPassword,
  checkStudentApproval,
  checkTeacherApproval,
  getMe,
  logoutUser,
  getPendingAdmins,
  approveAdmin,
  rejectAdmin
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";




const router = express.Router();

// Registration
router.post("/student/register", studentRegister);
router.post("/teacher/register", teacherRegister);
router.post("/admin/register", adminRegister);


// Login
router.post("/login", login);



// Forgot Password (Role Specific)
router.post("/student/forgot-password", studentForgotPassword);
router.post("/teacher/forgot-password", teacherForgotPassword);
router.post("/admin/forgot-password", adminForgotPassword);
router.post("/superadmin/forgot-password", superadminForgotPassword);

// Reset Password (Role Specific)
router.post("/student/reset-password", studentResetPassword);
router.post("/teacher/reset-password", teacherResetPassword);
router.post("/admin/reset-password", adminResetPassword);

// Helpers
router.get("/check/student/:usn", checkStudentApproval);
router.get("/check/teacher/:staffId", checkTeacherApproval);

/* ================= PROTECTED ROUTES ================= */

router.get("/me", protect, getMe);
router.post("/logout", protect, logoutUser);

// Admin Approval (SuperAdmin Only)
router.get("/admin/pending", protect, getPendingAdmins);
router.patch("/admin/approve/:id", protect, approveAdmin);
router.patch("/admin/reject/:id", protect, rejectAdmin);

export default router;
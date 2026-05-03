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
  resetPassword,
  checkStudentApproval,
  checkTeacherApproval,
  getMe,
  logoutUser,

  // 🔥 NEW (we will create these next)
  getPendingAdmins,
  approveAdmin,
  rejectAdmin

} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */

router.post("/student/register", studentRegister);
router.post("/teacher/register", teacherRegister);
router.post("/admin/register", adminRegister);
router.post("/login", login);
router.post("/student/forgot-password", studentForgotPassword);
router.post("/teacher/forgot-password", teacherForgotPassword);
router.post("/admin/forgot-password", adminForgotPassword);
router.post("/superadmin/forgot-password", superadminForgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/check/student/:usn", checkStudentApproval);
router.get("/check/teacher/:staffId", checkTeacherApproval);
router.get("/admin/pending", protect, getPendingAdmins);
router.patch("/admin/approve/:id", protect, approveAdmin);
router.patch("/admin/reject/:id", protect, rejectAdmin);
/* ================= PROTECTED ROUTES ================= */

router.get("/me", protect, getMe);
router.post("/logout", protect, logoutUser);

export default router;
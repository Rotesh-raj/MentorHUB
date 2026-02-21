import express from "express";
import {
  studentRegister,
  teacherRegister,
  login,
  getMe,
  checkStudentApproval,
  checkTeacherApproval,
  createAdmin
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* PUBLIC ROUTES */
router.post("/student/register", studentRegister);
router.post("/teacher/register", teacherRegister);
router.post("/login", login);
router.post("/create-admin", createAdmin);

router.get("/check/student/:usn", checkStudentApproval);
router.get("/check/teacher/:staffId", checkTeacherApproval);

/* PROTECTED ROUTES */
router.get("/me", protect, getMe);

export default router;
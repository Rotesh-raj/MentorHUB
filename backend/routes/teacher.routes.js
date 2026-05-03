import express from "express";
import {
  getTeacherAppointments,
  getTodaySchedule,
  updateAppointmentStatus,
  updateProfile
} from "../controllers/teacher.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { imageUpload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// All teacher routes protected
router.use(protect);
router.use(authorize("teacher"));

// Routes
router.get("/appointments", getTeacherAppointments);
router.get("/today", getTodaySchedule);
router.patch("/appointment/:id", updateAppointmentStatus);
router.put("/profile", imageUpload.single("profilePic"), updateProfile);

export default router;
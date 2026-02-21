import express from 'express';
import { 
  getTeacherDashboard, 
  getTeacherAppointments, 
  updateAppointmentStatus,
  getTodaySchedule,
  getPendingRequests,
  markCompleted,
  getAllTeachers
  
} from '../controllers/teacher.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

// All routes require authentication and teacher role
router.use(protect);
router.use(authorize('teacher'));

router.get('/dashboard', getTeacherDashboard);
router.get('/appointments', getTeacherAppointments);
router.get('/today', getTodaySchedule);
router.get('/pending', getPendingRequests);
router.patch('/appointment/:id', updateAppointmentStatus);
router.patch('/appointment/:id/complete', markCompleted);

export default router;

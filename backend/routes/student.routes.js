import express from 'express';
import { 
  getAllTeachers, 
  getTeacherById, 
  getStudentAppointments, 
  bookAppointment,
  cancelAppointment,
  getTeachersByDepartment,
  getTeacherAvailability,
  updateProfile
} from '../controllers/student.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { imageUpload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// All routes require authentication and student role
router.use(protect);
router.use(authorize('student'));

router.get('/teachers', getAllTeachers);
router.get('/teachers/department/:department', getTeachersByDepartment);
router.get('/teacher/:id', getTeacherById);
router.get('/teacher/:teacherId/availability', getTeacherAvailability);
router.get('/appointments', getStudentAppointments);
router.post('/book', bookAppointment);
router.delete('/appointment/:id', cancelAppointment);
router.put('/profile', imageUpload.single('profilePic'), updateProfile);

export default router;

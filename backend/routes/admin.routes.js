import express from 'express';
import { 
  uploadStudents,
  uploadTeachers,
  getStats,
  deleteUser,
  getAllUsers,
  getAllAppointments,
  getApprovedStudents,
  getApprovedTeachers
} from '../controllers/admin.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.post('/upload/students', upload.single('file'), uploadStudents);
router.post('/upload/teachers', upload.single('file'), uploadTeachers);
router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/appointments', getAllAppointments);
router.get('/approved/students', getApprovedStudents);
router.get('/approved/teachers', getApprovedTeachers);
router.delete('/user/:id', deleteUser);

export default router;

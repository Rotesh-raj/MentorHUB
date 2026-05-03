import express from 'express';
import { 
  uploadStudents,
  uploadTeachers,
  getStats,
  deleteUser,
  getAllUsers,
  getAllAppointments,
  getApprovedStudents,
  getApprovedTeachers,
  getAdminCSVUploads,
  deleteStudentData,
  deleteTeacherData
} from '../controllers/admin.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// ✅ Stats + user list: both admin AND superadmin can read them
router.get('/stats', authorize('admin', 'superadmin'), getStats);
router.get('/users', authorize('admin', 'superadmin'), getAllUsers);
router.get('/appointments', authorize('admin', 'superadmin'), getAllAppointments);
router.get('/approved/students', authorize('admin', 'superadmin'), getApprovedStudents);
router.get('/approved/teachers', authorize('admin', 'superadmin'), getApprovedTeachers);

// ✅ Mutating routes: admin only (superadmin has own routes)
router.post('/upload/students', authorize('admin'), upload.single('file'), uploadStudents);
router.post('/upload/teachers', authorize('admin'), upload.single('file'), uploadTeachers);
router.get('/csv/uploads', authorize('admin'), getAdminCSVUploads);
router.delete('/user/:id', authorize('admin', 'superadmin'), deleteUser);

// ✅ Bulk Delete Routes (Department Specific)
router.delete('/delete/students', authorize('admin'), deleteStudentData);
router.delete('/delete/teachers', authorize('admin'), deleteTeacherData);

export default router;

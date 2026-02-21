import express from 'express';
import { 
  getAllAppointments,
  getAppointmentById,
  updateStatus,
  getHistory,
  getChatAppointments
} from '../controllers/appointment.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/all', getAllAppointments);
router.get('/history', getHistory);
router.get('/chat/:otherUserId', getChatAppointments);
router.get('/:id', getAppointmentById);
router.patch('/:id/status', updateStatus);

export default router;

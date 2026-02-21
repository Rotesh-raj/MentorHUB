import express from 'express';
import { 
  createAvailability,
  getAvailability,
  updateAvailability,
  deleteAvailability,
  getAvailableSlots
} from '../controllers/availability.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Teacher routes
router.post('/', authorize('teacher'), createAvailability);
router.get('/', authorize('teacher'), getAvailability);
router.get('/slots/:teacherId/:day', getAvailableSlots);
router.put('/:id', authorize('teacher'), updateAvailability);
router.delete('/:id', authorize('teacher'), deleteAvailability);

export default router;

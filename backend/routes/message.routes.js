import express from 'express';
import { getMessages, sendMessage, markAsSeen } from '../controllers/message.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/:appointmentId', getMessages);
router.post('/send', sendMessage);
router.patch('/seen/:appointmentId', markAsSeen);

export default router;

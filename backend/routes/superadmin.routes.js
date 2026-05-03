import express from 'express';
import {
  approveAdmin,
  getAllAdmins,
  deleteAdmin,
  getStats,
  getPendingCSVUploads,
  approveCSVUpload,
  rejectCSVUpload
} from "../controllers/superadmin.controller.js";
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('superadmin'));

router.get('/stats', getStats);
router.get("/admins", getAllAdmins);
router.put("/approve/:id", approveAdmin);
router.delete('/admin/:id', deleteAdmin);

// CSV Approval Routes
router.get("/csv/pending", getPendingCSVUploads);
router.post("/csv/:id/approve", approveCSVUpload);
router.post("/csv/:id/reject", rejectCSVUpload);
export default router;

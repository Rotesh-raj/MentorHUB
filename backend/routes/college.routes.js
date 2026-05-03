import express from "express";
import {
  getAllColleges,
  getCollegeById,
  createCollege
} from "../controllers/college.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

// Public routes for registration drop-down
router.get("/", getAllColleges);
router.get("/:id", getCollegeById);

// Protected route for platform owners/superadmins
router.post("/", protect, authorize("superadmin"), createCollege);

export default router;

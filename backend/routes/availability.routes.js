import express from "express";
import { 
  createAvailability, 
  getAvailability, 
  updateAvailability, 
  deleteAvailability,
  getAvailableSlots,
  toggleAutoDelete
} from "../controllers/availability.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

/* ================= CREATE ================= */
router.post("/", createAvailability);

/* ================= GET ================= */
router.get("/", getAvailability);

/* ================= UPDATE ================= */
router.put("/:id", updateAvailability);

/* ================= DELETE ================= */
router.delete("/:id", deleteAvailability);

/* ================= GET AVAILABLE SLOTS ================= */
router.get("/slots/:teacherId/:date", getAvailableSlots);

/* ================= TOGGLE AUTO DELETE ================= */
router.post("/auto-delete", toggleAutoDelete);

export default router;

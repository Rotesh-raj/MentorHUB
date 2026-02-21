import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* SEND MESSAGE */
router.post("/", protect, sendMessage);

/* GET CHAT MESSAGES */
router.get("/:appointmentId", protect, getMessages);

export default router;

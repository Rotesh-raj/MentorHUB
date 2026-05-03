import express from "express";
import {
  publicAIChat,
  chat,
  analyze,
  multiAgent,
  searchSemantic,
  getInsights,
  markInsightsRead,
  runAgent,
  getUnreadCount
} from "../controllers/ai.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */

router.post("/public-chat", publicAIChat);

/* ================= PROTECTED ROUTES ================= */

// AI Chat with RAG context
router.post("/chat", protect, chat);

// AI Analysis with database context
router.get("/analyze", protect, analyze);

// Multi-agent orchestrator
router.get("/multi-agent", protect, multiAgent);

// Individual agent execution
router.get("/agent/:agentType", protect, runAgent);

// Semantic search over user data
router.post("/semantic-search", protect, searchSemantic);

// Get stored AI insights
router.get("/insights", protect, getInsights);

// Mark insights as read
router.patch("/insights/read", protect, markInsightsRead);

// Get unread insight count
router.get("/insights/unread", protect, getUnreadCount);

export default router;


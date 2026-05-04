import "dotenv/config";

console.log("GROQ KEY LOADED:", !!process.env.GROQ_API_KEY);

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";

// Production Security
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";

import connectDB from "./config/db.js";
import errorMiddleware from "./middlewares/error.middleware.js";

/* ================= ROUTES ================= */
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import availabilityRoutes from "./routes/availability.routes.js";
import messageRoutes from "./routes/message.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import collegeRoutes from "./routes/college.routes.js";
import superadminRoutes from "./routes/superadmin.routes.js";

/* ================= AUTO DELETE IMPORT ================= */
import { autoDeleteOldAvailability } from "./controllers/availability.controller.js";

/* ================= INITIALIZE ================= */
const app = express();
const httpServer = createServer(app);

/* ================= DATABASE ================= */
connectDB();

/* ================= CORS ================= */
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(",") 
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS policy violation"), false);
      }
      return callback(null, true);
    },
    credentials: true
  })
);

/* ================= SECURITY MIDDLEWARE ================= */
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
})); // Set security HTTP headers
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(xss()); // Data sanitization against XSS
app.use(hpp()); // Prevent parameter pollution

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased for development / heavy usage
  message: "Too many requests from this IP, please try again later."
});
app.use("/api", limiter);

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads', {
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

/* ================= SOCKET.IO (REAL-TIME CHAT) ================= */
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Track online users: Map<userId, socketId>
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🟢 Socket Connected:", socket.id);

  // 1️⃣ USER IDENTITY & ONLINE STATUS
  socket.on("join_user", (userId) => {
    socket.join(userId);
    onlineUsers.set(userId, socket.id);
    io.emit("user_status", { userId, status: "online" });
    console.log(`👤 User ${userId} is now online`);
  });

  // 2️⃣ JOIN APPOINTMENT CHAT ROOM
  socket.on("join_chat", ({ appointmentId, userId }) => {
    const roomId = `appointment_${appointmentId}`;
    socket.join(roomId);
    console.log(`💬 User ${userId} joined chat room: ${roomId}`);
    
    // Notify room that user is online in this specific chat
    socket.to(roomId).emit("user_online", userId);
  });

  // 3️⃣ TYPING INDICATORS
  socket.on("typing", ({ roomId, userId, userName }) => {
    socket.to(roomId).emit("user_typing", { userId, userName });
  });

  socket.on("stop_typing", ({ roomId, userId }) => {
    socket.to(roomId).emit("user_stop_typing", { userId });
  });

  // 4️⃣ MESSAGE DELIVERY
  socket.on("send_message", (data) => {
    const { roomId, message } = data;
    // Emit to everyone in room including sender (for sync)
    io.to(roomId).emit("message_received", message);
  });

  // 5️⃣ DISCONNECT
  socket.on("disconnect", () => {
    let disconnectedUserId = null;
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        break;
      }
    }

    if (disconnectedUserId) {
      onlineUsers.delete(disconnectedUserId);
      io.emit("user_status", { userId: disconnectedUserId, status: "offline" });
      console.log(`🔴 User ${disconnectedUserId} went offline`);
    }
  });
});

export { io };

/* ================= AI SOCKET EVENTS ================= */

io.on("connection", (socket) => {
  socket.on("ai:trigger", ({ userId, event }) => {
    // Notify user's room to refresh AI insights
    io.to(userId).emit("ai:refresh", { event, timestamp: new Date().toISOString() });
    console.log(`AI trigger sent to user ${userId} for event: ${event}`);
  });
});

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/college", collegeRoutes);
app.use("/api/superadmin", superadminRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Smart Campus Connect API is running"
  });
});

/* ================= ERROR HANDLER ================= */
app.use(errorMiddleware);

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ================= AUTO DELETE SYSTEM ================= */

// Run once on server start
autoDeleteOldAvailability();

// Run daily (24 hours)
setInterval(() => {
  autoDeleteOldAvailability();
}, 24 * 60 * 60 * 1000);

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

// ✅ Handle server-level errors (EADDRINUSE etc.) without crashing with an unhandled exception
httpServer.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌ Port ${PORT} is already in use.`);
    console.error(`   Fix: run  netstat -ano | findstr :${PORT}  to find the PID,`);
    console.error(`        then: taskkill /PID <PID> /F`);
    console.error(`   Or set a different PORT in backend/.env\n`);
  } else {
    console.error("❌ Server error:", err.message);
  }
  process.exit(1);
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

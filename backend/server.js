import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import { setupSocket } from "./config/socket.js";
import errorMiddleware from "./middlewares/error.middleware.js";

// ROUTES
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import availabilityRoutes from "./routes/availability.routes.js";
import messageRoutes from "./routes/message.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

/* ================= CORS CONFIG ================= */

const allowedOrigins = [
  "http://localhost:5173",
  "https://dsi-connection.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin || // allow Postman or server-side requests
        origin.includes("vercel.app") ||
        origin.includes("localhost")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

/* ================= SOCKET.IO ================= */

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.includes("vercel.app") ||
        origin.includes("localhost")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by Socket CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

/* ================= MIDDLEWARES ================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ================= DATABASE ================= */

connectDB();

/* ================= SOCKET SETUP ================= */

setupSocket(io);

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);

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

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export { io };
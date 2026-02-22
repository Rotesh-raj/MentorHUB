import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
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

/* ================= CORS ================= */

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

/* ================= MIDDLEWARE ================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ================= DATABASE ================= */

connectDB();

/* ================= SOCKET.IO ================= */

const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true
  }
});

// simple connection log
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);

/* ================= HEALTH ================= */

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Smart Campus Connect API is running"
  });
});

/* ================= ERROR ================= */

app.use(errorMiddleware);

/* ================= 404 ================= */

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ================= START ================= */

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
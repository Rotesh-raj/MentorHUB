import mongoose from "mongoose";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Message from "../models/Message.js";
import Availability from "../models/Availability.js";

/* ================= HELPER: Date ranges ================= */

const getDateRanges = () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  return { now, thirtyDaysAgo, sevenDaysAgo };
};

/* ================= STUDENT CONTEXT ================= */

export const getStudentContext = async (userId) => {
  const { thirtyDaysAgo, sevenDaysAgo } = getDateRanges();

  const [
    totalAppointments,
    pendingAppointments,
    approvedAppointments,
    completedAppointments,
    rejectedAppointments,
    recentAppointments,
    messagesSent,
    teachersInteracted,
    departmentTeachers
  ] = await Promise.all([
    Appointment.countDocuments({ studentId: userId }),
    Appointment.countDocuments({ studentId: userId, status: "pending" }),
    Appointment.countDocuments({ studentId: userId, status: "approved" }),
    Appointment.countDocuments({ studentId: userId, status: "completed" }),
    Appointment.countDocuments({ studentId: userId, status: "rejected" }),
    Appointment.find({ studentId: userId })
      .populate("teacherId", "name department")
      .populate("slotId")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
    Message.countDocuments({ senderId: userId }),
    Appointment.distinct("teacherId", { studentId: userId }),
    User.countDocuments({ role: "teacher" })
  ]);

  const recentActivity = recentAppointments.map(a => ({
    topic: a.topic,
    status: a.status,
    teacher: a.teacherId?.name || "Unknown",
    department: a.teacherId?.department || "Unknown",
    date: a.createdAt
  }));

  return {
    role: "student",
    totalAppointments,
    pendingAppointments,
    approvedAppointments,
    completedAppointments,
    rejectedAppointments,
    completionRate: totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0,
    approvalRate: totalAppointments > 0 ? Math.round((approvedAppointments / totalAppointments) * 100) : 0,
    messagesSent,
    uniqueTeachers: teachersInteracted.length,
    totalTeachersAvailable: departmentTeachers,
    teacherCoverage: departmentTeachers > 0 ? Math.round((teachersInteracted.length / departmentTeachers) * 100) : 0,
    recentActivity
  };
};

/* ================= TEACHER CONTEXT ================= */

export const getTeacherContext = async (userId) => {
  const { thirtyDaysAgo, sevenDaysAgo } = getDateRanges();

  const [
    totalAppointments,
    pendingRequests,
    approvedAppointments,
    completedAppointments,
    rejectedAppointments,
    totalAvailabilitySlots,
    bookedSlots,
    upcomingSlots,
    messagesReceived,
    uniqueStudents
  ] = await Promise.all([
    Appointment.countDocuments({ teacherId: userId }),
    Appointment.countDocuments({ teacherId: userId, status: "pending" }),
    Appointment.countDocuments({ teacherId: userId, status: "approved" }),
    Appointment.countDocuments({ teacherId: userId, status: "completed" }),
    Appointment.countDocuments({ teacherId: userId, status: "rejected" }),
    Availability.countDocuments({ teacherId: userId }),
    Availability.countDocuments({ teacherId: userId, bookedStudents: { $exists: true, $not: { $size: 0 } } }),
    Availability.find({ teacherId: userId, date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(5)
      .lean(),
    Message.countDocuments({ receiverId: userId }),
    Appointment.distinct("studentId", { teacherId: userId })
  ]);

  const utilizationRate = totalAvailabilitySlots > 0
    ? Math.round((bookedSlots / totalAvailabilitySlots) * 100)
    : 0;

  const approvalRate = (pendingRequests + approvedAppointments + completedAppointments) > 0
    ? Math.round(((approvedAppointments + completedAppointments) / (pendingRequests + approvedAppointments + completedAppointments + rejectedAppointments)) * 100)
    : 0;

  return {
    role: "teacher",
    totalAppointments,
    pendingRequests,
    approvedAppointments,
    completedAppointments,
    rejectedAppointments,
    totalAvailabilitySlots,
    bookedSlots,
    utilizationRate,
    approvalRate,
    messagesReceived,
    uniqueStudents: uniqueStudents.length,
    upcomingSlotsCount: upcomingSlots.length,
    upcomingSlots: upcomingSlots.map(s => ({
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      bookedCount: s.bookedStudents?.length || 0,
      maxStudents: s.maxStudents
    }))
  };
};

/* ================= ADMIN CONTEXT ================= */

export const getAdminContext = async () => {
  const { thirtyDaysAgo } = getDateRanges();

  const [
    totalStudents,
    totalTeachers,
    totalAdmins,
    totalAppointments,
    pendingAppointments,
    approvedAppointments,
    completedAppointments,
    rejectedAppointments,
    recentAppointments,
    appointmentsLast30Days,
    departmentStats
  ] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "teacher" }),
    User.countDocuments({ role: "admin" }),
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: "pending" }),
    Appointment.countDocuments({ status: "approved" }),
    Appointment.countDocuments({ status: "completed" }),
    Appointment.countDocuments({ status: "rejected" }),
    Appointment.find()
      .populate("studentId", "name")
      .populate("teacherId", "name")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
    Appointment.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    User.aggregate([
      { $match: { role: "teacher" } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
  ]);

  const conversionRate = totalAppointments > 0
    ? Math.round((completedAppointments / totalAppointments) * 100)
    : 0;

  return {
    role: "admin",
    totalStudents,
    totalTeachers,
    totalAdmins,
    totalAppointments,
    pendingAppointments,
    approvedAppointments,
    completedAppointments,
    rejectedAppointments,
    conversionRate,
    appointmentsLast30Days,
    avgAppointmentsPerStudent: totalStudents > 0 ? (totalAppointments / totalStudents).toFixed(1) : 0,
    avgAppointmentsPerTeacher: totalTeachers > 0 ? (totalAppointments / totalTeachers).toFixed(1) : 0,
    departmentStats: departmentStats.map(d => ({ department: d._id || "Unspecified", count: d.count })),
    recentActivity: recentAppointments.map(a => ({
      student: a.studentId?.name || "Unknown",
      teacher: a.teacherId?.name || "Unknown",
      topic: a.topic,
      status: a.status,
      date: a.createdAt
    }))
  };
};

/* ================= SUPERADMIN CONTEXT ================= */

export const getSuperAdminContext = async () => {
  const adminContext = await getAdminContext();

  const [
    unapprovedAdmins,
    totalMessages,
    totalAvailabilitySlots,
    avgResponseTime
  ] = await Promise.all([
    User.countDocuments({ role: "admin", isApproved: false }),
    Message.countDocuments(),
    Availability.countDocuments(),
    // Approximate: average time from pending to approved/completed
    Appointment.aggregate([
      {
        $match: {
          status: { $in: ["approved", "completed"] },
          updatedAt: { $exists: true },
          createdAt: { $exists: true }
        }
      },
      {
        $project: {
          responseTime: { $subtract: ["$updatedAt", "$createdAt"] }
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: "$responseTime" }
        }
      }
    ])
  ]);

  const avgResponseHours = avgResponseTime[0]?.avgResponseTime
    ? Math.round(avgResponseTime[0].avgResponseTime / (1000 * 60 * 60))
    : null;

  return {
    ...adminContext,
    role: "superadmin",
    unapprovedAdmins,
    totalMessages,
    totalAvailabilitySlots,
    avgResponseHours: avgResponseHours || "N/A",
    platformHealth: adminContext.pendingAppointments > 20 ? "concerning" : adminContext.pendingAppointments > 10 ? "moderate" : "healthy"
  };
};

/* ================= UNIFIED CONTEXT FETCHER ================= */

export const getUserContext = async (userId, role) => {
  switch (role) {
    case "student":
      return getStudentContext(userId);
    case "teacher":
      return getTeacherContext(userId);
    case "admin":
      return getAdminContext();
    case "superadmin":
      return getSuperAdminContext();
    default:
      return getStudentContext(userId);
  }
};

/* ================= FORMAT CONTEXT FOR PROMPT ================= */

export const formatContextForPrompt = (context) => {
  return JSON.stringify(context, null, 2);
};


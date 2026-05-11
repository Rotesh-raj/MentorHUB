import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import { 
  appointmentApprovedEmail, 
  appointmentRejectedEmail 
} from "../utils/emailTemplate.js";

/* ================= GET ALL APPOINTMENTS (ADMIN) ================= */
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("studentId", "name email department referenceId")
      .populate("teacherId", "name email department")
      .populate("slotId")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET APPOINTMENT BY ID ================= */
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("studentId", "name email department profilePic referenceId")
      .populate("teacherId", "name email department profilePic")
      .populate("slotId");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE STATUS (APPROVE / REJECT) ================= */
export const updateStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;

    const appointment = await Appointment.findById(req.params.id)
      .populate("studentId")
      .populate("teacherId")
      .populate("slotId");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Free slot if rejected or cancelled - remove student from bookedStudents array
    if (status === "rejected" || status === "cancelled") {
      await Availability.findByIdAndUpdate(appointment.slotId._id, {
        $pull: { bookedStudents: appointment.studentId._id }
      });
    }

    appointment.status = status;

    if (status === "rejected") {
      appointment.reason = reason || "No reason provided";
    }

    await appointment.save();

    res.json({
      message: `Appointment ${status} successfully`,
      appointment
    });

    // ✅ EMAIL ADDED - Appointment Status Update (Point 6 & 7)
    try {
      if (status === "approved") {
        sendEmail({
          email: appointment.studentId.email,
          subject: "Your Appointment Has Been Approved! 🎉",
          message: appointmentApprovedEmail(
            appointment.studentId.name,
            appointment.teacherId.name,
            appointment.slotId.date,
            appointment.slotId.startTime
          )
        });
      } else if (status === "rejected") {
        sendEmail({
          email: appointment.studentId.email,
          subject: "Appointment Update - MentorHub",
          message: appointmentRejectedEmail(
            appointment.studentId.name,
            appointment.teacherId.name,
            appointment.reason
          )
        });
      }
    } catch (emailError) {
      console.error("❌ Email error (non-blocking):", emailError.message);
    }

  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET HISTORY ================= */
export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    let query = {};
    if (user.role === "student") {
      query = { studentId: userId };
    } else if (user.role === "teacher") {
      query = { teacherId: userId };
    }

    const appointments = await Appointment.find(query)
      .populate("studentId", "name email department profilePic")
      .populate("teacherId", "name email department profilePic")
      .populate("slotId")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= CHAT APPOINTMENTS ================= */
export const getChatAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    const appointments = await Appointment.find({
      $or: [
        { studentId: userId, teacherId: otherUserId, status: "approved" },
        { teacherId: userId, studentId: otherUserId, status: "approved" }
      ]
    })
      .populate("studentId", "name profilePic")
      .populate("teacherId", "name profilePic");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET APPOINTMENT FOR CHAT ================= */
export const getAppointmentForChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate("studentId", "name email department profilePic referenceId")
      .populate("teacherId", "name email department profilePic referenceId")
      .populate("slotId");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (
      appointment.studentId._id.toString() !== userId &&
      appointment.teacherId._id.toString() !== userId
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (appointment.status !== "approved") {
      return res.status(400).json({
        message: "Chat only available for approved appointments"
      });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

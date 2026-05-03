import User from '../models/User.js';
import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";
import sendEmail from "../utils/sendEmail.js";

/* ================= GET ALL APPOINTMENTS ================= */
export const getTeacherAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      teacherId: req.user.id
    })
      .populate("studentId", "name referenceId email")
      .populate("slotId")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    console.error("GET APPOINTMENTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

/* ================= GET TODAY SCHEDULE ================= */
export const getTodaySchedule = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      teacherId,
      status: { $in: ["approved", "completed"] }
    })
      .populate("studentId", "name referenceId email")
      .populate({
        path: "slotId",
        match: {
          date: { $gte: today, $lt: tomorrow }
        }
      })
      .sort({ createdAt: 1 });

    // Remove non-today results
    const filtered = appointments.filter(a => a.slotId !== null);

    res.json(filtered);

  } catch (error) {
    console.error("TODAY SCHEDULE ERROR:", error);
    res.status(500).json({ message: "Failed to fetch schedule" });
  }
};

/* ================= UPDATE APPOINTMENT STATUS ================= */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      teacherId: req.user.id
    })
      .populate("studentId")
      .populate("slotId");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (status === "rejected" || status === "cancelled") {
      await Availability.findByIdAndUpdate(
        appointment.slotId._id,
        { isBooked: false }
      );
    }

    appointment.status = status;

    if (status === "rejected") {
      appointment.reason = reason || "No reason provided";
    }

    await appointment.save();

    // Send email to student
    if ((status === "approved" || status === "rejected") && appointment.studentId.email) {
      const subject =
        status === "approved"
          ? "🎉 Appointment Approved"
          : "❌ Appointment Rejected";

      const html = `
        <h2>${subject}</h2>
        <p>Hello ${appointment.studentId.name},</p>
        <p>Your appointment status is now: <strong>${status}</strong></p>
        <p>Date: ${appointment.slotId?.date?.toDateString()}</p>
        <p>Time: ${appointment.slotId?.startTime}</p>
      `;

      sendEmail({
        email: appointment.studentId.email,
        subject,
        message: html
      }).catch(err =>
        console.error("EMAIL ERROR:", err.message)
      );
    }

    res.json({
      message: `Appointment ${status} successfully`,
      appointment
    });

  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    res.status(500).json({ message: "Failed to update appointment" });
  }
};

/* ================= UPDATE TEACHER PROFILE ================= */
export const updateProfile = async (req, res) => {
  try {
    const { department, bio, specialization } = req.body;
    const updateData = {};

    if (department) updateData.department = department;
    if (bio) updateData.bio = bio;
    if (specialization) updateData.specialization = specialization;

    // Handle Profile Picture if uploaded
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      updateData.profilePic = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("UPDATE TEACHER PROFILE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
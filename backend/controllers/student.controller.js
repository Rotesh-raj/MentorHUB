import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";

/* ================= GET ALL TEACHERS ================= */

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
      .select("name email department referenceId");

    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
};

/* ================= GET TEACHERS BY DEPARTMENT ================= */
export const getTeachersByDepartment = async (req, res) => {
  try {
    const teachers = await User.find({
      role: "teacher",
      department: req.params.department
    }).select("name email department referenceId");

    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
};

/* ================= GET TEACHER BY ID ================= */
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id)
      .select("name email department referenceId");

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teacher" });
  }
};

/* ================= GET TEACHER AVAILABILITY ================= */
export const getTeacherAvailability = async (req, res) => {
  try {
    const slots = await Availability.find({
      teacherId: req.params.teacherId,
      isBooked: false
    });

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch availability" });
  }
};

/* ================= GET STUDENT APPOINTMENTS ================= */
export const getStudentAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ studentId: req.user.id })
      .populate("teacherId", "name department")
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

/* ================= BOOK APPOINTMENT ================= */
export const bookAppointment = async (req, res) => {
  try {
    const { teacherId, slotId, topic, description } = req.body;

    // Check slot exists
    const slot = await Availability.findById(slotId);
    if (!slot)
      return res.status(404).json({ message: "Slot not found" });

    // Check slot belongs to teacher
    if (slot.teacherId.toString() !== teacherId)
      return res.status(400).json({ message: "Invalid slot selected" });

    // Check already booked
    if (slot.isBooked)
      return res.status(400).json({ message: "Slot already booked" });

    // Create appointment
    const appointment = await Appointment.create({
      studentId: req.user.id,
      teacherId,
      slotId,
      topic,
      description,
      status: "pending"
    });

    // Mark slot booked
    slot.isBooked = true;
    await slot.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment
    });

  } catch (error) {
    console.error("BOOK ERROR:", error);
    res.status(500).json({ message: "Failed to book appointment" });
  }
};

/* ================= CANCEL APPOINTMENT ================= */
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    await Availability.findByIdAndUpdate(appointment.slotId, { isBooked: false });

    await appointment.deleteOne();

    res.json({ message: "Appointment cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
};

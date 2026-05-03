import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";
import { appointmentBookingNotification } from "../utils/emailTemplate.js";
import sendEmail from "../utils/sendEmail.js";

/* ================= GET ALL TEACHERS ================= */
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
      .select("name email department referenceId profilePic bio specialization");

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
    }).select("name email department referenceId profilePic bio specialization");

    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
};

/* ================= GET TEACHER BY ID ================= */
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id)
      .select("name email department referenceId profilePic bio specialization");

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teacher" });
  }
};

/* ================= GET TEACHER AVAILABILITY ================= */
export const getTeacherAvailability = async (req, res) => {
  try {
    // Get all slots for this teacher
    const slots = await Availability.find({
      teacherId: req.params.teacherId
    });

    // Filter to only show available slots (not full)
    const availableSlots = slots.filter(slot => 
      !slot.bookedStudents || slot.bookedStudents.length < slot.maxStudents
    );

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch availability" });
  }
};

/* ================= GET STUDENT APPOINTMENTS ================= */
export const getStudentAppointments = async (req, res) => {
  try {
    console.log(`📡 [FETCH] Student Appointments requested by: ${req.user.name} (${req.user.id})`);
    
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

    // Check if slot is already full for this student
    if (slot.bookedStudents && slot.bookedStudents.includes(req.user.id))
      return res.status(400).json({ message: "You have already booked this slot" });

    // Check if slot is full
    const maxStudents = slot.maxStudents || 5;
    const currentBookings = slot.bookedStudents ? slot.bookedStudents.length : 0;
    if (currentBookings >= maxStudents)
      return res.status(400).json({ message: "Slot is fully booked" });

    // Create appointment
    const appointment = await Appointment.create({
      studentId: req.user.id,
      teacherId,
      slotId,
      topic,
      description,
      status: "pending"
    });

    // Add student to bookedStudents array
    await Availability.findByIdAndUpdate(slotId, {
      $addToSet: { bookedStudents: req.user.id }
    });

    const student = await User.findById(appointment.studentId);
    const teacher = await User.findById(appointment.teacherId);

    // Send email to teacher (non-blocking)
    if (teacher && teacher.email) {
      await sendEmail({
        email: teacher.email,
        subject: "New Appointment Request - MentorHub",
        message: appointmentBookingNotification({
          teacherName: teacher.name,
          studentName: student.name,
          year: student.year,
          section: student.section,
          topic: appointment.topic,
          date: slot.date,
          time: slot.startTime
        })
      });
    }

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

    // Remove student from bookedStudents array
    await Availability.findByIdAndUpdate(appointment.slotId, {
      $pull: { bookedStudents: appointment.studentId }
    });

    await appointment.deleteOne();

    res.json({ message: "Appointment cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
};

/* ================= UPDATE STUDENT PROFILE ================= */
export const updateProfile = async (req, res) => {
  try {
    const { year, college, section } = req.body;
    const updateData = {};

    if (year) updateData.year = year;
    if (college) updateData.college = college;
    if (section) updateData.section = section;

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
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

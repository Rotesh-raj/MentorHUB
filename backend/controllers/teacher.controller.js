import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Availability from '../models/Availability.js';

// Get teacher dashboard data
export const getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user.id;
    
    // Get today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await Appointment.find({
      teacherId,
      date: { $gte: today, $lt: tomorrow },
      status: { $in: ['pending', 'approved'] }
    })
    .populate('studentId', 'name email department profilePic')
    .populate('slotId')
    .sort({ time: 1 });

    // Get pending requests
    const pendingRequests = await Appointment.find({
      teacherId,
      status: 'pending'
    })
    .populate('studentId', 'name email department profilePic')
    .populate('slotId')
    .sort({ createdAt: -1 });

    // Get total completed appointments
    const completedCount = await Appointment.countDocuments({
      teacherId,
      status: 'completed'
    });

    res.json({
      todayAppointments,
      pendingRequests,
      completedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all appointments for teacher
export const getTeacherAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ teacherId: req.user.id })
      .populate('studentId', 'name email department profilePic')
      .populate('slotId')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      teacherId: req.user.id
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (status === 'rejected' || status === 'cancelled') {
      // Free the slot if rejected or cancelled
      await Availability.findByIdAndUpdate(appointment.slotId, { isBooked: false });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      message: `Appointment ${status} successfully`,
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get today's schedule
export const getTodaySchedule = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      teacherId,
      date: { $gte: today, $lt: tomorrow },
      status: { $in: ['approved', 'completed'] }
    })
    .populate('studentId', 'name email department profilePic')
    .populate('slotId')
    .sort({ time: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending requests
export const getPendingRequests = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      teacherId: req.user.id,
      status: 'pending'
    })
    .populate('studentId', 'name email department profilePic')
    .populate('slotId')
    .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark appointment as completed
export const markCompleted = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      teacherId: req.user.id
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'completed';
    await appointment.save();

    res.json({
      message: 'Appointment marked as completed',
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL TEACHERS FOR STUDENTS ================= */
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
      .select("name email department referenceId");

    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

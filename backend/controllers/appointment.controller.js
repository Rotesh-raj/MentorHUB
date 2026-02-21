import Appointment from '../models/Appointment.js';
import Availability from '../models/Availability.js';
import User from '../models/User.js';

// Get all appointments (for admin)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('studentId', 'name email department referenceId')
      .populate('teacherId', 'name email department')
      .populate('slotId')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('studentId', 'name email department profilePic')
      .populate('teacherId', 'name email department profilePic')
      .populate('slotId');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update appointment status
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // If rejecting or cancelling, free the slot
    if (status === 'rejected' || status === 'cancelled') {
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

// Get appointment history for a user
export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    let query = {};
    if (user.role === 'student') {
      query = { studentId: userId };
    } else if (user.role === 'teacher') {
      query = { teacherId: userId };
    }

    const appointments = await Appointment.find(query)
      .populate('studentId', 'name email department profilePic')
      .populate('teacherId', 'name email department profilePic')
      .populate('slotId')
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get appointments between two users (for chat)
export const getChatAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    const appointments = await Appointment.find({
      $or: [
        { studentId: userId, teacherId: otherUserId, status: 'approved' },
        { teacherId: userId, studentId: otherUserId, status: 'approved' }
      ]
    }).populate('studentId', 'name profilePic')
      .populate('teacherId', 'name profilePic');

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

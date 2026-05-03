import Message from '../models/Message.js';
import Appointment from '../models/Appointment.js';
import { io } from '../server.js';

/* ================= GET MESSAGES BY APPOINTMENT ================= */
export const getMessages = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;

    // Verify appointment exists and user is part of it
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    if (appointment.studentId.toString() !== userId && appointment.teacherId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to view this chat" });
    }

    const messages = await Message.find({ appointmentId })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name role');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= SEND MESSAGE ================= */
export const sendMessage = async (req, res) => {
  try {
    const { appointmentId, message, receiverId } = req.body;
    const senderId = req.user.id;

    // 1. Verify appointment is approved
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    if (appointment.status !== 'approved') {
      return res.status(403).json({ message: "Chat is only available for approved appointments" });
    }

    // 2. Save to Database
    const newMessage = await Message.create({
      senderId,
      receiverId,
      appointmentId,
      message
    });

    const populatedMessage = await Message.findById(newMessage._id).populate('senderId', 'name role');

    // 3. Emit via Socket.IO
    const roomId = `appointment_${appointmentId}`;
    io.to(roomId).emit("message_received", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= MARK AS SEEN ================= */
export const markAsSeen = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;

    await Message.updateMany(
      { appointmentId, receiverId: userId, seen: false },
      { $set: { seen: true } }
    );

    res.json({ message: "Messages marked as seen" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

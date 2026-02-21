
import Message from "../models/Message.js";
import Appointment from "../models/Appointment.js";

/* ================= GET MESSAGES ================= */
export const getMessages = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    // Only approved appointment can chat
    if (appointment.status !== "approved")
      return res.status(403).json({ message: "Chat not allowed yet" });

    const messages = await Message.find({ appointmentId: appointment._id })

      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {
    console.error("GET CHAT ERROR:", error);
    res.status(500).json({ message: "Failed to load chat" });
  }
};


/* ================= SEND MESSAGE ================= */
export const sendMessage = async (req, res) => {
  try {
    const { appointmentId, message } = req.body; // <-- changed text -> message

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (appointment.status !== "approved")
      return res.status(403).json({ message: "Chat not allowed yet" });

    const newMessage = await Message.create({
      appointmentId,
      sender: req.user.id,
      text: message // <-- map correctly
    });

    const populated = await newMessage.populate("sender", "name role");

    res.status(201).json(populated);

  } catch (error) {
    console.error("SEND CHAT ERROR:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

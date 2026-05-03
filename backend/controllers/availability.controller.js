import Availability from '../models/Availability.js';
import User from '../models/User.js';

// Create availability slots
export const createAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime, maxStudents } = req.body;
    const teacherId = req.user.id;

    // Check if slot already exists for this time
    const existingSlot = await Availability.findOne({
      teacherId,
      date,
      startTime,
      endTime
    });

    if (existingSlot) {
      return res.status(400).json({ message: 'This slot already exists' });
    }

    const availability = await Availability.create({
      teacherId,
      date,
      startTime,
      endTime,
      maxStudents: maxStudents || 5,
      bookedStudents: []
    });

    res.status(201).json({
      message: 'Availability slot created successfully',
      availability
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get teacher's availability
export const getAvailability = async (req, res) => {
  try {
    const teacherId = req.params.teacherId || req.user.id;
    
    const availability = await Availability.find({ teacherId })
      .sort({ date: 1, startTime: 1 });

    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update availability slot
export const updateAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime, maxStudents } = req.body;
    const availability = await Availability.findOne({
      _id: req.params.id,
      teacherId: req.user.id
    });

    if (!availability) {
      return res.status(404).json({ message: 'Availability slot not found' });
    }

    if (date) availability.date = date;
    if (startTime) availability.startTime = startTime;
    if (endTime) availability.endTime = endTime;
    if (maxStudents) availability.maxStudents = maxStudents;

    await availability.save();

    res.json({
      message: 'Availability updated successfully',
      availability
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete availability slot
export const deleteAvailability = async (req, res) => {
  try {
    const availability = await Availability.findOne({
      _id: req.params.id,
      teacherId: req.user.id
    });

    if (!availability) {
      return res.status(404).json({ message: 'Availability slot not found' });
    }

    // Check if slot has booked students
    if (availability.bookedStudents && availability.bookedStudents.length > 0) {
      return res.status(400).json({ message: 'Cannot delete a booked slot' });
    }

    await availability.deleteOne();

    res.json({ message: 'Availability slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Auto delete old availability slots
export const autoDeleteOldAvailability = async () => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    await Availability.deleteMany({
      date: { $lt: oneMonthAgo }
    });

    console.log("Old availability cleaned");
  } catch (error) {
    console.error("Auto delete error:", error);
  }
};

export const toggleAutoDelete = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const teacher = await User.findById(teacherId);
    teacher.autoDeleteEnabled = !teacher.autoDeleteEnabled;
    await teacher.save();

    res.json({
      autoDeleteEnabled: teacher.autoDeleteEnabled
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to toggle auto delete" });
  }
};

// Get available slots for booking
export const getAvailableSlots = async (req, res) => {
  try {
    const { teacherId, date } = req.params;

    const slots = await Availability.find({
      teacherId,
      date
    }).sort({ startTime: 1 });

    // Filter to only show slots that are not fully booked
    const availableSlots = slots.filter(slot => 
      !slot.bookedStudents || slot.bookedStudents.length < slot.maxStudents
    );

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

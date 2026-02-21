import Availability from '../models/Availability.js';

// Create availability slots
export const createAvailability = async (req, res) => {
  try {
    const { day, startTime, endTime } = req.body;
    const teacherId = req.user.id;

    // Check if slot already exists for this time
    const existingSlot = await Availability.findOne({
      teacherId,
      day,
      startTime,
      endTime
    });

    if (existingSlot) {
      return res.status(400).json({ message: 'This slot already exists' });
    }

    const availability = await Availability.create({
      teacherId,
      day,
      startTime,
      endTime
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
      .sort({ day: 1, startTime: 1 });

    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update availability slot
export const updateAvailability = async (req, res) => {
  try {
    const { day, startTime, endTime, isBooked } = req.body;
    const availability = await Availability.findOne({
      _id: req.params.id,
      teacherId: req.user.id
    });

    if (!availability) {
      return res.status(404).json({ message: 'Availability slot not found' });
    }

    if (day) availability.day = day;
    if (startTime) availability.startTime = startTime;
    if (endTime) availability.endTime = endTime;
    if (isBooked !== undefined) availability.isBooked = isBooked;

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

    if (availability.isBooked) {
      return res.status(400).json({ message: 'Cannot delete a booked slot' });
    }

    await availability.deleteOne();

    res.json({ message: 'Availability slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available slots for booking
export const getAvailableSlots = async (req, res) => {
  try {
    const { teacherId, day } = req.params;

    const slots = await Availability.find({
      teacherId,
      day,
      isBooked: false
    }).sort({ startTime: 1 });

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import User from '../models/User.js';
import ApprovedStudent from '../models/ApprovedStudent.js';
import ApprovedTeacher from '../models/ApprovedTeacher.js';
import Appointment from '../models/Appointment.js';
import Message from '../models/Message.js';
import { parseCSV } from '../utils/csvParser.js';

// Upload approved students
import fs from "fs";

export const uploadStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // read CSV file from uploads folder
    const fileContent = fs.readFileSync(req.file.path, "utf-8");
    const students = await parseCSV(fileContent);

    const formattedStudents = students.map(student => ({
      usn: (student.usn || student.USN).toUpperCase(),
      name: student.name || student.Name,
      department: student.department || student.Department,
      semester: parseInt(student.semester || student.Semester) || 1,
      email: student.email || student.Email,
      registered: false
    }));

    const operations = formattedStudents.map(student => ({
      updateOne: {
        filter: { usn: student.usn },
        update: student,
        upsert: true
      }
    }));

    await ApprovedStudent.bulkWrite(operations);

    // delete file after upload
    fs.unlinkSync(req.file.path);

    res.json({
      message: `Successfully uploaded ${formattedStudents.length} students`,
      count: formattedStudents.length
    });

  } catch (error) {
    console.error("UPLOAD STUDENTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// Upload approved teachers
export const uploadTeachers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileContent = fs.readFileSync(req.file.path, "utf-8");
    const teachers = await parseCSV(fileContent);

    const formattedTeachers = teachers.map(teacher => ({
      staffId: (teacher.staffId || teacher.staffID || teacher.StaffId || teacher.StaffID).toUpperCase(),
      name: teacher.name || teacher.Name,
      department: teacher.department || teacher.Department,
      email: teacher.email || teacher.Email,
      registered: false
    }));

    const operations = formattedTeachers.map(teacher => ({
      updateOne: {
        filter: { staffId: teacher.staffId },
        update: teacher,
        upsert: true
      }
    }));

    await ApprovedTeacher.bulkWrite(operations);

    fs.unlinkSync(req.file.path);

    res.json({
      message: `Successfully uploaded ${formattedTeachers.length} teachers`,
      count: formattedTeachers.length
    });

  } catch (error) {
    console.error("UPLOAD TEACHERS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get platform statistics
export const getStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalAppointments = await Appointment.countDocuments();
    const totalMessages = await Message.countDocuments();
    
    const approvedStudents = await ApprovedStudent.countDocuments();
    const approvedTeachers = await ApprovedTeacher.countDocuments();
    const registeredStudents = await ApprovedStudent.countDocuments({ registered: true });
    const registeredTeachers = await ApprovedTeacher.countDocuments({ registered: true });

    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });

    res.json({
      users: {
        totalStudents,
        totalTeachers,
        total: totalStudents + totalTeachers
      },
      approved: {
        students: approvedStudents,
        teachers: approvedTeachers,
        registeredStudents,
        registeredTeachers
      },
      appointments: {
        total: totalAppointments,
        pending: pendingAppointments,
        completed: completedAppointments
      },
      messages: {
        total: totalMessages
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update approved list
    if (user.role === 'student') {
      await ApprovedStudent.findOneAndUpdate(
        { usn: user.referenceId },
        { registered: false }
      );
    } else if (user.role === 'teacher') {
      await ApprovedTeacher.findOneAndUpdate(
        { staffId: user.referenceId },
        { registered: false }
      );
    }

    await user.deleteOne();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all appointments (admin view)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('studentId', 'name email department referenceId')
      .populate('teacherId', 'name email department referenceId')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get approved students list
export const getApprovedStudents = async (req, res) => {
  try {
    const students = await ApprovedStudent.find().sort({ usn: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get approved teachers list
export const getApprovedTeachers = async (req, res) => {
  try {
    const teachers = await ApprovedTeacher.find().sort({ staffId: 1 });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

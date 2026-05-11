import fs from "fs";
import User from "../models/User.js";
import ApprovedStudent from "../models/ApprovedStudent.js";
import ApprovedTeacher from "../models/ApprovedTeacher.js";
import Appointment from "../models/Appointment.js";
import { parseCSV, validateStudentCSV, validateTeacherCSV, mapStudentRow, mapTeacherRow } from "../utils/csvParser.js";
import CSVUpload from "../models/CSVUpload.js";
import sendEmail from "../utils/sendEmail.js";
import { accountRejectedEmail } from "../utils/emailTemplate.js";

export const uploadStudents = async (req, res) => {
  // Always clean up uploaded temp file when we're done
  const cleanup = () => {
    if (req.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch (_) {}
    }
  };

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    // ✅ Step 1 — File extension guard
    if (!req.file.originalname.toLowerCase().endsWith(".csv")) {
      cleanup();
      return res.status(400).json({
        success: false,
        message: "❌ Invalid file type. Please upload a .csv file only."
      });
    }

    // ✅ Step 2 — Parse CSV
    const fileContent = fs.readFileSync(req.file.path, "utf-8").trim();

    if (!fileContent) {
      cleanup();
      return res.status(400).json({
        success: false,
        message: "❌ Uploaded CSV file is empty. Please upload a valid CSV file."
      });
    }

    const rows = await parseCSV(fileContent);

    // ✅ Step 3 — Column validation
    const validation = validateStudentCSV(rows);
    if (!validation.valid) {
      cleanup();
      return res.status(400).json({ success: false, message: validation.message });
    }

    const { columnMap } = validation;

    // ✅ Step 4 — Map + row-level filter
    const validStudents   = [];
    const invalidRowCount = { value: 0 };

    for (const student of rows) {
      const mapped = mapStudentRow(student, columnMap);

      if (mapped.usn && mapped.name && mapped.year && mapped.section && mapped.department) {
        validStudents.push(mapped);
      } else {
        invalidRowCount.value++;
      }
    }

    if (validStudents.length === 0) {
      cleanup();
      return res.status(400).json({
        success: false,
        message: `❌ No valid student rows found. ${invalidRowCount.value} rows were skipped due to missing required fields.`
      });
    }

    // ✅ Step 5 — Create CSV Upload Record
    const csvUpload = await CSVUpload.create({
      uploadedBy: req.user._id,
      collegeId: req.user.collegeId,
      department: req.user.department,
      type: "student",
      fileName: req.file.originalname,
      status: "pending",
      recordsCount: validStudents.length
    });

    // ✅ Step 6 — Detect which USNs already exist
    const incomingUSNs  = validStudents.map(s => s.usn);
    const existingDocs  = await ApprovedStudent.find({ usn: { $in: incomingUSNs }, collegeId: req.user.collegeId }).select("usn");
    const existingUSNs  = new Set(existingDocs.map(d => d.usn));
    const duplicateCount = existingUSNs.size;

    // ✅ Step 7 — Upsert
    const operations = validStudents.map(student => ({
      updateOne: {
        filter: { usn: student.usn, collegeId: req.user.collegeId },
        update: { 
          $set: {
            ...student,
            collegeId: req.user.collegeId,
            uploadBatchId: csvUpload._id,
            approved: false // Requires superadmin approval
          }
        },
        upsert: true
      }
    }));

    await ApprovedStudent.bulkWrite(operations, { ordered: false });

    cleanup();

    res.json({
      success: true,
      message: `✅ CSV uploaded successfully. Pending SuperAdmin approval.`,
      count: validStudents.length,
      duplicatesSkipped: duplicateCount,
      rowsSkipped: invalidRowCount.value,
      batchId: csvUpload._id
    });

  } catch (error) {
    cleanup();
    console.error("UPLOAD STUDENTS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPLOAD TEACHERS ================= */
export const uploadTeachers = async (req, res) => {
  const cleanup = () => {
    if (req.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch (_) {}
    }
  };

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    // ✅ Step 1 — Extension guard
    if (!req.file.originalname.toLowerCase().endsWith(".csv")) {
      cleanup();
      return res.status(400).json({
        success: false,
        message: "❌ Invalid file type. Please upload a .csv file only."
      });
    }

    // ✅ Step 2 — Parse
    const fileContent = fs.readFileSync(req.file.path, "utf-8").trim();

    if (!fileContent) {
      cleanup();
      return res.status(400).json({
        success: false,
        message: "❌ Uploaded CSV file is empty. Please upload a valid CSV file."
      });
    }

    const rows = await parseCSV(fileContent);

    // ✅ Step 3 — Column validation
    const validation = validateTeacherCSV(rows);
    if (!validation.valid) {
      cleanup();
      return res.status(400).json({ success: false, message: validation.message });
    }

    const { columnMap } = validation;

    // ✅ Step 4 — Map + row-level filter
    const validTeachers   = [];
    const invalidRowCount = { value: 0 };
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const teacher of rows) {
      const mapped = mapTeacherRow(teacher, columnMap);
      const emailValid = mapped.email && emailRe.test(mapped.email);

      if (mapped.staffId && mapped.name && emailValid && mapped.department) {
        validTeachers.push(mapped);
      } else {
        invalidRowCount.value++;
      }
    }

    if (validTeachers.length === 0) {
      cleanup();
      return res.status(400).json({
        success: false,
        message: `❌ No valid teacher rows found. ${invalidRowCount.value} rows were skipped due to missing or invalid fields.`
      });
    }

    // ✅ Step 5 — Create CSV Upload Record
    const csvUpload = await CSVUpload.create({
      uploadedBy: req.user._id,
      collegeId: req.user.collegeId,
      department: req.user.department,
      type: "teacher",
      fileName: req.file.originalname,
      status: "pending",
      recordsCount: validTeachers.length
    });

    // ✅ Step 6 — Count duplicates
    const incomingIDs    = validTeachers.map(t => t.staffId);
    const existingDocs   = await ApprovedTeacher.find({ staffId: { $in: incomingIDs }, collegeId: req.user.collegeId }).select("staffId");
    const duplicateCount = existingDocs.length;

    // ✅ Step 7 — Upsert
    const operations = validTeachers.map(teacher => ({
      updateOne: {
        filter: { staffId: teacher.staffId, collegeId: req.user.collegeId },
        update: { 
          $set: {
            ...teacher,
            collegeId: req.user.collegeId,
            uploadBatchId: csvUpload._id,
            approved: false // Requires superadmin approval
          }
        },
        upsert: true
      }
    }));

    await ApprovedTeacher.bulkWrite(operations, { ordered: false });

    cleanup();

    res.json({
      success: true,
      message: `✅ CSV uploaded successfully. Pending SuperAdmin approval.`,
      count: validTeachers.length,
      duplicatesSkipped: duplicateCount,
      rowsSkipped: invalidRowCount.value,
      batchId: csvUpload._id
    });

  } catch (error) {
    cleanup();
    console.error("UPLOAD TEACHERS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET ADMIN CSV UPLOADS ================= */
export const getAdminCSVUploads = async (req, res) => {
  try {
    const uploads = await CSVUpload.find({ uploadedBy: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET STATS ================= */
export const getStats = async (req, res) => {
  try {
    const filter = {};
    if (req.user.collegeId) {
      filter.collegeId = req.user.collegeId;
    }
    if (req.user.role === "admin" && req.user.department) {
      filter.department = req.user.department;
    }

    const studentCount = await User.countDocuments({ ...filter, role: "student" });
    const teacherCount = await User.countDocuments({ ...filter, role: "teacher" });
    const adminCount = await User.countDocuments({ ...filter, role: "admin" });
    
    const appointmentCount = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: "pending" });

    res.json({
      students: studentCount,
      teachers: teacherCount,
      admins: adminCount,
      appointments: appointmentCount,
      pendingAppointments
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE USER ================= */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userEmail = user.email;
    const userName = user.name;

    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });

    // ✅ EMAIL ADDED - Account Rejected (Point 9)
    try {
      if (userEmail) {
        sendEmail({
          email: userEmail,
          subject: "MentorHub Account Status Update",
          message: accountRejectedEmail(userName, "Your account has been removed from the MentorHub platform by an institutional administrator.")
        });
      }
    } catch (emailError) {
      console.error("❌ Email error (non-blocking):", emailError.message);
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL USERS ================= */
export const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (req.user.collegeId) query.collegeId = req.user.collegeId;
    
    if (req.user.role === "admin" && req.user.department) {
      query.department = req.user.department;
    }

    const users = await User.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL APPOINTMENTS ================= */
export const getAllAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = status ? { status } : {};

    const appointments = await Appointment.find(query)
      .populate("studentId", "name email")
      .populate("teacherId", "name email")
      .populate("slotId")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Appointment.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET APPROVED STUDENTS ================= */
export const getApprovedStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const query = {};
    if (req.user.collegeId) query.collegeId = req.user.collegeId;
    
    if (req.user.role === "admin" && req.user.department) {
      query.department = req.user.department;
    }

    const students = await ApprovedStudent.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await ApprovedStudent.countDocuments(query);

    res.json({
      students,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET APPROVED TEACHERS ================= */
export const getApprovedTeachers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const query = {};
    if (req.user.collegeId) query.collegeId = req.user.collegeId;

    if (req.user.role === "admin" && req.user.department) {
      query.department = req.user.department;
    }

    const teachers = await ApprovedTeacher.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await ApprovedTeacher.countDocuments(query);

    res.json({
      teachers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE DEPARTMENT STUDENT DATA ================= */
export const deleteStudentData = async (req, res) => {
  try {
    const { collegeId, department } = req.user;

    if (!collegeId || !department) {
      return res.status(400).json({ 
        success: false, 
        message: "Admin college or department information is missing." 
      });
    }

    const result = await ApprovedStudent.deleteMany({
      collegeId,
      department
    });

    res.json({
      success: true,
      message: `Previous department student records (${result.deletedCount}) deleted successfully.`,
    });

  } catch (error) {
    console.error("DELETE STUDENT DATA ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DELETE DEPARTMENT TEACHER DATA ================= */
export const deleteTeacherData = async (req, res) => {
  try {
    const { collegeId, department } = req.user;

    if (!collegeId || !department) {
      return res.status(400).json({ 
        success: false, 
        message: "Admin college or department information is missing." 
      });
    }

    const result = await ApprovedTeacher.deleteMany({
      collegeId,
      department
    });

    res.json({
      success: true,
      message: `Previous department teacher records (${result.deletedCount}) deleted successfully.`,
    });

  } catch (error) {
    console.error("DELETE TEACHER DATA ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

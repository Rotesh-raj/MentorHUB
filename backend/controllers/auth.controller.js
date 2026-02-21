import User from '../models/User.js';
import ApprovedStudent from '../models/ApprovedStudent.js';
import ApprovedTeacher from '../models/ApprovedTeacher.js';
import { generateToken } from '../utils/jwt.js';

/* ================= STUDENT REGISTER ================= */
/* ================= STUDENT REGISTER ================= */
export const studentRegister = async (req, res) => {
  try {
    let { usn, name, email, password } = req.body;

    usn = usn.toUpperCase().trim();
    name = name.trim();
    email = email.toLowerCase().trim();

    const student = await ApprovedStudent.findOne({ usn });

    // ❌ USN NOT FOUND
    if (!student)
      return res.status(400).json({
        message: "❌ Invalid USN number. You are not in college approved list."
      });

    // ❌ ALREADY REGISTERED
    if (student.registered)
      return res.status(400).json({
        message: "⚠ This USN is already registered. Please login instead."
      });

    // ❌ NAME MISMATCH
    if (student.name.toLowerCase() !== name.toLowerCase())
      return res.status(400).json({
        message: "❌ Name does not match college records for this USN."
      });

    // ❌ EMAIL MISMATCH
    if (student.email.toLowerCase() !== email)
      return res.status(400).json({
        message: "❌ Email does not match with this USN."
      });

    // ❌ EMAIL ALREADY USED
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        message: "⚠ Email already registered. Try logging in."
      });

    // ✅ CREATE ACCOUNT
    const user = await User.create({
      name: student.name,
      email,
      password,
      role: "student",
      referenceId: usn,
      department: student.department
    });

    await ApprovedStudent.findByIdAndUpdate(student._id, { registered: true });

    const token = generateToken(user._id, user.role);
    res.status(201).json({
      token,
      user,
      message: "✅ Registration successful. Welcome to Smart Campus!"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= TEACHER REGISTER ================= */
export const teacherRegister = async (req, res) => {
  try {
    let { staffId, name, email, password } = req.body;

    staffId = staffId.toUpperCase().trim();
    email = email.toLowerCase().trim();

    const teacher = await ApprovedTeacher.findOne({ staffId });

    if (!teacher)
      return res.status(400).json({ message: "Staff ID not found in college records" });

    if (teacher.registered)
      return res.status(400).json({ message: "This Staff ID already registered" });

    if (teacher.email.toLowerCase() !== email)
      return res.status(400).json({ message: "Email does not match Staff ID" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({
      name: teacher.name,
      email,
      password,
      role: 'teacher',
      referenceId: staffId,
      department: teacher.department
    });

    await ApprovedTeacher.findByIdAndUpdate(teacher._id, { registered: true });

    const token = generateToken(user._id, user.role);
    res.status(201).json({ token, user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await user.comparePassword(password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.role);
    res.json({ token, user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= GET CURRENT USER ================= */
export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};


/* ================= CHECK STUDENT ================= */
export const checkStudentApproval = async (req, res) => {
  const student = await ApprovedStudent.findOne({ usn: req.params.usn.toUpperCase() });
  if (!student) return res.status(404).json({ approved:false, message:"USN not found" });
  res.json({ approved:true });
};


/* ================= CHECK TEACHER ================= */
export const checkTeacherApproval = async (req, res) => {
  const teacher = await ApprovedTeacher.findOne({ staffId: req.params.staffId.toUpperCase() });
  if (!teacher) return res.status(404).json({ approved:false, message:"Staff ID not found" });
  res.json({ approved:true });
};


/* ================= CREATE ADMIN ================= */
export const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ role: "admin" });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const admin = await User.create({
      name: "Super Admin",
      email,
      password,
      role: "admin",
      referenceId: "ADMIN001"
    });

    res.json({ message: "Admin created", admin });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

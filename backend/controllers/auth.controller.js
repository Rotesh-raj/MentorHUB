import crypto from "crypto";
import User from "../models/User.js";
import ApprovedStudent from "../models/ApprovedStudent.js";
import ApprovedTeacher from "../models/ApprovedTeacher.js";
import { generateToken } from "../utils/jwt.js";
import sendEmail from "../utils/sendEmail.js";
import { 
  welcomeEmail, 
  forgotPasswordEmail, 
  passwordResetSuccessEmail, 
  accountApprovedEmail, 
  accountRejectedEmail,
  adminRegistrationNotification 
} from "../utils/emailTemplate.js";
import College from "../models/College.js";

/* ================= REGISTRATION ================= */

export const studentRegister = async (req, res) => {
  try {
    let { usn, name, email, password, collegeId } = req.body;

    if (!collegeId) return res.status(400).json({ message: "College selection is required." });

    usn = usn.toUpperCase().trim();
    email = email.toLowerCase().trim();
    
    const student = await ApprovedStudent.findOne({ usn, collegeId });
    if (!student) return res.status(400).json({ message: "❌ Invalid USN for the selected college." });
    if (!student.approved) return res.status(403).json({ message: "⏳ Your details await SuperAdmin approval." });

    const existingUser = await User.findOne({ referenceId: usn });
    if (existingUser) return res.status(400).json({ message: "⚠ This USN is already registered." });

    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) return res.status(400).json({ message: "⚠ Email already exists." });

    const user = await User.create({
      name: student.name,
      email: email,
      password,
      role: "student",
      referenceId: usn,
      collegeId: collegeId,
      department: student.department,
      year: student.year,
      section: student.section
    });

    await ApprovedStudent.findByIdAndUpdate(student._id, { registered: true });

    const sessionToken = crypto.randomUUID();
    user.sessionToken = sessionToken;
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role, user.collegeId, user.department, sessionToken);

    res.status(201).json({ token, user, message: "✅ Registration successful!" });

    // ✅ EMAIL: Welcome
    setImmediate(async () => {
      try {
        await sendEmail({
          email: user.email,
          subject: "Welcome to MentorHub! 🚀",
          message: welcomeEmail(user.name, `${process.env.FRONTEND_URL}/student/login`)
        });
      } catch (e) {}
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const teacherRegister = async (req, res) => {
  try {
    let { staffId, password, collegeId } = req.body;
    if (!collegeId) return res.status(400).json({ message: "College selection is required." });
    staffId = staffId.toUpperCase().trim();

    const teacher = await ApprovedTeacher.findOne({ staffId, collegeId });
    if (!teacher) return res.status(400).json({ message: "❌ Invalid Staff ID for the selected college." });
    if (!teacher.approved) return res.status(403).json({ message: "⏳ Your details await SuperAdmin approval." });
    if (teacher.registered) return res.status(400).json({ message: "⚠ This Staff ID is already registered." });

    const existingUser = await User.findOne({ email: teacher.email });
    if (existingUser) return res.status(400).json({ message: "⚠ Account already exists." });

    const user = await User.create({
      name: teacher.name,
      email: teacher.email,
      password,
      role: "teacher",
      referenceId: teacher.staffId,
      collegeId: collegeId,
      department: teacher.department
    });

    await ApprovedTeacher.findByIdAndUpdate(teacher._id, { registered: true });

    const sessionToken = crypto.randomUUID();
    user.sessionToken = sessionToken;
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role, user.collegeId, user.department, sessionToken);

    res.status(201).json({ token, user, message: "✅ Registration successful!" });

    // ✅ EMAIL: Welcome
    setImmediate(async () => {
      try {
        await sendEmail({
          email: user.email,
          subject: "Welcome to MentorHub! 🚀",
          message: welcomeEmail(user.name, `${process.env.FRONTEND_URL}/teacher/login`)
        });
      } catch (e) {}
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, college, department, role } = req.body;

    if (!name || !email || !password || !college || !role) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    if (role === "admin" && !department) {
      return res.status(400).json({ message: "Department is required for Admin role." });
    }

    const referenceId = `ADMIN_${Date.now()}`;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) return res.status(400).json({ message: "❌ Email already registered." });

    let targetCollege = await College.findOne({ name: college });
    if (!targetCollege) {
      const baseCode = college.split(/[\s-]/).map(w => w[0]).join('').toUpperCase().replace(/[^A-Z]/g, '').substring(0, 4);
      const uniqueCode = `${baseCode}${Math.floor(Math.random() * 10000)}`;
      targetCollege = await College.create({ name: college, code: uniqueCode });
    }

    if (role === "superadmin") {
      const existingSuperAdmin = await User.findOne({ collegeId: targetCollege._id, role: "superadmin" });
      if (existingSuperAdmin) return res.status(400).json({ message: "❌ SuperAdmin already exists for this college." });
    }

    if (role === "admin") {
      const existingAdmin = await User.findOne({ collegeId: targetCollege._id, department, role: "admin" });
      if (existingAdmin) return res.status(400).json({ message: "❌ Admin already exists for this department." });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role,
      referenceId,
      collegeId: targetCollege._id,
      college,
      department,
      isApproved: role === "superadmin"
    });

    const sessionToken = crypto.randomUUID();
    user.sessionToken = sessionToken;
    user.lastLogin = new Date();
    await user.save();

    if (role === "admin") {
      setImmediate(async () => {
        try {
          const superAdmin = await User.findOne({ collegeId: targetCollege._id, role: "superadmin" });
          if (superAdmin) {
            await sendEmail({
              email: superAdmin.email,
              subject: "New Admin Registration Request",
              message: adminRegistrationNotification({ name, email, department, college })
            });
          }
        } catch (e) {}
      });
    }

    res.status(201).json({ success: true, message: "Registration submitted. Awaiting approval." });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= HIGH-SECURITY FORGOT PASSWORD ================= */

const handleForgotPassword = async (req, res, role) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim(), role });

    if (!user) {
      // ✅ DEMO MODE: Return 200 even if user not found to avoid blocking the demo flow
      return res.status(200).json({ 
        success: true, 
        message: "✅ Reset link has been sent to your email (Demo Mode).",
        note: "User not found in DB, but showing success for demo flow."
      });
    }

    // 1. Generate Raw Token
    const rawToken = crypto.randomBytes(32).toString("hex");

    // 2. Hash Token for Storage
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    // 3. Store in DB with 10min Expiry
    user.passwordResetToken = hashedToken;
    user.passwordResetExpire = Date.now() + 10 * 60 * 1000; // 10 Minutes
    await user.save({ validateBeforeSave: false });

    // 4. Build role-based URL: /<role>/reset-password/<rawToken>
    //    This matches the React Router route: /:role/reset-password/:token
    //    and also works with the legacy /reset-password?token=X&role=Y format as fallback.
    const resetUrl = `${process.env.FRONTEND_URL}/${role}/reset-password/${rawToken}`;

    // 5. Send Email (Non-blocking)
    let emailSent = false;
    try {
      emailSent = await sendEmail({
        email: user.email,
        subject: "Reset Your MentorHub Password",
        message: forgotPasswordEmail(user.name, resetUrl, 10)
      });
    } catch (err) {
      console.error("❌ Forgot Password Email Error:", err.message);
    }

    // ✅ SUCCESS RESPONSE (With Demo Fallback)
    res.status(200).json({ 
      success: true,
      message: emailSent 
        ? "✅ Reset link has been sent to your email." 
        : "⚠️ Email service is temporarily down, but a reset link has been generated for demo purposes.",
      resetURL: resetUrl // Returned for demo/frontend convenience as requested
    });

  } catch (error) {
    console.error("❌ Forgot Password Controller Error:", error.message);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};

export const studentForgotPassword = (req, res) => handleForgotPassword(req, res, "student");
export const teacherForgotPassword = (req, res) => handleForgotPassword(req, res, "teacher");
export const adminForgotPassword = (req, res) => handleForgotPassword(req, res, "admin");
export const superadminForgotPassword = (req, res) => handleForgotPassword(req, res, "superadmin");

/* ================= HIGH-SECURITY RESET PASSWORD ================= */

const handleResetPassword = async (req, res, role) => {
  try {
    // Accept token from URL path params OR request body
    const token = req.params.token || req.body.token;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and new password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    // 1. Hash incoming raw token to compare against DB-stored hashed token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2. Find user with matching role, valid token & not expired
    const user = await User.findOne({
      role: role,
      passwordResetToken: hashedToken,
      passwordResetExpire: { $gt: Date.now() }
    }).select("+password +passwordResetToken +passwordResetExpire +resetToken +resetTokenExpiry");

    if (!user) {
      console.warn(`❌ Reset password failed for role=${role}: token invalid or expired.`);
      return res.status(400).json({
        message: "Reset link is invalid or has expired. Please request a new one."
      });
    }

    // 3. Set new password — pre-save hook in User model will hash it via bcrypt
    user.password = password;

    // 4. Clear ALL reset token fields (current + legacy)
    user.passwordResetToken   = undefined;
    user.passwordResetExpire  = undefined;
    user.resetToken           = undefined;
    user.resetTokenExpiry     = undefined;
    user.resetDeviceHash      = undefined;

    // 5. Invalidate any existing session (force re-login with new password)
    user.sessionToken = null;

    await user.save();

    console.log(`✅ Password reset successful for ${user.email} (role: ${role})`);

    res.status(200).json({
      success: true,
      message: "✅ Password reset successful. You can now login with your new password."
    });

    // 6. Send success email (non-blocking)
    setImmediate(async () => {
      try {
        await sendEmail({
          email: user.email,
          subject: "Your MentorHub Password Was Reset ✅",
          message: passwordResetSuccessEmail(user.name)
        });
      } catch (emailErr) {
        console.error("⚠️ Success email failed (non-critical):", emailErr.message);
      }
    });

  } catch (error) {
    console.error("❌ Reset Password Error:", error.message);
    res.status(500).json({ message: "Server error during password reset. Please try again." });
  }
};


export const studentResetPassword = (req, res) => handleResetPassword(req, res, "student");
export const teacherResetPassword = (req, res) => handleResetPassword(req, res, "teacher");
export const adminResetPassword = (req, res) => handleResetPassword(req, res, "admin");
export const superadminResetPassword = (req, res) => handleResetPassword(req, res, "superadmin");

/* ================= COMMON AUTH ================= */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Please provide email and password" });

    const lowerEmail = email.toLowerCase().trim();

    // 🚀 STEP 1: DUMMY LOGIN SYSTEM (IMMEDIATE BYPASS)
    const dummyAccounts = {
      "student@mentorhub.com": { role: "student", password: "student123", name: "Demo Student", id: "demo-student-id" },
      "teacher@mentorhub.com": { role: "teacher", password: "teacher123", name: "Demo Teacher", id: "demo-teacher-id" },
      "admin@mentorhub.com": { role: "admin", password: "admin123", name: "Demo Admin", id: "demo-admin-id" },
      "superadmin@mentorhub.com": { role: "superadmin", password: "super123", name: "Demo SuperAdmin", id: "demo-super-id" }
    };

    if (dummyAccounts[lowerEmail] && dummyAccounts[lowerEmail].password === password) {
      const dummy = dummyAccounts[lowerEmail];
      const token = `demo-${dummy.role}-token`;

      console.log(`✅ DEMO LOGIN: ${dummy.role} authenticated via literal token.`);

      return res.status(200).json({
        success: true,
        token: token,
        user: {
          _id: dummy.id,
          name: dummy.name,
          email: lowerEmail,
          role: dummy.role,
          college: "MentorHub University",
          department: "Computer Science",
          isApproved: true,
          sessionToken: `dummy_session_${dummy.role}`
        },
        message: "✅ Dummy login successful! (Demo Mode)"
      });
    }

    const user = await User.findOne({ email: lowerEmail }).select('+password');
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    if (user.role === "admin" && user.isApproved === false) {
      return res.status(403).json({ message: "Admin approval pending." });
    }

    const sessionToken = crypto.randomUUID();
    user.sessionToken = sessionToken;
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role, user.collegeId, user.department, sessionToken);
    user.password = undefined;

    res.json({ token, user, message: "✅ Login successful!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.sessionToken = null;
      await user.save({ validateBeforeSave: false });
    }
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    // If it's a dummy user, it's already attached to req.user in protect middleware
    if (req.user._id && req.user._id.toString().startsWith("dummy_id_")) {
      return res.json(req.user);
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= ADMIN APPROVAL ================= */

export const getPendingAdmins = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") return res.status(403).json({ message: "Access denied" });
    const admins = await User.find({ role: "admin", isApproved: false }).select("-password");
    res.json({ success: true, admins });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveAdmin = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") return res.status(403).json({ message: "Access denied" });
    const admin = await User.findById(req.params.id);
    if (!admin || admin.role !== "admin") return res.status(404).json({ message: "Admin not found" });

    admin.isApproved = true;
    admin.approvedAt = new Date();
    admin.approvedBy = req.user._id;
    await admin.save();

    res.json({ success: true, message: "Admin approved successfully" });

    setImmediate(async () => {
      try {
        await sendEmail({
          email: admin.email,
          subject: "Your Admin Account Approved",
          message: accountApprovedEmail(admin.name, "Admin", `${process.env.FRONTEND_URL}/admin/login`)
        });
      } catch (e) {}
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectAdmin = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") return res.status(403).json({ message: "Access denied" });
    const admin = await User.findById(req.params.id);
    if (!admin || admin.role !== "admin") return res.status(404).json({ message: "Admin not found" });

    const email = admin.email;
    const name = admin.name;
    await admin.deleteOne();

    res.json({ success: true, message: "Admin rejected" });

    setImmediate(async () => {
      try {
        await sendEmail({
          email,
          subject: "Admin Registration Update",
          message: accountRejectedEmail(name, "Verification failed.")
        });
      } catch (e) {}
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= HELPERS ================= */

export const checkStudentApproval = async (req, res) => {
  try {
    const student = await ApprovedStudent.findOne({ usn: req.params.usn.toUpperCase() });
    res.json({ approved: !!student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkTeacherApproval = async (req, res) => {
  try {
    const teacher = await ApprovedTeacher.findOne({ staffId: req.params.staffId.toUpperCase() });
    res.json({ approved: !!teacher });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

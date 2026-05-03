import crypto from "crypto";
import User from "../models/User.js";
import ApprovedStudent from "../models/ApprovedStudent.js";
import ApprovedTeacher from "../models/ApprovedTeacher.js";
import { generateToken } from "../utils/jwt.js";
import sendEmail from "../utils/sendEmail.js";
import { adminRegistrationNotification, forgotPasswordEmail, adminApprovalEmail, adminRejectionEmail } from "../utils/emailTemplate.js";
import College from "../models/College.js";

export const studentRegister = async (req, res) => {
  try {
    let { usn, name, email, password, collegeId } = req.body;

    if (!collegeId) {
      return res.status(400).json({ message: "College selection is required." });
    }

    usn = usn.toUpperCase().trim();
    email = email.toLowerCase().trim();
    
    // Find matching USN in the selected college
    const student = await ApprovedStudent.findOne({ usn, collegeId });

    // ❌ USN NOT FOUND IN SELECTED COLLEGE
    if (!student)
      return res.status(400).json({
        message: "❌ Invalid USN for the selected college."
      });

    // ❌ CSV UPLOAD NOT APPROVED YET
    if (!student.approved) {
      return res.status(403).json({
        message: "⏳ Your details have been uploaded but are awaiting SuperAdmin approval."
      });
    }


    // 2. Check already registered (using USN)
    const existingUser = await User.findOne({ referenceId: usn });

    if (existingUser) {
      return res.status(400).json({
        message: "⚠ This USN is already registered. Please login."
      });
    }

    // ❌ EMAIL ALREADY USED
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res.status(400).json({
        message: "⚠ Email already exists. Please use a different email."
      });
    }

    // ✅ CREATE ACCOUNT USING APPROVED DATA
    const user = await User.create({
      name: student.name,      // use approved name
      email: email,      // from frontend email
      password,
      role: "student",
      referenceId: usn,
      collegeId: collegeId,
      department: student.department,
      year: student.year,
      section: student.section
    });

    console.log("USER SAVED TO DB:", user._id);




    // Mark as registered
    await ApprovedStudent.findByIdAndUpdate(student._id, { registered: true });

    const sessionToken = crypto.randomUUID();
    user.sessionToken = sessionToken;
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role, user.collegeId, user.department, sessionToken);

    res.status(201).json({
      token,
      user,
      message: "✅ Registration successful. Welcome to Smart Campus!"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= FORGOT PASSWORD (INTERNAL HELPER) ================= */
const handleForgotPassword = async (req, res, role) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide your registered email." });
    }

    // Role-specific lookup
    const user = await User.findOne({ 
      email: email.toLowerCase().trim(),
      role: role 
    });

    if (!user) {
      return res.status(404).json({
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} account not found.`
      });
    }

    // Generate raw token and store hash
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    const htmlMessage = forgotPasswordEmail(resetURL, user.name);

    const emailSent = await sendEmail({
      email: user.email,
      subject: "Reset Your MentorHub Password",
      message: htmlMessage
    });

    if (!emailSent) {
      // Roll back token
      user.resetPasswordToken  = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(503).json({
        success: false,
        message: "Email service unavailable."
      });
    }

    res.json({
      success: true,
      message: "Password reset link sent! Please check your email."
    });

  } catch (error) {
    console.error(`❌ ${role.toUpperCase()} FORGOT PASSWORD ERROR:`, error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error during password recovery." 
    });
  }
};

/* ================= STUDENT FORGOT PASSWORD ================= */
export const studentForgotPassword = async (req, res) => {
  await handleForgotPassword(req, res, "student");
};

/* ================= TEACHER FORGOT PASSWORD ================= */
export const teacherForgotPassword = async (req, res) => {
  await handleForgotPassword(req, res, "teacher");
};

/* ================= ADMIN FORGOT PASSWORD ================= */
export const adminForgotPassword = async (req, res) => {
  await handleForgotPassword(req, res, "admin");
};

/* ================= RESET PASSWORD ================= */
// PUT /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // ✅ Validate inputs
    if (!password) {
      return res.status(400).json({ message: "New password is required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // ✅ Hash the incoming raw token to compare against DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with matching token that has NOT yet expired
    const user = await User
      .findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }  // still valid
      })
      .select("+password +resetPasswordToken +resetPasswordExpire");

    if (!user) {
      return res.status(400).json({
        message: "❌ Reset link is invalid or has expired. Please request a new one."
      });
    }

    // ✅ Update password — pre-save hook hashes it automatically
    user.password = password;
    user.resetPasswordToken = undefined;   // ✅ invalidate token
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      success: true,
      message: "✅ Password reset successful. Please login with your new password."
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};




export const checkStudentApproval = async (req, res) => {
  try {
    const student = await ApprovedStudent.findOne({
      usn: req.params.usn.toUpperCase()
    });

    if (!student) {
      return res.status(404).json({
        approved: false,
        message: "USN not found"
      });
    }

    res.json({ approved: true });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkTeacherApproval = async (req, res) => {
  try {
    const teacher = await ApprovedTeacher.findOne({
      staffId: req.params.staffId.toUpperCase()
    });

    if (!teacher) {
      return res.status(404).json({
        approved: false,
        message: "Staff ID not found"
      });
    }

    res.json({ approved: true });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= ADMIN REGISTER ================= */
export const adminRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, college, department, role } = req.body;

    console.log("REGISTER REQUEST:", req.body);

    // ✅ Validate required fields
    if (!name || !email || !password || !college || !role) {
      return res.status(400).json({
        message: "Please fill all required fields."
      });
    }

    if (role === "admin" && !department) {
      return res.status(400).json({
        message: "Department is required for Admin role."
      });
    }

    // ✅ Validate confirm password if provided
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match"
      });
    }

    // 🔥 AUTO GENERATE referenceId
    const referenceId = `ADMIN_${Date.now()}`;

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        message: "❌ Email already registered."
      });
    }

    // Check if college exists, if not create it
    let targetCollege = await College.findOne({ name: college });
    if (!targetCollege) {
      const baseCode = college.split(/[\s-]/).map(w => w[0]).join('').toUpperCase().replace(/[^A-Z]/g, '').substring(0, 4);
      const uniqueCode = `${baseCode}${Math.floor(Math.random() * 10000)}`;
      targetCollege = await College.create({ name: college, code: uniqueCode });
    }

    // ✅ SUPERADMIN DUPLICATE CHECK
    if (role === "superadmin") {
      const existingSuperAdmin = await User.findOne({ collegeId: targetCollege._id, role: "superadmin" });
      if (existingSuperAdmin) {
        return res.status(400).json({ message: "❌ A SuperAdmin already exists for this college." });
      }
    }

    // ✅ ADMIN DUPLICATE CHECK
    if (role === "admin") {
      const existingAdmin = await User.findOne({ collegeId: targetCollege._id, department, role: "admin" });
      if (existingAdmin) {
        return res.status(400).json({ message: "❌ Admin already exists for this department in this college." });
      }
    }

    // Create user. SuperAdmins are auto-approved, Admins need approval.
    const isApproved = role === "superadmin" ? true : false;

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role,
      referenceId,
      collegeId: targetCollege._id, // ✅ Link admin to college in SaaS architecture
      college, // also store string as requested
      department,
      isApproved
    });

    const sessionToken = crypto.randomUUID();
    user.sessionToken = sessionToken;
    user.lastLogin = new Date();
    await user.save();

    if (user) {
      console.log("✅ USER PERMANENTLY SAVED TO MONGODB:", {
        id: user._id,
        email: user.email,
        role: user.role,
        college: user.college
      });
    }

    // Send email notification for admin registrations only
    if (role === "admin") {
      try {
        const superAdmin = await User.findOne({ collegeId: targetCollege._id, role: "superadmin" });

        if (superAdmin) {
          await sendEmail({
            email: superAdmin.email,
            subject: "New Admin Registration Request - MentorHub",
            message: adminRegistrationNotification({
              name: name,
              email: email,
              department,
              college
            })
          });
        }
      } catch (emailError) {
        // Suppress email errors in production
      }
    }

    res.status(201).json({
      success: true,
      message: "Admin registration submitted. Awaiting approval."
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password"
      });
    }

    // ✅ FIX: Add .select('+password') because password has select: false in User model
    // Without this, user.password will be undefined, causing "Illegal arguments: string, undefined" error
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // ✅ Check if admin is approved
    if (user.role === "admin" && user.isApproved === false) {
      return res.status(403).json({
        message: "Admin approval pending. Please wait for Super Admin approval."
      });
    }

    const sessionToken = crypto.randomUUID();
    user.sessionToken = sessionToken;
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role, user.collegeId, user.department, sessionToken);

    // Remove password from response
    user.password = undefined;

    res.json({
      token,
      user,
      message: "✅ Login successful!"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ================= SUPERADMIN APPROVAL ================= */

export const getPendingAdmins = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const admins = await User.find({
      role: "admin",
      isApproved: false
    }).select("-password");

    res.json({
      success: true,
      admins
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveAdmin = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const admin = await User.findById(req.params.id);

    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.isApproved = true;
    admin.approvedAt = new Date();
    admin.approvedBy = req.user._id;

    await admin.save();

    // ✅ SEND APPROVAL EMAIL
    await sendEmail({
      email: admin.email,
      subject: "Your MentorHub Admin Account Has Been Approved",
      message: adminApprovalEmail(admin.name)
    });

    res.json({
      success: true,
      message: "Admin approved successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectAdmin = async (req, res) => {
  try {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const admin = await User.findById(req.params.id);

    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    const adminEmail = admin.email;
    const adminName = admin.name;

    await admin.deleteOne();

    // ✅ SEND REJECTION EMAIL
    await sendEmail({
      email: adminEmail,
      subject: "MentorHub Admin Registration Update",
      message: adminRejectionEmail(adminName)
    });

    res.json({
      success: true,
      message: "Admin rejected and removed"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* ================= TEACHER REGISTER ================= */
export const teacherRegister = async (req, res) => {
  try {
    let { staffId, password, collegeId } = req.body;

    if (!collegeId) {
      return res.status(400).json({ message: "College selection is required." });
    }

    staffId = staffId.toUpperCase().trim();

    const teacher = await ApprovedTeacher.findOne({ staffId, collegeId });

    // ❌ STAFF ID NOT FOUND
    if (!teacher)
      return res.status(400).json({
        message: "❌ Invalid Staff ID for the selected college."
      });

    // ❌ CSV UPLOAD NOT APPROVED YET
    if (!teacher.approved) {
      return res.status(403).json({
        message: "⏳ Your details have been uploaded but are awaiting SuperAdmin approval."
      });
    }

    // ❌ ALREADY REGISTERED
    if (teacher.registered)
      return res.status(400).json({
        message: "⚠ This Staff ID is already registered. Please login instead."
      });

    // ❌ EMAIL ALREADY USED
    const existingUser = await User.findOne({ email: teacher.email });
    if (existingUser)
      return res.status(400).json({
        message: "⚠ Account already exists. Please login."
      });

    // ✅ CREATE ACCOUNT USING APPROVED DATA
    const user = await User.create({
      name: teacher.name,
      email: teacher.email,
      password,
      role: "teacher",
      referenceId: teacher.staffId,
      collegeId: collegeId,
      department: teacher.department
    });

    console.log("USER SAVED TO DB:", user._id);

    // Mark as registered
    await ApprovedTeacher.findByIdAndUpdate(teacher._id, { registered: true });

    const sessionToken = crypto.randomUUID();
    user.sessionToken = sessionToken;
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role, user.collegeId, user.department, sessionToken);

    res.status(201).json({
      token,
      user,
      message: "✅ Registration successful. Welcome to Smart Campus!"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= GET ME ================= */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= LOGOUT ================= */
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

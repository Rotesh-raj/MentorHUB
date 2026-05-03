import User from "../models/User.js";
import CSVUpload from "../models/CSVUpload.js";
import ApprovedStudent from "../models/ApprovedStudent.js";
import ApprovedTeacher from "../models/ApprovedTeacher.js";
import sendEmail from "../utils/sendEmail.js";
import { adminApprovalConfirmationTemplate } from "../utils/emailTemplate.js";

/* ================= GET ALL ADMINS ================= */
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(admins);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ================= GET PENDING ADMINS ================= */
export const getPendingAdmins = async (req, res) => {
  try {
    const pendingAdmins = await User.find({
      role: "admin",
      isApproved: false
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(pendingAdmins);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ================= GET STATS ================= */
export const getStats = async (req, res) => {
  try {
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalUsers = await User.countDocuments();
    const pendingAdmins = await User.countDocuments({
      role: "admin",
      isApproved: false
    });

    res.json({
      admins: totalAdmins,
      users: totalUsers,
      pendingAdmins
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ================= APPROVE ADMIN ================= */
export const approveAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await User.findById(id);

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    if (admin.role !== "admin") {
      return res.status(400).json({
        message: "Selected user is not an admin"
      });
    }

    if (admin.isApproved) {
      return res.status(400).json({
        message: "Admin is already approved"
      });
    }

    const superAdmin = await User.findById(req.user.id);

    admin.isApproved = true;
    admin.approvedBy = req.user.id;
    admin.approvedAt = new Date();

    await admin.save();

    // Send email
    try {
      await sendEmail({
        email: admin.email,
        subject: "🎉 Your Admin Account Has Been Approved",
        message: adminApprovalConfirmationTemplate({
          name: admin.name
        })
      });
      console.log("✅ Approval email sent");
    } catch (emailError) {
      console.warn("⚠ Email failed:", emailError.message);
    }

    res.json({
      success: true,
      message: "Admin approved successfully",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        isApproved: admin.isApproved,
        approvedAt: admin.approvedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

/* ================= DELETE ADMIN ================= */
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findByIdAndDelete(req.params.id);

    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= CSV APPROVAL SYSTEM ================= */

// GET /api/superadmin/csv/pending
export const getPendingCSVUploads = async (req, res) => {
  try {
    const filter = { status: "pending" };
    // If the superadmin is tied to a college, filter by it
    if (req.user.collegeId) {
      filter.collegeId = req.user.collegeId;
    }

    const pendingUploads = await CSVUpload.find(filter)
      .populate("uploadedBy", "name email department")
      .populate("collegeId", "name code")
      .sort({ createdAt: -1 });

    res.json(pendingUploads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/superadmin/csv/:id/approve
export const approveCSVUpload = async (req, res) => {
  try {
    const upload = await CSVUpload.findById(req.params.id);
    
    if (!upload) {
      return res.status(404).json({ message: "CSV Upload not found" });
    }

    if (upload.status !== "pending") {
      return res.status(400).json({ message: `Upload is already ${upload.status}` });
    }

    // Update upload status
    upload.status = "approved";
    upload.approvedBy = req.user._id;
    upload.approvedAt = new Date();
    await upload.save();

    // Enable all students/teachers in this batch
    if (upload.type === "student") {
      await ApprovedStudent.updateMany(
        { uploadBatchId: upload._id },
        { $set: { approved: true } }
      );
    } else if (upload.type === "teacher") {
      await ApprovedTeacher.updateMany(
        { uploadBatchId: upload._id },
        { $set: { approved: true } }
      );
    }

    res.json({ success: true, message: "CSV Upload approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/superadmin/csv/:id/reject
export const rejectCSVUpload = async (req, res) => {
  try {
    const upload = await CSVUpload.findById(req.params.id);
    
    if (!upload) {
      return res.status(404).json({ message: "CSV Upload not found" });
    }

    if (upload.status !== "pending") {
      return res.status(400).json({ message: `Upload is already ${upload.status}` });
    }

    // Update upload status
    upload.status = "rejected";
    upload.approvedBy = req.user._id;
    upload.approvedAt = new Date();
    await upload.save();

    res.json({ success: true, message: "CSV Upload rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

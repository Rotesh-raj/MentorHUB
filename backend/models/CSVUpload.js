import mongoose from "mongoose";

const csvUploadSchema = new mongoose.Schema({
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
  department: { type: String, required: true },
  type: { type: String, enum: ["student", "teacher"], required: true },
  fileName: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedAt: { type: Date },
  recordsCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("CSVUpload", csvUploadSchema);

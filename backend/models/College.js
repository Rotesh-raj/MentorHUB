import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  domain: { type: String, trim: true },
  superAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["active", "inactive", "pending"], default: "active" },
  subscriptionPlan: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
}, { timestamps: true });

export default mongoose.model("College", collegeSchema);

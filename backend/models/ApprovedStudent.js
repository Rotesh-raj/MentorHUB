import mongoose from "mongoose";

const approvedStudentSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true
    },
    uploadBatchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CSVUpload"
    },
    usn: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      lowercase: true,
      trim: true
    },

    department: {
      type: String,
      required: true,
      trim: true
    },

    year: {
      type: String,   // supports "1st", "2nd", "3rd"
      required: true,
      trim: true
    },

    section: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },

    registered: {
      type: Boolean,
      default: false
    },
    approved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("ApprovedStudent", approvedStudentSchema);

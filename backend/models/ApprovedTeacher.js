import mongoose from 'mongoose';

const approvedTeacherSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true
  },
  uploadBatchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CSVUpload"
  },
  staffId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  registered: {
    type: Boolean,
    default: false
  },
  approved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('ApprovedTeacher', approvedTeacherSchema);

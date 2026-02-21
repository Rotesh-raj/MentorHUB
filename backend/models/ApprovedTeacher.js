import mongoose from 'mongoose';

const approvedTeacherSchema = new mongoose.Schema({
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
  }
}, { timestamps: true });

export default mongoose.model('ApprovedTeacher', approvedTeacherSchema);

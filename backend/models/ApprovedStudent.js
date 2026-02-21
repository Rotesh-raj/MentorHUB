import mongoose from 'mongoose';

const approvedStudentSchema = new mongoose.Schema({
  usn: {
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
  semester: {
    type: Number,
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

export default mongoose.model('ApprovedStudent', approvedStudentSchema);

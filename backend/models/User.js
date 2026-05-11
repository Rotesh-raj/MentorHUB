import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
      
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false // 🔥 Security improvement (hide password by default)
    },


role: {
  type: String,
  enum: ["student", "teacher", "admin", "superadmin"],
  required: true
},

collegeId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "College"
},

college: {
  type: String,
  trim: true,
  required: function () {
    return this.role === "admin" && !this.collegeId;
  }
},

department: {
  type: String,
  trim: true,
  required: function () {
    return (
      this.role === "admin" ||
      this.role === "teacher" ||
      this.role === "student"
    );
  }
},

year: {
  type: String,
  trim: true,
  required: function () {
    return this.role === "student";
  }
},

section: {
  type: String,
  trim: true,
  required: function () {
    return this.role === "student";
  }
},

referenceId: {
  type: String,
  trim: true,
  required: function () {
    return (
      this.role === "student" ||
      this.role === "teacher"
    );
  }
},

isApproved: {
  type: Boolean,
  default: function () {
    return this.role !== "admin";
  }
},

approvedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null
},

approvedAt: {
  type: Date,
  default: null
},

  // ✅ Enterprise-Level Security Fields
  resetToken: { type: String, select: false },
  resetTokenExpiry: { type: Date, select: false },
  resetDeviceHash: { type: String, select: false },
  forgotPasswordAttempts: { type: Number, default: 0 },
  forgotPasswordLastAttempt: { type: Date },

  // 🔥 High Security Password Reset Fields
  passwordResetToken: { type: String, select: false },
  passwordResetExpire: { type: Date, select: false },

  profilePic: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    trim: true,
    default: ""
  },
  specialization: {
    type: String,
    trim: true,
    default: ""
  },
  sessionToken: {
    type: String,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  }
},
{ timestamps: true }
);

/* ================= PASSWORD HASH ================= */

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* ================= PASSWORD COMPARE ================= */

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
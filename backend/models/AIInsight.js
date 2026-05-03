import mongoose from "mongoose";

const aiInsightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    role: {
      type: String,
      enum: ["student", "teacher", "admin", "superadmin"],
      required: true
    },

    type: {
      type: String,
      enum: ["analysis", "suggestion", "alert", "general"],
      required: true
    },

    title: {
      type: String,
      required: true
    },

    content: {
      type: String,
      required: true
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    isRead: {
      type: Boolean,
      default: false
    },

    generatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

/* ================= INDEXES ================= */

aiInsightSchema.index({ userId: 1, type: 1, createdAt: -1 });
aiInsightSchema.index({ userId: 1, isRead: 1 });

export default mongoose.model("AIInsight", aiInsightSchema);


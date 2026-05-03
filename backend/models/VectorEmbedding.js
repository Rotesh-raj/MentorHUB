import mongoose from "mongoose";

const vectorEmbeddingSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      enum: ["appointment", "message", "user", "availability"],
      required: true
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    text: {
      type: String,
      required: true
    },

    embedding: {
      type: [Number],
      required: true
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

/* ================= INDEXES ================= */

vectorEmbeddingSchema.index({ userId: 1, entityType: 1 });
vectorEmbeddingSchema.index({ entityId: 1, entityType: 1 }, { unique: true });

export default mongoose.model("VectorEmbedding", vectorEmbeddingSchema);


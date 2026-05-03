 import mongoose from "mongoose";
import VectorEmbedding from "../models/VectorEmbedding.js";
import { generateEmbedding } from "./ai.service.js";

/* ================= STORE EMBEDDING ================= */

export const storeEmbedding = async (entityType, entityId, userId, text, metadata = {}) => {
  try {
    const embedding = await generateEmbedding(text);

    await VectorEmbedding.findOneAndUpdate(
      { entityId, entityType },
      {
        entityType,
        entityId,
        userId,
        text,
        embedding,
        metadata
      },
      { upsert: true, new: true }
    );

    return { success: true };
  } catch (error) {
    console.error("Store Embedding Error:", error.message);
    return { success: false, error: error.message };
  }
};

/* ================= COSINE SIMILARITY ================= */

const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/* ================= SEMANTIC SEARCH ================= */

export const semanticSearch = async (userId, query, options = {}) => {
  try {
    const { entityType = null, limit = 5 } = options;

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Build filter
    const filter = { userId };
    if (entityType) filter.entityType = entityType;

    // Fetch candidate embeddings from DB
    const candidates = await VectorEmbedding.find(filter).lean();

    // Calculate similarity scores
    const scored = candidates.map(candidate => ({
      ...candidate,
      similarity: cosineSimilarity(queryEmbedding, candidate.embedding)
    }));

    // Sort by similarity (descending) and take top N
    const results = scored
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .filter(r => r.similarity > 0.7); // Only high-confidence matches

    return results.map(r => ({
      entityType: r.entityType,
      entityId: r.entityId,
      text: r.text,
      similarity: Math.round(r.similarity * 100) / 100,
      metadata: r.metadata,
      createdAt: r.createdAt
    }));
  } catch (error) {
    console.error("Semantic Search Error:", error.message);
    return [];
  }
};

/* ================= BATCH STORE APPOINTMENT EMBEDDINGS ================= */

export const storeAppointmentEmbeddings = async (appointments, userId) => {
  const results = [];

  for (const appointment of appointments) {
    const text = `Appointment: ${appointment.topic}. Status: ${appointment.status}. ${appointment.teacherId?.name ? `With teacher ${appointment.teacherId.name}` : ""} ${appointment.studentId?.name ? `Student ${appointment.studentId.name}` : ""}`;

    const result = await storeEmbedding(
      "appointment",
      appointment._id,
      userId,
      text,
      {
        topic: appointment.topic,
        status: appointment.status,
        teacherName: appointment.teacherId?.name,
        studentName: appointment.studentId?.name
      }
    );

    results.push(result);
  }

  return results;
};

/* ================= BATCH STORE MESSAGE EMBEDDINGS ================= */

export const storeMessageEmbeddings = async (messages, userId) => {
  const results = [];

  for (const message of messages) {
    const result = await storeEmbedding(
      "message",
      message._id,
      userId,
      message.message,
      {
        appointmentId: message.appointmentId,
        senderId: message.senderId,
        receiverId: message.receiverId
      }
    );

    results.push(result);
  }

  return results;
};

/* ================= DELETE EMBEDDING ================= */

export const deleteEmbedding = async (entityType, entityId) => {
  await VectorEmbedding.findOneAndDelete({ entityType, entityId });
};

/* ================= GET USER STATS ================= */

export const getUserVectorStats = async (userId) => {
  const counts = await VectorEmbedding.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$entityType", count: { $sum: 1 } } }
  ]);

  return counts.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});
};


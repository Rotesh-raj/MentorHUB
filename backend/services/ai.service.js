import Groq from "groq-sdk";
import OpenAI from "openai";

if (!process.env.GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY in environment variables");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

let openai = null;
const getOpenAI = () => {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY in environment variables");
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

export default groq;

/* ================= OPENAI CHAT COMPLETION ================= */

export const generateChatCompletion = async (messages, model = "llama-3.3-70b-versatile", temperature = 0.7) => {
  try {
    const completion = await groq.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: 1500,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Groq Chat Error:", error.message);
    throw new Error("Failed to generate AI response");
  }
};

/* ================= GENERATE EMBEDDINGS ================= */

export const generateEmbedding = async (text) => {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("OpenAI Embedding Error:", error.message);
    throw new Error("Failed to generate embedding");
  }
};

/* ================= SYSTEM PROMPTS ================= */

export const getCampusSystemPrompt = (role) => {
  const base = `You are the AI assistant for MentorHub, a college appointment management platform. You help users with campus-related queries.`;

  const roleSpecific = {
    student: `You are assisting a student. You can help with:
- Analyzing their appointment patterns and engagement
- Suggesting optimal times to book with teachers
- Alerting about missed opportunities or pending appointments
- Answering questions about the platform`,

    teacher: `You are assisting a teacher. You can help with:
- Analyzing their appointment load and availability utilization
- Suggesting better time slot management
- Alerting about pending appointment requests
- Providing insights on student engagement`,

    admin: `You are assisting an admin. You can help with:
- Analyzing platform-wide statistics and trends
- Identifying bottlenecks in approval workflows
- Suggesting improvements for campus engagement
- Monitoring pending appointments and user registrations`,

    superadmin: `You are assisting a super admin. You can help with:
- High-level platform analytics
- Admin approval workflows
- Campus-wide trend analysis
- Strategic insights for platform growth`
  };

  return `${base}\n\n${roleSpecific[role] || roleSpecific.student}\n\nBe concise, professional, and data-driven in your responses.`;
};

/* ================= STREAM CHAT (for future use) ================= */

export const streamChatCompletion = async (messages, onChunk, model = "llama-3.3-70b-versatile") => {
  try {
    const stream = await groq.chat.completions.create({
      model,
      messages,
      stream: true,
      max_tokens: 1500,
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullResponse += content;
      onChunk(content);
    }

    return fullResponse;
  } catch (error) {
    console.error("OpenAI Stream Error:", error.message);
    throw new Error("Failed to stream AI response");
  }
};


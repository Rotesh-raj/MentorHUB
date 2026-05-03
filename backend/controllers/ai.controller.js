import { generateChatCompletion, getCampusSystemPrompt } from "../services/ai.service.js";
import { getUserContext } from "../services/rag.service.js";
import { runMultiAgent, runAnalysisAgent, runSuggestionAgent, runAlertAgent, getStoredInsights, markInsightsAsRead } from "../services/agent.service.js";
import { semanticSearch, storeAppointmentEmbeddings, storeMessageEmbeddings } from "../services/vector.service.js";
import Appointment from "../models/Appointment.js";
import Message from "../models/Message.js";
import AIInsight from "../models/AIInsight.js";

/* ================= PUBLIC AI CHAT (existing - keeps backward compatibility) ================= */

export const publicAIChat = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await generateChatCompletion([
      {
        role: "system",
        content: `You are the official AI assistant of MentorHub platform.
Help users understand:
- How to register
- How to book appointments
- How to reset password
- How the system works
Keep answers professional and short.`
      },
      { role: "user", content: message }
    ]);

    res.json({ reply: response });
  } catch (error) {
    console.error("Public AI Chat Error:", error.message);
    res.status(500).json({ reply: "AI service unavailable." });
  }
};

/* ================= AUTHENTICATED AI CHAT WITH RAG MEMORY ================= */

export const chat = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    const { _id: userId, role, name } = req.user;

    // Fetch real database context for RAG
    const context = await getUserContext(userId, role);

    // Build system message with RAG context
    const systemMessage = {
      role: "system",
      content: `${getCampusSystemPrompt(role)}

CURRENT USER: ${name} (Role: ${role})

REAL DATABASE CONTEXT (for accurate responses):
${JSON.stringify(context, null, 2)}

Use this context to provide personalized, data-driven responses. Reference specific numbers when relevant. If asked about personal data, use the context above.`
    };

    // Build messages array
    const messages = [
      systemMessage,
      ...conversationHistory.slice(-6), // Keep last 6 messages for context window
      { role: "user", content: message }
    ];

    const response = await generateChatCompletion(messages);

    res.json({
      reply: response,
      context: {
        role,
        hasData: Object.keys(context).length > 0
      }
    });
  } catch (error) {
    console.error("AI Chat Error:", error.message);
    res.status(500).json({ reply: "AI service is currently unavailable. Please try again later." });
  }
};

/* ================= AI ANALYSIS WITH RAG ================= */

export const analyze = async (req, res) => {
  try {
    const { _id: userId, role } = req.user;

    const context = await getUserContext(userId, role);

    const prompt = `Analyze the following campus data for a ${role} and provide 3 key insights.

DATA:
${JSON.stringify(context, null, 2)}

Provide insights in this JSON format:
[
  {
    "title": "Insight title",
    "content": "Detailed insight with numbers",
    "severity": "info" | "warning" | "success"
  }
]`;

    const response = await generateChatCompletion([
      { role: "system", content: "You are a campus data analysis AI." },
      { role: "user", content: prompt }
    ]);

    // Parse response
    let insights = [];
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      insights = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      insights = [{ title: "Analysis Complete", content: response.slice(0, 200), severity: "info" }];
    }

    res.json({
      insights,
      context,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("AI Analyze Error:", error.message);
    res.status(500).json({ message: "Failed to generate analysis" });
  }
};

/* ================= MULTI-AGENT ENDPOINT ================= */

export const multiAgent = async (req, res) => {
  try {
    const { _id: userId, role } = req.user;

    const result = await runMultiAgent(userId, role);

    res.json(result);
  } catch (error) {
    console.error("Multi-Agent Error:", error.message);
    res.status(500).json({
      analysis: [],
      suggestions: [],
      alerts: [],
      error: "Failed to run AI agents"
    });
  }
};

/* ================= SEMANTIC SEARCH ================= */

export const searchSemantic = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { query, entityType, limit = 5 } = req.body;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ message: "Query must be at least 2 characters" });
    }

    // Auto-populate embeddings if none exist
    const userAppointments = await Appointment.find({
      $or: [{ studentId: userId }, { teacherId: userId }]
    }).lean();

    if (userAppointments.length > 0) {
      await storeAppointmentEmbeddings(userAppointments, userId);
    }

    const userMessages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).lean();

    if (userMessages.length > 0) {
      await storeMessageEmbeddings(userMessages, userId);
    }

    // Run semantic search
    const results = await semanticSearch(userId, query, { entityType, limit });

    res.json({
      query,
      results,
      count: results.length
    });
  } catch (error) {
    console.error("Semantic Search Error:", error.message);
    res.status(500).json({ message: "Semantic search failed" });
  }
};

/* ================= GET STORED INSIGHTS ================= */

export const getInsights = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { type, limit = 10 } = req.query;

    const insights = await getStoredInsights(userId, type, parseInt(limit));

    res.json({ insights, count: insights.length });
  } catch (error) {
    console.error("Get Insights Error:", error.message);
    res.status(500).json({ message: "Failed to fetch insights" });
  }
};

/* ================= MARK INSIGHTS READ ================= */

export const markInsightsRead = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    await markInsightsAsRead(userId);
    res.json({ message: "Insights marked as read" });
  } catch (error) {
    console.error("Mark Insights Read Error:", error.message);
    res.status(500).json({ message: "Failed to mark insights as read" });
  }
};

/* ================= INDIVIDUAL AGENT ENDPOINTS ================= */

export const runAgent = async (req, res) => {
  try {
    const { _id: userId, role } = req.user;
    const { agentType } = req.params;

    let result;
    switch (agentType) {
      case "analysis":
        result = await runAnalysisAgent(userId, role);
        break;
      case "suggestion":
        result = await runSuggestionAgent(userId, role);
        break;
      case "alert":
        result = await runAlertAgent(userId, role);
        break;
      default:
        return res.status(400).json({ message: "Invalid agent type. Use: analysis, suggestion, alert" });
    }

    res.json({ agent: agentType, result });
  } catch (error) {
    console.error("Run Agent Error:", error.message);
    res.status(500).json({ message: "Agent execution failed" });
  }
};

/* ================= GET UNREAD INSIGHT COUNT ================= */

export const getUnreadCount = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const count = await AIInsight.countDocuments({ userId, isRead: false });
    res.json({ count });
  } catch (error) {
    console.error("Unread Count Error:", error.message);
    res.status(500).json({ message: "Failed to get unread count" });
  }
};


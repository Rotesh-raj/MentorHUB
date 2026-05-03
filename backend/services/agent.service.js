import { generateChatCompletion } from "./ai.service.js";
import { getUserContext, formatContextForPrompt } from "./rag.service.js";
import AIInsight from "../models/AIInsight.js";

/* ================= AGENT PROMPTS ================= */

const ANALYSIS_PROMPT = (context) => `
You are the Analysis Agent for Smart Campus Connect. Analyze the user's campus activity data and provide key insights.

USER CONTEXT:
${formatContextForPrompt(context)}

Generate 2-3 concise, data-driven insights about the user's patterns. Each insight should:
- Be 1-2 sentences
- Include specific numbers/percentages from the data
- Highlight trends or patterns
- Be written in a friendly, professional tone

Respond ONLY with a JSON array of insights in this exact format:
[
  {
    "title": "Brief insight title",
    "content": "Detailed insight with specific numbers",
    "severity": "info" | "warning" | "success"
  }
]
`;

const SUGGESTION_PROMPT = (context) => `
You are the Suggestion Agent for Smart Campus Connect. Based on the user's data, provide actionable recommendations.

USER CONTEXT:
${formatContextForPrompt(context)}

Generate 2-3 specific, actionable suggestions. Each suggestion should:
- Be practical and immediately applicable
- Reference specific data points
- Help improve their campus experience
- Be encouraging, not critical

Respond ONLY with a JSON array of suggestions in this exact format:
[
  {
    "title": "Brief suggestion title",
    "content": "Detailed suggestion with reasoning",
    "impact": "high" | "medium" | "low"
  }
]
`;

const ALERT_PROMPT = (context) => `
You are the Alert Agent for Smart Campus Connect. Detect potential issues or concerns from the user's data.

USER CONTEXT:
${formatContextForPrompt(context)}

Generate 0-2 alerts if there are genuine concerns. If everything looks good, return an empty array [].
Each alert should:
- Highlight a real issue (not fabricated)
- Include specific numbers
- Suggest an immediate action
- Use severity: "warning" for concerns, "critical" for urgent issues

Respond ONLY with a JSON array of alerts in this exact format:
[
  {
    "title": "Brief alert title",
    "content": "Detailed alert with specific concern and recommended action",
    "severity": "warning" | "critical"
  }
]
`;

/* ================= PARSE AI RESPONSE ================= */

const parseAIResponse = (text) => {
  try {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonString = jsonMatch ? jsonMatch[1].trim() : text.trim();
    return JSON.parse(jsonString);
  } catch {
    // Fallback: try to find array in text
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        return JSON.parse(arrayMatch[0]);
      } catch {
        return [];
      }
    }
    return [];
  }
};

/* ================= ANALYSIS AGENT ================= */

export const runAnalysisAgent = async (userId, role) => {
  try {
    const context = await getUserContext(userId, role);
    const response = await generateChatCompletion([
      { role: "system", content: "You are a data analysis AI." },
      { role: "user", content: ANALYSIS_PROMPT(context) }
    ]);

    const insights = parseAIResponse(response);

    // Persist insights
    for (const insight of insights) {
      await AIInsight.create({
        userId,
        role,
        type: "analysis",
        title: insight.title,
        content: insight.content,
        metadata: { severity: insight.severity }
      });
    }

    return insights.map(i => ({
      ...i,
      icon: i.severity === "success" ? "✅" : i.severity === "warning" ? "⚠️" : "📊"
    }));
  } catch (error) {
    console.error("Analysis Agent Error:", error.message);
    return [{
      title: "Analysis Unavailable",
      content: "Unable to analyze your data at the moment. Please try again later.",
      severity: "info",
      icon: "📊"
    }];
  }
};

/* ================= SUGGESTION AGENT ================= */

export const runSuggestionAgent = async (userId, role) => {
  try {
    const context = await getUserContext(userId, role);
    const response = await generateChatCompletion([
      { role: "system", content: "You are a helpful suggestion AI." },
      { role: "user", content: SUGGESTION_PROMPT(context) }
    ]);

    const suggestions = parseAIResponse(response);

    // Persist suggestions
    for (const suggestion of suggestions) {
      await AIInsight.create({
        userId,
        role,
        type: "suggestion",
        title: suggestion.title,
        content: suggestion.content,
        metadata: { impact: suggestion.impact }
      });
    }

    return suggestions.map(s => ({
      ...s,
      icon: s.impact === "high" ? "💡" : s.impact === "medium" ? "✨" : "📝"
    }));
  } catch (error) {
    console.error("Suggestion Agent Error:", error.message);
    return [{
      title: "Suggestions Unavailable",
      content: "Unable to generate suggestions at the moment. Please try again later.",
      impact: "low",
      icon: "💡"
    }];
  }
};

/* ================= ALERT AGENT ================= */

export const runAlertAgent = async (userId, role) => {
  try {
    const context = await getUserContext(userId, role);
    const response = await generateChatCompletion([
      { role: "system", content: "You are an alert detection AI." },
      { role: "user", content: ALERT_PROMPT(context) }
    ]);

    const alerts = parseAIResponse(response);

    // Persist alerts
    for (const alert of alerts) {
      await AIInsight.create({
        userId,
        role,
        type: "alert",
        title: alert.title,
        content: alert.content,
        metadata: { severity: alert.severity }
      });
    }

    return alerts.map(a => ({
      ...a,
      icon: a.severity === "critical" ? "🔴" : "🟡"
    }));
  } catch (error) {
    console.error("Alert Agent Error:", error.message);
    return [];
  }
};

/* ================= MULTI-AGENT ORCHESTRATOR ================= */

export const runMultiAgent = async (userId, role) => {
  const [analysis, suggestions, alerts] = await Promise.all([
    runAnalysisAgent(userId, role),
    runSuggestionAgent(userId, role),
    runAlertAgent(userId, role)
  ]);

  return {
    analysis,
    suggestions,
    alerts,
    generatedAt: new Date().toISOString()
  };
};

/* ================= GET STORED INSIGHTS ================= */

export const getStoredInsights = async (userId, type = null, limit = 10) => {
  const query = { userId };
  if (type) query.type = type;

  return AIInsight.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

/* ================= MARK INSIGHTS AS READ ================= */

export const markInsightsAsRead = async (userId) => {
  await AIInsight.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );
};


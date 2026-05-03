import api from "./axios";

/* ================= CHAT ================= */

export const sendChatMessage = (message, conversationHistory = []) => {
  return api.post("/ai/chat", { message, conversationHistory });
};

export const sendPublicChatMessage = (message) => {
  return api.post("/ai/public-chat", { message });
};

/* ================= ANALYSIS & AGENTS ================= */

export const getAIAnalysis = () => {
  return api.get("/ai/analyze");
};

export const getMultiAgentInsights = () => {
  return api.get("/ai/multi-agent");
};

export const runAgent = (agentType) => {
  return api.get(`/ai/agent/${agentType}`);
};

/* ================= INSIGHTS ================= */

export const getInsights = (type = null, limit = 10) => {
  const params = new URLSearchParams();
  if (type) params.append("type", type);
  params.append("limit", limit);
  return api.get(`/ai/insights?${params.toString()}`);
};

export const markInsightsAsRead = () => {
  return api.patch("/ai/insights/read");
};

export const getUnreadInsightCount = () => {
  return api.get("/ai/insights/unread");
};

/* ================= SEMANTIC SEARCH ================= */

export const semanticSearch = (query, entityType = null, limit = 5) => {
  return api.post("/ai/semantic-search", { query, entityType, limit });
};


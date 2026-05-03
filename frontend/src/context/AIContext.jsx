import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { getMultiAgentInsights, getUnreadInsightCount, markInsightsAsRead } from "../api/ai";

const AIContext = createContext(null);

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};

export const AIProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [insights, setInsights] = useState({
    analysis: [],
    suggestions: [],
    alerts: [],
    generatedAt: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);

  /* ================= FETCH MULTI-AGENT INSIGHTS ================= */

  const fetchInsights = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getMultiAgentInsights();
      setInsights(response.data);

      // Also fetch unread count
      const unreadRes = await getUnreadInsightCount();
      setUnreadCount(unreadRes.data.count);
    } catch (err) {
      console.error("AI Insights Error:", err);
      setError("Failed to load AI insights");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  /* ================= AUTO-FETCH ON LOGIN ================= */

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchInsights();
    } else {
      setInsights({ analysis: [], suggestions: [], alerts: [], generatedAt: null });
      setUnreadCount(0);
    }
  }, [isAuthenticated, user, fetchInsights]);

  /* ================= MARK AS READ ================= */

  const clearUnread = useCallback(async () => {
    try {
      await markInsightsAsRead();
      setUnreadCount(0);
    } catch (err) {
      console.error("Mark Read Error:", err);
    }
  }, []);

  /* ================= REFRESH ================= */

  const refreshInsights = useCallback(async () => {
    await fetchInsights();
  }, [fetchInsights]);

  /* ================= TOGGLE CHAT ================= */

  const toggleChat = useCallback(() => {
    setChatOpen(prev => !prev);
  }, []);

  const openChat = useCallback(() => {
    setChatOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setChatOpen(false);
  }, []);

  /* ================= CONTEXT VALUE ================= */

  const value = {
    insights,
    loading,
    error,
    unreadCount,
    chatOpen,
    toggleChat,
    openChat,
    closeChat,
    refreshInsights,
    clearUnread,
    hasInsights: insights.analysis.length > 0 || insights.suggestions.length > 0 || insights.alerts.length > 0,
    hasAlerts: insights.alerts.length > 0
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};


import { useState, useEffect, useRef } from "react";
import { useAI } from "../../context/AIContext";
import { useAuth } from "../../context/AuthContext";
import { sendChatMessage, sendPublicChatMessage, getMultiAgentInsights } from "../../api/ai";
import {
  X,
  Send,
  Loader2,
  MessageSquare,
  Sparkles,
  Brain,
  Lightbulb,
  AlertTriangle,
  RefreshCw,
  User,
  Bot
} from "lucide-react";

/* ================= TAB COMPONENT ================= */

const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition ${
      active
        ? "bg-white text-indigo-600 shadow-sm"
        : "text-indigo-100 hover:bg-indigo-500/50"
    }`}
  >
    <Icon size={14} />
    {label}
  </button>
);

/* ================= MESSAGE BUBBLE ================= */

const MessageBubble = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
        isUser ? "bg-gray-200" : "bg-indigo-100"
      }`}>
        {isUser ? <User size={14} className="text-gray-600" /> : <Bot size={14} className="text-indigo-600" />}
      </div>
      <div
        className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
          isUser
            ? "bg-indigo-600 text-white rounded-br-md"
            : "bg-gray-100 text-gray-800 rounded-bl-md"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

/* ================= INSIGHT TAB CONTENT ================= */

const InsightsTab = ({ insights, loading, error, onRefresh }) => (
  <div className="p-4 space-y-3 overflow-y-auto h-full">
    {error && (
      <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
        {error}
      </div>
    )}

    {loading && (
      <div className="flex items-center justify-center py-8">
        <Loader2 size={20} className="animate-spin text-indigo-500" />
        <span className="ml-2 text-sm text-gray-500">Analyzing...</span>
      </div>
    )}

    {!loading && insights.analysis.length === 0 && insights.suggestions.length === 0 && insights.alerts.length === 0 && (
      <div className="text-center py-8">
        <Sparkles size={32} className="mx-auto text-gray-300 mb-2" />
        <p className="text-sm text-gray-400">No insights yet. Click refresh to generate.</p>
        <button
          onClick={onRefresh}
          className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mx-auto"
        >
          <RefreshCw size={14} />
          Generate Insights
        </button>
      </div>
    )}

    {/* Analysis */}
    {insights.analysis.length > 0 && (
      <div className="bg-blue-50 rounded-lg p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Brain size={14} className="text-blue-600" />
          <h4 className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Analysis</h4>
        </div>
        {insights.analysis.map((item, i) => (
          <div key={i} className="text-sm text-blue-900 mb-1.5 last:mb-0 flex items-start gap-1.5">
            <span>{item.icon}</span>
            <span>{item.content}</span>
          </div>
        ))}
      </div>
    )}

    {/* Suggestions */}
    {insights.suggestions.length > 0 && (
      <div className="bg-amber-50 rounded-lg p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Lightbulb size={14} className="text-amber-600" />
          <h4 className="text-xs font-semibold text-amber-800 uppercase tracking-wide">Suggestions</h4>
        </div>
        {insights.suggestions.map((item, i) => (
          <div key={i} className="text-sm text-amber-900 mb-1.5 last:mb-0 flex items-start gap-1.5">
            <span>{item.icon}</span>
            <span>{item.content}</span>
          </div>
        ))}
      </div>
    )}

    {/* Alerts */}
    {insights.alerts.length > 0 && (
      <div className="bg-red-50 rounded-lg p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <AlertTriangle size={14} className="text-red-600" />
          <h4 className="text-xs font-semibold text-red-800 uppercase tracking-wide">Alerts</h4>
        </div>
        {insights.alerts.map((item, i) => (
          <div key={i} className="text-sm text-red-900 mb-1.5 last:mb-0 flex items-start gap-1.5">
            <span>{item.icon}</span>
            <span>{item.content}</span>
          </div>
        ))}
      </div>
    )}

    {insights.generatedAt && (
      <p className="text-xs text-gray-400 text-center">
        Generated at {new Date(insights.generatedAt).toLocaleTimeString()}
      </p>
    )}
  </div>
);

/* ================= MAIN COMPONENT ================= */

export default function AIAssistant() {
  const { chatOpen, closeChat, insights: globalInsights, refreshInsights: globalRefresh } = useAI();
  const { isAuthenticated, user } = useAuth();

  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [localInsights, setLocalInsights] = useState({ analysis: [], suggestions: [], alerts: [], generatedAt: null });
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* ================= WELCOME MESSAGE ================= */

  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      const welcomeText = isAuthenticated
        ? `👋 Hi ${user?.name?.split(" ")[0] || "there"}!\n\nI'm your AI assistant. I can help you with:\n• Campus analytics & insights\n• Appointment suggestions\n• Answering platform questions\n• Finding patterns in your data`
        : `👋 Welcome to MentorHub!\n\nI can help you with:\n• How to register\n• How to book appointments\n• Password reset\n• Platform navigation`;

      setMessages([{ sender: "ai", text: welcomeText }]);
    }
  }, [chatOpen, messages.length, isAuthenticated, user]);

  /* ================= FOCUS INPUT ================= */

  useEffect(() => {
    if (chatOpen && activeTab === "chat") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [chatOpen, activeTab]);

  /* ================= SEND MESSAGE ================= */

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setTyping(true);

    try {
      const conversationHistory = messages.slice(-6).map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text
      }));

      let res;
      if (isAuthenticated) {
        res = await sendChatMessage(currentInput, conversationHistory);
      } else {
        res = await sendPublicChatMessage(currentInput);
      }

      setTyping(false);

      const aiMessage = {
        sender: "ai",
        text: res.data.reply
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setTyping(false);
      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: "⚠️ AI service is currently unavailable. Please try again later."
        }
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ================= LOAD INSIGHTS ================= */

  const loadInsights = async () => {
    if (!isAuthenticated) {
      setLocalError("Please log in to see AI insights.");
      return;
    }

    try {
      setLocalLoading(true);
      setLocalError(null);

      const res = await getMultiAgentInsights();
      setLocalInsights(res.data);
    } catch (err) {
      console.error("Load Insights Error:", err);
      setLocalError("Failed to load insights.");
    } finally {
      setLocalLoading(false);
    }
  };

  /* ================= TAB SWITCH ================= */

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "insights" && localInsights.analysis.length === 0 && !localLoading) {
      // Use global insights if available, otherwise fetch
      if (globalInsights.analysis.length > 0) {
        setLocalInsights(globalInsights);
      } else {
        loadInsights();
      }
    }
  };

  if (!chatOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white shadow-2xl rounded-2xl flex flex-col z-50 overflow-hidden border border-gray-200"
      style={{ height: "550px", maxHeight: "calc(100vh - 8rem)" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="font-semibold text-sm">MentorHub AI Assistant</h2>
              <p className="text-xs text-indigo-100 opacity-80">
                {isAuthenticated ? "Personalized with your data" : "General help"}
              </p>
            </div>
          </div>
          <button onClick={closeChat} className="hover:bg-white/20 p-1 rounded transition">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-indigo-500/30 p-1 rounded-lg">
          <TabButton
            active={activeTab === "chat"}
            onClick={() => handleTabChange("chat")}
            icon={MessageSquare}
            label="Chat"
          />
          {isAuthenticated && (
            <TabButton
              active={activeTab === "insights"}
              onClick={() => handleTabChange("insights")}
              icon={Brain}
              label="Insights"
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "chat" ? (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 h-[calc(100%-64px)]">
              {messages.map((msg, index) => (
                <MessageBubble key={index} message={msg} />
              ))}

              {typing && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-indigo-600" />
                  </div>
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1 w-fit">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-3 flex gap-2">
              <input
                ref={inputRef}
                className="flex-1 px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your campus data..."
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || typing}
                className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        ) : (
          <InsightsTab
            insights={localInsights.analysis.length > 0 ? localInsights : globalInsights}
            loading={localLoading || (!localInsights.analysis.length && !globalInsights.analysis.length)}
            error={localError}
            onRefresh={loadInsights}
          />
        )}
      </div>
    </div>
  );
}


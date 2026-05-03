import { useAI } from "../../context/AIContext";
import { Sparkles, MessageCircle } from "lucide-react";

export default function AIFloatingButton() {
  const { toggleChat, unreadCount } = useAI();

  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Open AI Assistant"
    >
      <div className="relative">
        {/* Main Button */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center gap-2">
          <Sparkles size={20} />
          <span className="font-semibold text-sm hidden group-hover:inline-block transition-all">
            My AI
          </span>
        </div>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}

        {/* Pulse Ring */}
        <div className="absolute inset-0 rounded-full bg-indigo-500 opacity-20 animate-ping" />
      </div>
    </button>
  );
}


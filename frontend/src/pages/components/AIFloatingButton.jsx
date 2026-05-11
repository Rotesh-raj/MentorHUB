import { useState, useEffect, useRef } from "react";
import { useAI } from "../../context/AIContext";
import { Sparkles } from "lucide-react";
import { motion, useAnimation } from "framer-motion";

export default function AIFloatingButton() {
  const { toggleChat, unreadCount } = useAI();
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  // Initial position from localStorage or default
  useEffect(() => {
    const savedPos = localStorage.getItem("ai_button_pos");
    if (savedPos) {
      try {
        const { x, y } = JSON.parse(savedPos);
        controls.set({ x, y });
      } catch (e) {
        console.error("Failed to parse saved position", e);
      }
    } else {
      // Default position: bottom-right
      // We don't need to set it explicitly if we use the initial fixed classes
      // But for framer-motion to track it correctly, it's better to start at 0,0
      // and use fixed bottom-6 right-6 as the anchor.
    }
  }, [controls]);

  const onDragStart = (event, info) => {
    setIsDragging(true);
    dragStartPos.current = { x: info.point.x, y: info.point.y };
  };

  const onDragEnd = (event, info) => {
    setIsDragging(false);
    const { x, y } = info.offset;
    
    // Snap to left or right edge
    const screenWidth = window.innerWidth;
    const currentX = info.point.x;
    
    // Determine which side is closer
    // Note: info.point.x is absolute. We need to calculate the relative X for the motion div.
    // However, it's simpler to just check current screen position and snap the relative X.
    
    let targetX = info.offset.x;
    if (currentX < screenWidth / 2) {
      // Snap to left (relative to original right-6 position)
      targetX = -(screenWidth - 80); // roughly
    } else {
      // Snap to right
      targetX = 0; // Back to original right-6
    }

    controls.start({
      x: targetX,
      y: info.offset.y,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }).then(() => {
      localStorage.setItem("ai_button_pos", JSON.stringify({ x: targetX, y: info.offset.y }));
    });
  };

  const handleClick = () => {
    if (!isDragging) {
      toggleChat();
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      animate={controls}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 cursor-grab active:cursor-grabbing"
    >
      <button
        onClick={handleClick}
        className="group relative"
        aria-label="Open AI Assistant"
      >
        {/* Main Button */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
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
        <div className="absolute inset-0 rounded-full bg-indigo-500 opacity-20 animate-ping pointer-events-none" />
      </button>
    </motion.div>
  );
}



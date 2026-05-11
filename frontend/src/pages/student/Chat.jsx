import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, CheckCheck } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useNotification } from '../../context/NotificationContext';

const Chat = () => {
  const { id: appointmentId } = useParams();
  const { user } = useAuth();
  const { socket, joinChatRoom, emitTyping, emitStopTyping, onlineUsers, checkStatus } = useSocket();
  const { error } = useNotification();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageIdsRef = useRef(new Set()); // To prevent duplicates

  // Helper to check if message is from current user
  const isMyMessage = (msg) => {
    const senderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
    return senderId === user._id;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const appointmentRes = await api.get(`/appointments/chat-details/${appointmentId}`);
        const appointmentData = appointmentRes.data;
        setAppointment(appointmentData);
        
        const otherUser = appointmentData.teacherId._id === user._id 
          ? appointmentData.studentId 
          : appointmentData.teacherId;
        setPartner(otherUser);

        // Fetch messages
        const messagesRes = await api.get(`/messages/${appointmentId}`);
        const historicalMessages = messagesRes.data;
        
        // Populate duplicate prevention set
        historicalMessages.forEach(msg => messageIdsRef.current.add(msg._id));
        setMessages(historicalMessages);
        
        // Mark as seen
        await api.patch(`/messages/seen/${appointmentId}`);

        // Check partner status immediately after finding out who they are
        if (socket) {
          checkStatus(otherUser._id);
        }
      } catch (err) {
        console.error(err);
        error('Failed to load chat');
        navigate('/student/appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [appointmentId, user?._id, socket?.id]); // Re-run if socket connects

  useEffect(() => {
    if (!socket || !partner) return;

    joinChatRoom(appointmentId);
    checkStatus(partner._id);

    socket.on("message_received", (message) => {
      if (message.appointmentId === appointmentId) {
        if (!messageIdsRef.current.has(message._id)) {
          messageIdsRef.current.add(message._id);
          setMessages((prev) => [...prev, message]);
        }
      }
    });

    socket.on("user_typing", ({ userId, userName }) => {
      if (userId !== user._id) {
        setTypingUser(userName);
        setIsTyping(true);
      }
    });

    socket.on("user_stop_typing", ({ userId }) => {
      if (userId !== user._id) {
        setIsTyping(false);
        setTypingUser(null);
      }
    });

    socket.on("user_online", (userId) => {
      if (userId === partner?._id) {
        checkStatus(userId);
      }
    });

    return () => {
      socket.off("message_received");
      socket.off("user_typing");
      socket.off("user_stop_typing");
      socket.off("user_online");
    };
  }, [socket, appointmentId, partner?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    emitTyping(`appointment_${appointmentId}`);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping(`appointment_${appointmentId}`);
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await api.post('/messages/send', {
        appointmentId,
        message: newMessage,
        receiverId: partner._id
      });
      setNewMessage('');
      emitStopTyping(`appointment_${appointmentId}`);
    } catch (err) {
      error('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 overflow-hidden">
      {/* Premium Chat Header */}
      <nav className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Link 
            to="/student/appointments" 
            className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500"
          >
            <ChevronLeft size={20} />
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-blue-100">
                {partner?.profilePic ? (
                  <img src={partner.profilePic} alt={partner.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-600 font-bold">
                    {partner?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${
                onlineUsers.get(partner?._id) === 'online' ? 'bg-emerald-500' : 'bg-slate-300'
              }`} />
            </div>
            <div className="min-w-0">
              <h2 className="font-black text-slate-900 text-sm truncate">{partner?.name}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {onlineUsers.get(partner?._id) === 'online' ? (
                  <span className="text-emerald-500">Active Now</span>
                ) : (
                  'Offline'
                )}
              </p>
            </div>
          </div>
        </div>
      </nav>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {messages.map((msg, index) => {
            const isMe = isMyMessage(msg);
            return (
              <div
                key={msg._id || index}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-2xl shadow-sm relative group ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-br-none shadow-blue-200' 
                    : 'bg-white text-slate-800 rounded-bl-none'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <div className={`flex items-center gap-1 mt-1.5 ${isMe ? 'justify-end text-blue-100' : 'justify-start text-slate-400'}`}>
                    <span className="text-[9px] font-bold uppercase">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <CheckCheck size={12} className={msg.seen ? "text-blue-200" : "opacity-50"} />}
                  </div>
                </div>
              </div>
            );
          })}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                placeholder="Type your message..."
                className="w-full bg-slate-100 border-none rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-blue-600 text-white p-3.5 rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all"
            >
              <Send size={20} />
            </button>
          </form>
          {/* Safe Area Padding for Mobile */}
          <div className="h-2 md:hidden" />
        </div>
      </div>
    </div>
  );
};

export default Chat;

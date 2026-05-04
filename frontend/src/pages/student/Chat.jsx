import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useNotification } from '../../context/NotificationContext';

const Chat = () => {
  const { id: appointmentId } = useParams();
  const { user } = useAuth();
  const { socket, joinChatRoom, emitTyping, emitStopTyping, onlineUsers } = useSocket();
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
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col h-screen">
      {/* Premium Chat Header */}
      <nav className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link to="/student/appointments" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {partner?.name?.charAt(0)}
              </div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${onlineUsers.get(partner?._id) === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>
            <div>
              <h2 className="font-bold text-gray-900 leading-tight">{partner?.name}</h2>
              <p className="text-xs text-gray-500">
                {onlineUsers.get(partner?._id) === 'online' ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden md:inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
            {appointment?.topic}
          </span>
        </div>
      </nav>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:px-20 space-y-3 bg-[#e5ddd5] dark:bg-gray-900 custom-scrollbar" 
           style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}>
        <div className="flex justify-center mb-4">
          <span className="bg-white/80 backdrop-blur-sm px-4 py-1 rounded-lg text-xs text-gray-500 shadow-sm uppercase font-bold tracking-wider">
            Appointment Approved
          </span>
        </div>

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${isMyMessage(msg) ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm relative group ${
                isMyMessage(msg)
                  ? 'bg-[#dcf8c6] text-gray-800 rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none'
              }`}
            >
              <p className="text-sm md:text-base leading-relaxed">{msg.message}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <p className="text-[10px] text-gray-500">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {isMyMessage(msg) && (
                  <span className={`text-[10px] ${msg.seen ? 'text-blue-500' : 'text-gray-400'}`}>
                    ✓✓
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Modern Message Input */}
      <div className="bg-[#f0f2f5] px-4 py-3 md:px-20">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message"
            className="flex-1 bg-white border-none rounded-full px-6 py-3 focus:ring-2 focus:ring-green-500 shadow-sm"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-12 h-12 bg-[#00a884] text-white rounded-full flex items-center justify-center hover:bg-[#008f6f] transition-all disabled:opacity-50 disabled:grayscale shadow-md"
          >
            <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;

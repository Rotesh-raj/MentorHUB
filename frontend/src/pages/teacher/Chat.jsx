import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useNotification } from '../../context/NotificationContext';

const Chat = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const { socket, sendMessage } = useSocket();
  const { error } = useNotification();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student details
        const studentRes = await api.get(`/student/teacher/${userId}`);
        setStudent(studentRes.data);

        // Fetch messages
        const messagesRes = await api.get(`/messages/${userId}`);
        setMessages(messagesRes.data);
      } catch (err) {
        error('Failed to load chat');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (message) => {
        if (message.senderId === userId) {
          setMessages((prev) => [...prev, message]);
        }
      });
    }
    return () => {
      if (socket) {
        socket.off('receive_message');
      }
    };
  }, [socket, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        receiverId: userId,
        message: newMessage
      };
      
      await api.post('/messages', messageData);
      sendMessage(userId, newMessage);
      setMessages((prev) => [...prev, {
        senderId: user._id,
        receiverId: userId,
        message: newMessage,
        createdAt: new Date()
      }]);
      setNewMessage('');
    } catch (err) {
      error('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/teacher" className="text-xl font-bold">Smart Campus Connect</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/teacher/requests" className="hover:bg-green-700 px-3 py-2 rounded">Back to Requests</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Chat Header */}
          <div className="bg-green-50 p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">{student?.name || 'Student'}</h2>
            <p className="text-sm text-gray-600">USN: {student?.referenceId || 'N/A'}</p>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.senderId === user._id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className={`text-xs mt-1 ${msg.senderId === user._id ? 'text-green-200' : 'text-gray-500'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="border-t p-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;

import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Map());
  const { user, isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io('http://localhost:5000', {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      newSocket.on('connect', () => {
        console.log('✅ Socket Connected');
        newSocket.emit('join_user', user._id);
      });

      newSocket.on('user_status', ({ userId, status }) => {
        setOnlineUsers(prev => {
          const newMap = new Map(prev);
          newMap.set(userId, status);
          return newMap;
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [isAuthenticated, user?._id]);

  const joinChatRoom = (appointmentId) => {
    if (socket && user) {
      socket.emit('join_chat', { appointmentId, userId: user._id });
    }
  };

  const emitTyping = (roomId) => {
    if (socket && user) {
      socket.emit("typing", { roomId, userId: user._id, userName: user.name });
    }
  };

  const emitStopTyping = (roomId) => {
    if (socket && user) {
      socket.emit("stop_typing", { roomId, userId: user._id });
    }
  };

  const value = {
    socket,
    onlineUsers,
    joinChatRoom,
    emitTyping,
    emitStopTyping
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

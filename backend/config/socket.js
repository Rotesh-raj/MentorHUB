import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const setupSocket = (io) => {
  // Authentication middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name}`);

    // Join user to their personal room
    socket.join(socket.user._id.toString());

    // Handle joining chat rooms
    socket.on('join_chat', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.user.name} joined chat room: ${roomId}`);
    });

    // Handle sending messages
    socket.on('send_message', (data) => {
      const { receiverId, message, appointmentId } = data;
      io.to(receiverId).emit('receive_message', {
        senderId: socket.user._id,
        senderName: socket.user.name,
        message,
        appointmentId,
        createdAt: new Date()
      });
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const { receiverId } = data;
      io.to(receiverId).emit('user_typing', {
        senderId: socket.user._id,
        senderName: socket.user.name
      });
    });

    // Handle read receipts
    socket.on('message_read', (data) => {
      const { senderId, messageId } = data;
      io.to(senderId).emit('message_read_by_receiver', {
        messageId,
        readBy: socket.user._id,
        readAt: new Date()
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name}`);
    });
  });
};

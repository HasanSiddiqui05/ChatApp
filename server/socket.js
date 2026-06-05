import { Server } from "socket.io";
import Message from "./Model/messageModel.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = {};

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
      // Broadcast to all users that online status changed
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
      console.log(`⚡ User connected: ${userId} with socket: ${socket.id}`);
    }

    socket.on("joinRoom", ({ sender, receiver }) => {
      const roomId = [sender, receiver].sort().join("_");
      socket.join(roomId);
      console.log(`User ${sender} joined room ${roomId}`);
    });

    socket.on("sendMessage", async (data) => {
      const { sender, receiver, content, messageType } = data;
      const roomId = [sender, receiver].sort().join("_");

      const newMsg = new Message({ sender, receiver, roomId, content, messageType: messageType || "text", });

      await newMsg.save();

      io.to(roomId).emit("receiveMessage", newMsg);
    });

    socket.on("disconnect", () => {
      if (userId && userId !== "undefined") {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        console.log(`❌ User disconnected: ${userId}`);
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

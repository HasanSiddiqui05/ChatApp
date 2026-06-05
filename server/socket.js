import { Server } from "socket.io";
import Message from "./Model/messageModel.js";

let io;

export const initSocket = (server) => {
  const allowedOrigins = [
    process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : null,
    "http://localhost:5173",
  ].filter(Boolean);

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const isAllowed = allowedOrigins.includes(origin) || 
                          origin.endsWith(".vercel.app") ||
                          origin === "http://localhost:5173";
        if (isAllowed) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
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

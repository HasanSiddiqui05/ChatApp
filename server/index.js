import express from 'express';
import cors from 'cors';
import connectDB from './dbConnection.js';
import userRoutes from './Routes/userRoutes.js';
import messageRoutes from './Routes/messageRoutes.js';
import contactRoutes from './Routes/contactRoutes.js'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from "http";
import { initSocket } from "./socket.js";


dotenv.config();
const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : null,
  "http://localhost:5173",
].filter(Boolean);

app.use(cors({
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
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/Images', express.static('Images'));

app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);  
app.use('/api/contact', contactRoutes)

const server = createServer(app);
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  server.listen(PORT, () => console.log(`🚀 Server running on port: ${PORT}`));
});

initSocket(server);

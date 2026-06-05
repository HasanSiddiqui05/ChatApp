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

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
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

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Message from "./Message";
import { ScrollArea } from "@/components/ui/scroll-area";
import Cookies from "js-cookie";
import { useSocketContext } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/message/`;

const ChatBox = ({ contactId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const { socket } = useSocketContext();
  const { AuthState } = useAuth();

  const user1 = Cookies.get('uid') || AuthState?.user?.uniqueId;
  const user2 = contactId;

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch initial messages
  useEffect(() => {
    if (!user1 || !user2) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_URL}?user1=${user1}&user2=${user2}`,
          { withCredentials: true }
        );
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user1, user2]);

  // Handle socket real-time messages
  useEffect(() => {
    if (!user1 || !user2 || !socket) return;

    // Join room
    socket.emit("joinRoom", { sender: user1, receiver: user2 });

    const currentRoomId = [user1, user2].sort().join("_");

    const handleReceiveMsg = (newMsg) => {
      if (newMsg.roomId === currentRoomId) {
        setMessages((prev) => [...prev, newMsg]);
      }
    };

    socket.on("receiveMessage", handleReceiveMsg);

    // Cleanup listener on unmount
    return () => {
      socket.off("receiveMessage", handleReceiveMsg);
    };
  }, [user1, user2, socket]);

  return (
    <ScrollArea className="w-full h-full flex flex-col px-6 pt-4 bg-transparent">
      <div className="flex flex-col justify-end min-h-full pb-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 my-auto">
            <p className="text-sm font-medium bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-100">Say hello! 👋</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <Message
              key={msg._id || index}
              text={msg.text || msg.content}
              time={new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              sender={msg.sender?.uniqueId === user1 || msg.sender === user1 || msg.sender?._id === user1 ? "me" : "other"}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatBox;

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useSocketContext } from "./SocketContext";

export const ContactContext = createContext();

export const useContactContext = () => {
  return useContext(ContactContext);
};

export const ContactContextProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const { AuthState } = useAuth();
  const { socket } = useSocketContext();

  const fetchContacts = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/contact/getAllChats`, {
        withCredentials: true,
      });
      setContacts(res.data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  }, []);

  useEffect(() => {
    if (AuthState?.isLoggedIn) {
      fetchContacts();
    } else {
      setContacts([]);
    }
  }, [AuthState?.isLoggedIn, fetchContacts]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = () => {
      fetchContacts();
    };

    socket.on("receiveMessage", handleNewMessage);
    
    return () => {
      socket.off("receiveMessage", handleNewMessage);
    };
  }, [socket, fetchContacts]);

  return (
    <ContactContext.Provider value={{ contacts, fetchContacts }}>
      {children}
    </ContactContext.Provider>
  );
};

import React, { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "../lib/socket";
import Cookies from "js-cookie";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { AuthState } = useAuth(); // Listen to AuthState to know when logged in

  useEffect(() => {
    const userId = AuthState?.user?.uniqueId || Cookies.get('uid');
    if (AuthState?.isLoggedIn && userId) {
      // Connect socket globally
      const socketInstance = getSocket();
      socketInstance.io.opts.query = { userId };
      socketInstance.connect();
      setSocket(socketInstance);

      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        socketInstance.close();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [AuthState.isLoggedIn, AuthState?.user?.uniqueId]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

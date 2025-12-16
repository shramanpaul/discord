"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export function SocketProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Ensure the server-side Socket.IO is initialized before attempting websocket upgrade
    (async () => {
      try {
        await fetch('/api/socket/init');
      } catch (e) {
        // ignore — we'll still attempt to connect
      }

      // Connect relative to the current origin to avoid cross-origin/ws upgrades
      const socketInstance = new (ClientIO as any)(undefined, {
        path: "/api/socket/io",
        addTrailingSlash: false
      });

      socketInstance.on("connect", () => {
        setIsConnected(true);
      });

      socketInstance.on("disconnect", () => {
        setIsConnected(false);
      });

      setSocket(socketInstance);

      return () => socketInstance.disconnect();
    })();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
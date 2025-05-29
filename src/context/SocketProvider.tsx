import { createContext, useContext, useMemo } from "react";
import { io, Socket } from "socket.io-client";

// Define the type for our context
const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useMemo(
    () =>
      io("https://web-rtc-server-kwkv.onrender.com", {
        transports: ["websocket"], // Force WebSocket only
        withCredentials: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      }),
    [],
  );
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;

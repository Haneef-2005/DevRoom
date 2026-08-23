import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL;

export function useSocket() {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);

        newSocket.on("connect", () => {
            console.log("Connected to DevRoom server");
            setConnected(true);
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected from DevRoom server");
            setConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return {
        socket,
        connected
    };
}
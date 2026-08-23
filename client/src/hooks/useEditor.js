import { useEffect } from "react";

export function useEditor(
    socket,
    roomCode,
    code,
    setCode
) {
    useEffect(() => {
        if (!socket || !roomCode) return;

        const handleCodeUpdate = ({ code: incomingCode }) => {
            setCode(incomingCode);
        };

        socket.on("code-update", handleCodeUpdate);

        return () => {
            socket.off("code-update", handleCodeUpdate);
        };
    }, [socket, roomCode, setCode]);

    const updateCode = (newCode) => {
        setCode(newCode);

        if (!socket || !roomCode) return;

        socket.emit("code-update", {
            roomCode,
            code: newCode
        });
    };

    return {
        updateCode
    };
}
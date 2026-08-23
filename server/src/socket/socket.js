const registerRoomHandlers = require("./roomHandlers");

function initializeSocket(io, rooms) {
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        // Existing room functionality
        registerRoomHandlers(io, socket, rooms);

        // ================================
        // WebRTC SIGNALING
        // ================================

        socket.on("webrtc-offer", ({ target, offer }) => {
            io.to(target).emit("webrtc-offer", {
                sender: socket.id,
                offer
            });
        });

        socket.on("webrtc-answer", ({ target, answer }) => {
            io.to(target).emit("webrtc-answer", {
                sender: socket.id,
                answer
            });
        });

        socket.on(
            "webrtc-ice-candidate",
            ({ target, candidate }) => {
                io.to(target).emit(
                    "webrtc-ice-candidate",
                    {
                        sender: socket.id,
                        candidate
                    }
                );
            }
        );

        // ================================
        // DISCONNECT
        // ================================

        socket.on("disconnect", () => {
            console.log(
                "Socket disconnected:",
                socket.id
            );
        });
    });
}

module.exports = initializeSocket;
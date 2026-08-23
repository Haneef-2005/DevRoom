function registerRoomHandlers(io, socket, rooms) {

    // ==============================
    // JOIN ROOM
    // ==============================

    socket.on("join-room", ({ roomCode, username }) => {

        const room = rooms.get(roomCode);

        if (!room) {
            socket.emit("room-error", {
                message: "Room not found"
            });

            return;
        }

        // Only 2 people allowed
        if (room.users.length >= 2) {
            socket.emit("room-error", {
                message:
                    "Room is full. Only 2 participants are allowed."
            });

            return;
        }

        // First person = interviewer
        // Second person = candidate
        const isInterviewer = room.users.length === 0;

        const user = {
            socketId: socket.id,
            username,
            isInterviewer,
            tabSwitchCount: 0,
            fullscreenExitCount: 0
        };

        // Add user ONLY ONCE
        room.users.push(user);

        // Store information on socket
        socket.data.roomCode = roomCode;
        socket.data.username = username;
        socket.data.isInterviewer = isInterviewer;

        // Join Socket.io room
        socket.join(roomCode);

        console.log(
            `${username} joined room ${roomCode} as ${
                isInterviewer ? "Interviewer" : "Candidate"
            }`
        );

        // ==============================
        // SEND ROOM DATA TO NEW USER
        // ==============================

        socket.emit("room-joined", {
            roomCode,
            socketId: socket.id,
            username,
            isInterviewer,
            users: room.users,
            code: room.codeContent
        });

        // ==============================
        // TELL OTHER PARTICIPANT
        // ==============================

        socket.to(roomCode).emit("user-joined", {
            socketId: socket.id,
            username,
            isInterviewer,
            tabSwitchCount: 0,
            fullscreenExitCount: 0
        });
    });


    // ==============================
    // CHAT
    // ==============================

    socket.on(
        "send-message",
        ({ roomCode, username, message }) => {

            const room = rooms.get(roomCode);

            if (!room) {
                return;
            }

            io.to(roomCode).emit("receive-message", {
                username,
                message,
                timestamp: new Date().toISOString()
            });
        }
    );


    // ==============================
    // CODE UPDATE
    // ==============================

    socket.on(
        "code-update",
        ({ roomCode, code }) => {

            const room = rooms.get(roomCode);

            if (!room) {
                return;
            }

            // Save latest code
            room.codeContent = code;

            // Send code to everyone except sender
            socket.to(roomCode).emit(
                "code-update",
                {
                    code
                }
            );
        }
    );


    // ==============================
    // CANDIDATE TAB SWITCH
    // ==============================

    socket.on(
        "candidate-tab-switch",
        () => {

            const roomCode = socket.data.roomCode;

            if (!roomCode) {
                return;
            }

            const room = rooms.get(roomCode);

            if (!room) {
                return;
            }

            // Interviewer should never trigger
            // candidate tab warnings
            if (socket.data.isInterviewer) {
                return;
            }

            // Find candidate
            const candidate = room.users.find(
                (user) =>
                    user.socketId === socket.id
            );

            if (!candidate) {
                return;
            }

            // Increment count
            candidate.tabSwitchCount =
                (candidate.tabSwitchCount || 0) + 1;

            // Find interviewer
            const interviewer = room.users.find(
                (user) =>
                    user.isInterviewer === true
            );

            if (!interviewer) {
                return;
            }

            // Notify interviewer ONLY
            io.to(interviewer.socketId).emit(
                "candidate-tab-switch",
                {
                    username: candidate.username,

                    count:
                        candidate.tabSwitchCount,

                    candidateSocketId:
                        candidate.socketId
                }
            );

            console.log(
                `TAB SWITCH | ${candidate.username} | Count: ${candidate.tabSwitchCount}`
            );
        }
    );


    // ==============================
    // CANDIDATE FULLSCREEN EXIT
    // ==============================

    socket.on(
        "candidate-fullscreen-exit",
        () => {

            const roomCode = socket.data.roomCode;

            if (!roomCode) {
                return;
            }

            const room = rooms.get(roomCode);

            if (!room) {
                return;
            }

            // Interviewer cannot trigger
            if (socket.data.isInterviewer) {
                return;
            }

            // Find candidate
            const candidate = room.users.find(
                (user) =>
                    user.socketId === socket.id
            );

            if (!candidate) {
                return;
            }

            // Increment fullscreen exit count
            candidate.fullscreenExitCount =
                (candidate.fullscreenExitCount || 0) + 1;

            // Find interviewer
            const interviewer = room.users.find(
                (user) =>
                    user.isInterviewer === true
            );

            if (!interviewer) {
                return;
            }

            // Notify interviewer
            io.to(interviewer.socketId).emit(
                "candidate-fullscreen-exit",
                {
                    username:
                        candidate.username,

                    count:
                        candidate.fullscreenExitCount,

                    candidateSocketId:
                        candidate.socketId
                }
            );

            console.log(
                `FULLSCREEN EXIT | ${candidate.username} | Count: ${candidate.fullscreenExitCount}`
            );
        }
    );

    

    // ==============================
    // KICK CANDIDATE
    // ==============================

    socket.on(
        "kick-candidate",
        ({ candidateSocketId }) => {

            const roomCode =
                socket.data.roomCode;

            if (!roomCode) {
                return;
            }

            const room = rooms.get(roomCode);

            if (!room) {
                return;
            }

            // ONLY interviewer can kick
            if (!socket.data.isInterviewer) {
                console.log(
                    "Unauthorized kick attempt"
                );

                return;
            }

            // Find candidate
            const candidate = room.users.find(
                (user) =>
                    user.socketId ===
                    candidateSocketId
            );

            // Candidate doesn't exist
            if (!candidate) {
                return;
            }

            // Prevent interviewer from kicking
            // another interviewer
            if (candidate.isInterviewer) {
                return;
            }

            console.log(
                `KICK | ${candidate.username} | Room: ${roomCode}`
            );

            // ==============================
            // TELL CANDIDATE
            // ==============================

            io.to(candidateSocketId).emit(
                "candidate-kicked",
                {
                    message:
                        "You have been removed from the interview by the interviewer."
                }
            );

            // ==============================
            // REMOVE SOCKET FROM ROOM
            // ==============================

            const candidateSocket =
                io.sockets.sockets.get(
                    candidateSocketId
                );

            if (candidateSocket) {

                candidateSocket.leave(
                    roomCode
                );

                candidateSocket.data.roomCode =
                    null;

                candidateSocket.data.isInterviewer =
                    false;
            }

            // ==============================
            // REMOVE FROM ROOM USERS
            // ==============================

            room.users =
                room.users.filter(
                    (user) =>
                        user.socketId !==
                        candidateSocketId
                );

            // ==============================
            // TELL INTERVIEWER
            // ==============================

            socket.emit(
                "candidate-kicked-success",
                {
                    username:
                        candidate.username
                }
            );

            // ==============================
            // UPDATE OTHER PARTICIPANTS
            // ==============================

            socket.to(roomCode).emit(
                "user-left",
                {
                    socketId:
                        candidateSocketId,

                    username:
                        candidate.username
                }
            );
        }
    );


    // ==============================
    // LEAVE ROOM
    // ==============================

    socket.on(
        "leave-room",
        () => {
            removeUserFromRoom();
        }
    );


    // ==============================
    // DISCONNECT
    // ==============================

    socket.on(
        "disconnect",
        () => {
            removeUserFromRoom();
        }
    );


    // ==============================
    // REMOVE USER
    // ==============================

    function removeUserFromRoom() {

        const roomCode =
            socket.data.roomCode;

        if (!roomCode) {
            return;
        }

        const room =
            rooms.get(roomCode);

        if (!room) {
            return;
        }

        const username =
            socket.data.username;

        // Check whether user actually exists
        const userExists =
            room.users.some(
                (user) =>
                    user.socketId ===
                    socket.id
            );

        if (!userExists) {
            socket.data.roomCode = null;
            return;
        }

        // Remove user
        room.users =
            room.users.filter(
                (user) =>
                    user.socketId !==
                    socket.id
            );

        // Tell remaining participant
        socket.to(roomCode).emit(
            "user-left",
            {
                socketId: socket.id,
                username
            }
        );

        console.log(
            `${username} left room ${roomCode}`
        );

        // Clear socket data
        socket.data.roomCode = null;
        socket.data.username = null;
        socket.data.isInterviewer = false;
    }
}


module.exports = registerRoomHandlers;
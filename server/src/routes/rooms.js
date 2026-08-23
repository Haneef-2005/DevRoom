const express = require("express");

function createRoomRoutes(rooms) {
    const router = express.Router();

    function generateRoomCode() {
        const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        let code = "";

        for (let i = 0; i < 6; i++) {
            code += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }

        return code;
    }

    router.post("/create", (req, res) => {
        let roomCode = generateRoomCode();

        while (rooms.has(roomCode)) {
            roomCode = generateRoomCode();
        }

        const room = {
            code: roomCode,
            users: [],
            codeContent: `function twoSum(nums, target) {
    // Write your solution here
}`,
            createdAt: new Date()
        };

        rooms.set(roomCode, room);

        console.log(`Room created: ${roomCode}`);

        res.json({
            success: true,
            roomCode
        });
    });

    router.get("/:roomCode", (req, res) => {
        const roomCode = req.params.roomCode.toUpperCase();

        const room = rooms.get(roomCode);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        res.json({
            success: true,
            room
        });
    });

    return router;
}

module.exports = createRoomRoutes;
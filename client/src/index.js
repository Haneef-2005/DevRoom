const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const roomRoutes = require("./routes/rooms");
const initializeSocket = require("./socket");

const app = express();

const allowedOrigins = [
    "http://localhost:5173"
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin
            // (Postman, server-side requests, etc.)
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error("Not allowed by CORS")
            );
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ],
        credentials: true
    })
);

app.use(express.json());

const rooms = new Map();

app.use("/api/rooms", roomRoutes(rooms));

app.get("/", (req, res) => {
    res.json({
        message: "DevRoom server is running"
    });
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

initializeSocket(io, rooms);

const PORT = 5000;

server.listen(PORT, () => {
    console.log(
        `DevRoom server running on http://localhost:${PORT}`
    );
});
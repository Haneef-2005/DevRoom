const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { execFile } = require("child_process");

const roomRoutes = require("./routes/rooms");
const initializeSocket = require("./socket/socket");

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://8xfnbr97-5173.inc1.devtunnels.ms",
    "https://devroom-client.onrender.com"
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));
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
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

initializeSocket(io, rooms);

const PORT = process.env.PORT || 5000;

/* ================================
   CODE EXECUTION
================================ */

app.post("/api/run", (req, res) => {

    const { code, language } = req.body;

    if (!code || typeof code !== "string") {
        return res.status(400).json({
            success: false,
            error: "Code is required"
        });
    }

    /*
        Supported languages:

        JavaScript → node
        Python     → python
    */

    let command;
    let args;

    if (language === "python") {

        command = "python";
        args = ["-c", code];

    } else {

        // Default to JavaScript
        command = "node";
        args = ["-e", code];

    }

    console.log(
        `Running ${language || "javascript"} code...`
    );

    execFile(
        command,
        args,
        {
            timeout: 5000,
            maxBuffer: 1024 * 1024
        },
        (error, stdout, stderr) => {

            if (error) {

                console.log(
                    "Execution error:",
                    stderr || error.message
                );

                return res.json({
                    success: false,
                    output: stderr || error.message
                });
            }

            return res.json({
                success: true,
                output:
                    stdout ||
                    "Program executed successfully."
            });
        }
    );
});

/* ================================
   START SERVER
================================ */

server.listen(PORT, "0.0.0.0", () => {
    console.log(
        `DevRoom server running on port ${PORT}`
    );
});
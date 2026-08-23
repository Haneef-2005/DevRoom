import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
function Home() {
    const [roomCode, setRoomCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const createRoom = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
    `${API_URL}/api/rooms/create`,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }
);

            const data = await response.json();

            if (data.success) {
                navigate(`/room/${data.roomCode}`);
            }
        } catch (error) {
            console.error(error);
            setError("Unable to create room");
        } finally {
            setLoading(false);
        }
    };

    const joinRoom = async () => {
        const code = roomCode.trim().toUpperCase();

        if (!code) {
            setError("Enter a room code");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
    `${API_URL}/api/rooms/${code}`
);

            const data = await response.json();

            if (!response.ok) {
                setError("Room not found");
                return;
            }

            if (data.success) {
                navigate(`/room/${code}`);
            }
        } catch (error) {
            console.error(error);
            setError("Unable to join room");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">

            <div className="w-full max-w-5xl">

                <div className="text-center mb-12">

                    <div className="text-4xl font-bold mb-4">
                        Dev<span className="text-blue-500">Room</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Practice coding interviews
                    </h1>

                    <p className="text-slate-400 text-lg">
                        Practice alone with an AI interviewer or
                        invite a friend.
                    </p>

                </div>

                <div className="grid md:grid-cols-2 gap-6">

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

                        <h2 className="text-2xl font-semibold mb-3">
                            Create a room
                        </h2>

                        <p className="text-slate-400 mb-6">
                            Start a new mock interview.
                        </p>

                        <button
                            onClick={createRoom}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg"
                        >
                            {loading ? "Creating..." : "Create Room"}
                        </button>

                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

                        <h2 className="text-2xl font-semibold mb-3">
                            Join a room
                        </h2>

                        <p className="text-slate-400 mb-6">
                            Enter the room code shared with you.
                        </p>

                        <input
                            type="text"
                            placeholder="Enter room code"
                            value={roomCode}
                            onChange={(e) =>
                                setRoomCode(e.target.value)
                            }
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 mb-3 uppercase"
                        />

                        <button
                            onClick={joinRoom}
                            disabled={loading}
                            className="w-full border border-slate-700 hover:bg-slate-800 py-3 rounded-lg"
                        >
                            Join Room
                        </button>

                    </div>

                </div>

                {error && (
                    <p className="text-red-400 text-center mt-6">
                        {error}
                    </p>
                )}

            </div>

        </div>
    );
}

export default Home;
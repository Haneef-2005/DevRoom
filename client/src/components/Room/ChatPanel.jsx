import { useEffect, useRef, useState } from "react";

function ChatPanel({
    socket,
    roomCode,
    username,
    problem,
    code
}) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages, isLoading]);

    const sendMessage = async () => {
        const currentMessage = message.trim();

        if (!currentMessage || isLoading) return;

        const userMessage = {
            id: Date.now(),
            username,
            message: currentMessage,
            type: "user"
        };

        setMessages((current) => [
            ...current,
            userMessage
        ]);

        setMessage("");
        setIsLoading(true);

        try {
            const response = await fetch(
                "https://devroom-1-ggf4.onrender.com/review",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: currentMessage,
                        problem:
                            String(problem?.title || "") +
                            "\n\n" +
                            String(problem?.description || ""),
                        code: String(code || "")
                    })
                }
            );

            if (!response.ok) {
                throw new Error("AI request failed");
            }

            const data = await response.json();

            setMessages((current) => [
                ...current,
                {
                    id: Date.now() + 1,
                    username: "AI Interviewer",
                    message:
                        data.response ||
                        "I couldn't generate a response.",
                    type: "ai"
                }
            ]);

        } catch (error) {
            console.error("AI Interviewer error:", error);

            setMessages((current) => [
                ...current,
                {
                    id: Date.now() + 1,
                    username: "System",
                    message:
                        "Unable to connect to the AI interviewer. Please check whether the backend is running.",
                    type: "error"
                }
            ]);
        } finally {
            setIsLoading(false);

            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="h-full min-h-0 flex flex-col bg-slate-950">

            {/* HEADER */}

            <div className="shrink-0 px-5 py-4 border-b border-slate-800 bg-slate-950">

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <div className="relative">

                            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-base">
                                🤖
                            </div>

                            <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-slate-950" />

                        </div>

                        <div>

                            <h2 className="text-sm font-semibold text-white">
                                AI Interviewer
                            </h2>

                            <div className="flex items-center gap-1.5 mt-0.5">

                                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />

                                <span className="text-[10px] text-green-400">
                                    Online
                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="text-[10px] text-slate-600 uppercase tracking-wider">
                        Interview Mode
                    </div>

                </div>

            </div>


            {/* MESSAGES */}

            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 custom-scrollbar">

                {messages.length === 0 ? (

                    <div className="h-full flex items-center justify-center">

                        <div className="max-w-xs text-center">

                            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl">
                                🤖
                            </div>

                            <h3 className="text-sm font-semibold text-slate-200 mb-2">
                                Start the interview
                            </h3>

                            <p className="text-xs leading-5 text-slate-500">
                                Explain your approach, discuss your
                                reasoning, or ask for clarification.
                                The interviewer will evaluate your
                                response.
                            </p>

                        </div>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {messages.map((item) => (

                            <div
                                key={item.id}
                                className={
                                    item.type === "user"
                                        ? "flex justify-end"
                                        : "flex justify-start"
                                }
                            >

                                <div
                                    className={
                                        item.type === "user"
                                            ? "max-w-[85%]"
                                            : "max-w-[90%]"
                                    }
                                >

                                    {/* NAME */}

                                    <div
                                        className={
                                            item.type === "user"
                                                ? "flex justify-end mb-1.5"
                                                : "flex justify-start mb-1.5"
                                        }
                                    >

                                        <span
                                            className={
                                                item.type === "ai"
                                                    ? "text-[10px] text-purple-400 font-medium"
                                                    : item.type === "error"
                                                        ? "text-[10px] text-red-400 font-medium"
                                                        : "text-[10px] text-blue-400 font-medium"
                                            }
                                        >
                                            {item.username}
                                        </span>

                                    </div>


                                    {/* MESSAGE BUBBLE */}

                                    <div
                                        className={
                                            item.type === "ai"
                                                ? "bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-md px-4 py-3"
                                                : item.type === "error"
                                                    ? "bg-red-950/30 border border-red-900/40 rounded-2xl rounded-tl-md px-4 py-3"
                                                    : "bg-blue-600/15 border border-blue-500/20 rounded-2xl rounded-tr-md px-4 py-3"
                                        }
                                    >

                                        <p
                                            className={
                                                item.type === "error"
                                                    ? "text-xs leading-5 text-red-300"
                                                    : "text-xs leading-5 text-slate-300 whitespace-pre-wrap"
                                            }
                                        >
                                            {item.message}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        ))}


                        {/* AI TYPING */}

                        {isLoading && (

                            <div className="flex justify-start">

                                <div className="max-w-[90%]">

                                    <div className="mb-1.5">
                                        <span className="text-[10px] text-purple-400 font-medium">
                                            AI Interviewer
                                        </span>
                                    </div>

                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-md px-4 py-3">

                                        <div className="flex items-center gap-1.5">

                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />

                                            <span
                                                className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce"
                                                style={{
                                                    animationDelay: "150ms"
                                                }}
                                            />

                                            <span
                                                className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce"
                                                style={{
                                                    animationDelay: "300ms"
                                                }}
                                            />

                                            <span className="ml-1 text-[10px] text-slate-600">
                                                Thinking
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        )}

                        <div ref={messagesEndRef} />

                    </div>

                )}

            </div>


            {/* INPUT AREA */}

            <div className="shrink-0 border-t border-slate-800 bg-slate-950 p-4">

                <div className="relative">

                    <textarea
                        ref={inputRef}
                        value={message}
                        onChange={(event) =>
                            setMessage(event.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        placeholder={
                            isLoading
                                ? "AI interviewer is thinking..."
                                : "Explain your approach..."
                        }
                        disabled={isLoading}
                        rows={2}
                        className="w-full resize-none bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 pr-14 text-xs text-slate-200 placeholder:text-slate-600 outline-none transition focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 disabled:opacity-50"
                    />

                    <button
                        onClick={sendMessage}
                        disabled={!message.trim() || isLoading}
                        className="absolute right-2 bottom-2 w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white flex items-center justify-center transition"
                        title="Send message"
                    >
                        {isLoading ? (
                            <span className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                        ) : (
                            <span className="text-sm">
                                ↑
                            </span>
                        )}
                    </button>

                </div>

                <div className="flex items-center justify-between mt-2 px-1">

                    <span className="text-[9px] text-slate-600">
                        Enter to send · Shift + Enter for new line
                    </span>

                    <span className="text-[9px] text-slate-700">
                        AI Interviewer
                    </span>

                </div>

            </div>

        </div>
    );
}

export default ChatPanel;
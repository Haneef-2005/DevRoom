import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MonacoEditor from "../components/Editor/MonacoEditor";
import EditorToolbar from "../components/Editor/EditorToolbar";
import ChatPanel from "../components/Room/ChatPanel";
import ProblemPanel from "../components/Room/ProblemPanel";

import { useSocket } from "../hooks/useSocket";
import { useEditor } from "../hooks/useEditor";

import problems from "../data/Problems";

import MediaPanel from "../components/Room/MediaPanel";
import { useWebRTC } from "../hooks/useWebRTC";

import { useTabMonitor } from "../hooks/useTabMonitor";
import { useFullscreenMonitor } from "../hooks/useFullscreenMonitor";

function Room() {
    const { roomCode } = useParams();
    const API_URL = import.meta.env.VITE_API_URL;

    const { socket, connected } = useSocket();

    const [username, setUsername] = useState("");
    const [joined, setJoined] = useState(false);
    const [isInterviewer, setIsInterviewer] = useState(false);  
    const [candidateTabWarning, setCandidateTabWarning] = useState(false);
const [candidateTabWarningName, setCandidateTabWarningName] = useState("");
    const [candidateTabWarningCount, setCandidateTabWarningCount] = useState(0);
    const [fullscreenExitWarning, setFullscreenExitWarning] = useState(false);
    const [fullscreenExitWarningName, setFullscreenExitWarningName] = useState("");
    const [fullscreenExitWarningCount, setFullscreenExitWarningCount] = useState(0);

    const [code, setCode] = useState(
        problems[0]?.starterCode || ""
    );

    // Per-problem code cache — preserves candidate's work across switches
    const [codeByProblem, setCodeByProblem] = useState({});

    const [language, setLanguage] = useState("javascript");
    const [participants, setParticipants] = useState([]);

    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [testResults, setTestResults] = useState([]);
    const [isTesting, setIsTesting] = useState(false);
    const [activeAIPanel, setActiveAIPanel] = useState("copilot");

    // Current problem
    const [selectedProblemId, setSelectedProblemId] = useState(1);

    const currentProblem =
        problems.find(
            (problem) => problem.id === selectedProblemId
        ) || problems[0];

    console.log("CURRENT PROBLEM:", currentProblem);
    console.log("TEST CASES:", currentProblem?.testCases);

    // Editor synchronization
    const { updateCode: _updateCode } = useEditor(
        socket,
        roomCode,
        code,
        setCode
    );

    // Wrap updateCode to also persist the candidate's work in the cache
    const updateCode = (newCode) => {
        _updateCode(newCode);
        setCodeByProblem((prev) => ({
            ...prev,
            [selectedProblemId]: newCode,
        }));
    };

    // AI Co-pilot — user-triggered hints only
    const [copilotObservation, setCopilotObservation] = useState(
        "Stuck? Ask the AI for a hint. It will guide you without giving the complete solution."
    );

    const [copilotHistory, setCopilotHistory] = useState([]);
    const [copilotStatus, setCopilotStatus] = useState("Ready");
    const [hintLoading, setHintLoading] = useState(false);

    const AI_LIMIT = 20;

    const [aiRequestsUsed, setAiRequestsUsed] = useState(() =>
        Number(localStorage.getItem("devroom_ai_requests") || "0")
    );

    const [terminalHeight, setTerminalHeight] = useState(220);
    const [isResizing, setIsResizing] = useState(false);

    const {
        localVideoRef,
        localStream,
        remoteStreams,
        startLocalStream,
        callUser
    } = useWebRTC(socket, participants);

    const [cameraOn, setCameraOn] = useState(false);
    const [micOn, setMicOn] = useState(false);

    const toggleCamera = () => {
        if (!localStream) return;

        const tracks = localStream.getVideoTracks();

        const newState = !cameraOn;

        tracks.forEach((track) => {
            track.enabled = newState;
        });

        setCameraOn(newState);
    };

    const toggleMic = () => {
        if (!localStream) return;

        const tracks = localStream.getAudioTracks();

        tracks.forEach((track) => {
            track.enabled = !micOn;
        });

        setMicOn(!micOn);
    };

const {
    warningCount,
    showWarning,
    dismissWarning
} = useTabMonitor(
    joined,
    socket,
    isInterviewer
);

    

    const {
        isFullscreen,
        exitCount,
        showFullscreenWarning,
        enterFullscreen,
        dismissFullscreenWarning
    } = useFullscreenMonitor(
        joined,
        socket,
        isInterviewer
    );

    const getHint = async () => {
        if (hintLoading) return;

        const used = Number(
            localStorage.getItem("devroom_ai_requests") || "0"
        );

        if (used >= AI_LIMIT) {
            setCopilotStatus("Limit reached");
            setCopilotObservation(
                "Your development AI request limit has been reached."
            );
            return;
        }

        setHintLoading(true);
        setCopilotStatus("Thinking...");

        try {
            const response = await fetch(
                "https://devroom-ai.onrender.com",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        problem:
                            String(
                                currentProblem?.title ||
                                "Coding Interview Problem"
                            ) +
                            "\n\n" +
                            String(currentProblem?.description || ""),
                        code: String(code || "")
                    })
                }
            );

            if (!response.ok) {
                if (response.status === 429) {
                    setCopilotStatus("Quota reached");
                    setCopilotObservation(
                        "Gemini API quota has been reached. The AI hint is temporarily unavailable."
                    );
                    return;
                }

                throw new Error("Hint request failed");
            }

            const data = await response.json();

            if (data.observation) {
                const nextUsed = used + 1;

                localStorage.setItem(
                    "devroom_ai_requests",
                    String(nextUsed)
                );

                setAiRequestsUsed(nextUsed);
                setCopilotObservation(data.observation);

                setCopilotHistory((history) => [
                    ...history,
                    {
                        id: Date.now(),
                        observation: data.observation,
                        time: new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })
                    }
                ].slice(-6));
            }

            setCopilotStatus("Ready");
        } catch (error) {
            console.error("Co-pilot error:", error);
            setCopilotStatus("Offline");
            setCopilotObservation(
                "The AI hint service is currently unavailable."
            );
        } finally {
            setHintLoading(false);
        }
    };

    // Join Socket.io room
    useEffect(() => {
        if (!socket || !joined) return;

        socket.emit("join-room", {
            roomCode,
            username
        });

        return () => {
            socket.emit("leave-room");
        };
    }, [socket, joined, roomCode, username]);

    // Handle room events
    useEffect(() => {
        if (!socket) return;

        const handleRoomJoined = (data) => {
            console.log("Successfully joined:", data);

            setParticipants(data.users || []);

            setIsInterviewer(
                data.isInterviewer === true
            );

            if (data.code) {
                setCode(data.code);
            }
        };

        const handleUserJoined = (data) => {
            console.log("New user joined:", data);

            setParticipants((current) => {
                if (
                    current.some(
                        (user) => user.socketId === data.socketId
                    )
                ) {
                    return current;
                }

                return [
                    ...current,
                    {
                        socketId: data.socketId,
                        username: data.username,
                        isInterviewer: data.isInterviewer
                    }
                ];
            });
        };

        const handleUserLeft = (data) => {
            console.log("User left:", data);

            setParticipants((current) =>
                current.filter(
                    (user) => user.socketId !== data.socketId
                )
            );
        };

        const handleRoomError = (data) => {
            console.error("Room error:", data.message);
        };

        const handleCandidateTabSwitch = (data) => {
            if (!isInterviewer) return;

            const count = data.count || 0;
            const username = data.username || "Candidate";

            setCandidateTabWarningName(username);
            setCandidateTabWarningCount(count);
            setCandidateTabWarning(true);

            setParticipants((current) =>
                current.map((user) =>
                    user.socketId === data.candidateSocketId ||
                    user.username === username
                        ? {
                            ...user,
                            tabSwitchCount: count
                        }
                        : user
                )
            );
        };

        const handleCandidateKicked = (data) => {
    alert(
        data.message ||
        "You have been removed from the interview."
    );

    setJoined(false);

    // Redirect candidate to Home page
    window.location.href = "/";
};
        const handleCandidateFullscreenExit = (data) => {
            if (!isInterviewer) return;

            const count = data.count || 0;
            const username = data.username || "Candidate";

            setFullscreenExitWarningName(username);
            setFullscreenExitWarningCount(count);
            setFullscreenExitWarning(true);

            setParticipants((current) =>
                current.map((user) =>
                    user.socketId === data.candidateSocketId ||
                    user.username === username
                        ? {
                            ...user,
                            fullscreenExitCount: count
                        }
                        : user
                )
            );
        };

        socket.on("room-joined", handleRoomJoined);
        socket.on("user-joined", handleUserJoined);
        socket.on("user-left", handleUserLeft);
        socket.on("room-error", handleRoomError);

        socket.on(
            "candidate-tab-switch",
            handleCandidateTabSwitch
        );

        socket.on(
            "candidate-kicked",
            handleCandidateKicked
        );

        socket.on(
            "candidate-fullscreen-exit",
            handleCandidateFullscreenExit
        );

        return () => {
            socket.off("room-joined", handleRoomJoined);
            socket.off("user-joined", handleUserJoined);
            socket.off("user-left", handleUserLeft);
            socket.off("room-error", handleRoomError);

            socket.off(
                "candidate-tab-switch",
                handleCandidateTabSwitch
            );

            socket.off(
                "candidate-kicked",
                handleCandidateKicked
            );

            socket.off(
                "candidate-fullscreen-exit",
                handleCandidateFullscreenExit
            );
        };
    }, [socket, isInterviewer]);

    

    const kickCandidate = (candidateSocketId) => {
        if (!socket || !isInterviewer) return;

        socket.emit("kick-candidate", {
            candidateSocketId
        });
    };

    const joinInterview = async () => {
        if (!username.trim()) {
            return;
        }

        if (!connected) {
            return;
        }

        try {
            await startLocalStream();
            setJoined(true);
        } catch (error) {
            console.error("Media startup failed:", error);
        }
    };

    const runCode = async () => {
        if (!code.trim()) {
            setOutput("Please write some code first.");
            return;
        }

        setIsRunning(true);
        setOutput("Running...");

        try {
            const response = await fetch(`${API_URL}/api/run`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code: code,
                    language: language
                })
            });

            const data = await response.json();

            if (data.success) {
                setOutput(data.output);
            } else {
                setOutput(data.output || data.error || "Execution failed.");
            }

        } catch (error) {
            console.error("Run code error:", error);

            setOutput(
                "Unable to connect to the code execution server."
            );
        } finally {
            setIsRunning(false);
        }
    };

    const runTests = async () => {
        if (!code.trim()) {
            setOutput("Please write some code first.");
            return;
        }

        const testCases = currentProblem?.testCases || [];
        const functionName = currentProblem?.functionName;

        if (!testCases.length) {
            setOutput("No test cases are available for this problem.");
            return;
        }

        if (!functionName) {
            setOutput("Function name is missing for this problem.");
            return;
        }

        setIsTesting(true);
        setTestResults([]);
        setOutput("Running test cases...");

        try {
            /*
             * ================================
             * PYTHON TEST RUNNER
             * ================================
             */

            if (language === "python") {

                const pythonTestCases = JSON.stringify(testCases);
                console.log("MAX DEPTH TEST CASES:", testCases);
                const pythonCode = `
${code}

import json
import sys

test_cases = json.loads(${JSON.stringify(pythonTestCases)})
results = []


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def create_linked_list(values):
    if not values:
        return None

    head = ListNode(values[0])
    current = head

    for value in values[1:]:
        current.next = ListNode(value)
        current = current.next

    return head


def linked_list_to_array(head):
    result = []
    current = head

    while current:
        result.append(current.val)
        current = current.next

    return result


def create_binary_tree(values):
    if not values:
        return None

    if values[0] is None:
        return None

    root = TreeNode(values[0])
    queue = [root]
    index = 1

    while queue and index < len(values):

        current = queue.pop(0)

        if index < len(values) and values[index] is not None:
            current.left = TreeNode(values[index])
            queue.append(current.left)

        index += 1

        if index < len(values) and values[index] is not None:
            current.right = TreeNode(values[index])
            queue.append(current.right)

        index += 1

    return root


def tree_to_array(root):
    if root is None:
        return []

    result = []
    queue = [root]

    while queue:

        node = queue.pop(0)

        if node is None:
            result.append(None)
            continue

        result.append(node.val)

        queue.append(node.left)
        queue.append(node.right)

    while result and result[-1] is None:
        result.pop()

    return result


linked_list_functions = {
    "reverseList",
    "mergeTwoLists",
    "hasCycle"
}


tree_functions = {
    "maxDepth",
    "isSameTree",
    "invertTree"
}


for index, test in enumerate(test_cases):

    try:

        test_input = test.get("input")
        expected = test.get("expected")

        if "${functionName}" in linked_list_functions:

            head = create_linked_list(test_input)

            actual = ${functionName}(head)

            if "${functionName}" != "hasCycle":
                actual = linked_list_to_array(actual)
            else:
                actual = bool(actual)

        elif "${functionName}" in tree_functions:

            root = create_binary_tree(test_input)

            actual = ${functionName}(root)

            if "${functionName}" == "invertTree":
                actual = tree_to_array(actual)

        else:

            if isinstance(test_input, list):
                actual = ${functionName}(*test_input)
            else:
                actual = ${functionName}(test_input)

        passed = actual == expected

        results.append({
            "case": index + 1,
            "passed": passed,
            "expected": expected,
            "actual": actual
        })

    except Exception as error:

        results.append({
            "case": index + 1,
            "passed": False,
            "expected": test.get("expected"),
            "actual": str(error)
        })


print(json.dumps(results))
`;

                const response = await fetch(
                    "http://localhost:5000/api/run",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            code: pythonCode,
                            language: "python"
                        })
                    }
                );

                const data = await response.json();

                if (!data.success) {
                    setOutput(
                        data.output ||
                        data.error ||
                        "Python test execution failed."
                    );
                    return;
                }

                const rawOutput = data.output?.trim();

                if (!rawOutput) {
                    setOutput("No test result was returned.");
                    return;
                }

                const results = JSON.parse(rawOutput);

                setTestResults(results);

                const passed = results.filter(
                    (test) => test.passed
                ).length;

                setOutput(
                    `${passed} / ${results.length} test cases passed`
                );

                return;
            }


            /*
             * ================================
             * JAVASCRIPT TEST RUNNER
             * ================================
             */

            const LINKED_LIST_FUNCTIONS = new Set([
                "reverseList",
                "mergeTwoLists",
                "hasCycle"
            ]);

            const TREE_FUNCTIONS = new Set([
                "maxDepth",
                "isSameTree",
                "invertTree"
            ]);

            const isLinkedListProblem =
                LINKED_LIST_FUNCTIONS.has(functionName);

            const isTreeProblem =
                TREE_FUNCTIONS.has(functionName);

            const testCode = `
${code}

const testCases = ${JSON.stringify(testCases)};
const results = [];

class ListNode {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

function createLinkedList(values) {

    if (!values || values.length === 0) {
        return null;
    }

    const head = new ListNode(values[0]);
    let current = head;

    for (let i = 1; i < values.length; i++) {
        current.next = new ListNode(values[i]);
        current = current.next;
    }

    return head;
}

function linkedListToArray(head) {

    const result = [];
    let current = head;

    while (current !== null) {
        result.push(current.val);
        current = current.next;
    }

    return result;
}

function createBinaryTree(values) {

    if (!values || values.length === 0) {
        return null;
    }

    if (values[0] === null) {
        return null;
    }

    const root = new TreeNode(values[0]);
    const queue = [root];

    let index = 1;

    while (queue.length > 0 && index < values.length) {

        const current = queue.shift();

        if (
            index < values.length &&
            values[index] !== null
        ) {
            current.left = new TreeNode(values[index]);
            queue.push(current.left);
        }

        index++;

        if (
            index < values.length &&
            values[index] !== null
        ) {
            current.right = new TreeNode(values[index]);
            queue.push(current.right);
        }

        index++;
    }

    return root;
}

function treeToArray(root) {

    if (root === null) {
        return [];
    }

    const result = [];
    const queue = [root];

    while (queue.length > 0) {

        const node = queue.shift();

        if (node === null) {
            result.push(null);
            continue;
        }

        result.push(node.val);

        queue.push(node.left);
        queue.push(node.right);
    }

    while (
        result.length > 0 &&
        result[result.length - 1] === null
    ) {
        result.pop();
    }

    return result;
}

for (let i = 0; i < testCases.length; i++) {

    const test = testCases[i];

    try {

        let actual;

        if (${isLinkedListProblem}) {

            const head = createLinkedList(test.input);

            actual = ${functionName}(head);

            if ("${functionName}" !== "hasCycle") {
                actual = linkedListToArray(actual);
            } else {
                actual = Boolean(actual);
            }

        } else if (${isTreeProblem}) {

            const root = createBinaryTree(test.input);

            actual = ${functionName}(root);

            if ("${functionName}" === "invertTree") {
                actual = treeToArray(actual);
            }

        } else {

            actual = ${functionName}(...test.input);

        }

        const passed =
            JSON.stringify(actual) ===
            JSON.stringify(test.expected);

        results.push({
            case: i + 1,
            passed,
            expected: test.expected,
            actual
        });

    } catch (error) {

        results.push({
            case: i + 1,
            passed: false,
            expected: test.expected,
            actual: error.message
        });
    }
}

console.log(JSON.stringify(results));
`;

            const response = await fetch(
                "http://localhost:5000/api/run",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        code: testCode,
                        language: "javascript"
                    })
                }
            );

            const data = await response.json();

            if (!data.success) {
                setOutput(
                    data.output ||
                    data.error ||
                    "Test execution failed."
                );
                return;
            }

            const rawOutput = data.output?.trim();

            if (!rawOutput) {
                setOutput("No test result was returned.");
                return;
            }

            const results = JSON.parse(rawOutput);

            setTestResults(results);

            const passed = results.filter(
                (test) => test.passed
            ).length;

            setOutput(
                `${passed} / ${results.length} test cases passed`
            );

        } catch (error) {

            console.error("Test error:", error);

            setOutput(
                error.message ||
                "Unable to run test cases."
            );

        } finally {

            setIsTesting(false);
        }
    };

    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e) => {
            const editorArea = document.querySelector(".editor-workspace");

            if (!editorArea) return;

            const rect = editorArea.getBoundingClientRect();

            const newHeight = rect.bottom - e.clientY;

            setTerminalHeight(
                Math.min(
                    Math.max(newHeight, 120),
                    rect.height - 200
                )
            );
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    useEffect(() => {
        if (!currentProblem) return;

        setOutput("");
        setTestResults([]);

        // Restore saved code for this problem, or fall back to starterCode
        setCode(
            codeByProblem[currentProblem.id] ??
            currentProblem.starterCode ??
            ""
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProblemId]);

    // Name screen
    if (!joined) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">

                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
                </div>

                <div className="relative w-full max-w-md">

                    <div className="text-center mb-8">
                        <div className="text-2xl font-bold">
                            Dev<span className="text-blue-500">Room</span>
                        </div>

                        <p className="text-slate-500 text-sm mt-2">
                            Practice coding interviews
                        </p>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-black/20">

                        <div className="mb-7">
                            <p className="text-xs uppercase tracking-widest text-blue-400 mb-2">
                                Interview Room
                            </p>

                            <h1 className="text-2xl font-bold">
                                Join Interview
                            </h1>

                            <p className="text-slate-400 mt-2 text-sm">
                                Enter your name to join room{" "}
                                <span className="text-slate-200 font-medium">
                                    {roomCode}
                                </span>
                            </p>
                        </div>

                        <label className="block text-sm text-slate-300 mb-2">
                            Your name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    joinInterview();
                                }
                            }}
                            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition mb-4"
                        />

                        <button
                            onClick={joinInterview}
                            disabled={!connected}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 py-3 rounded-xl font-semibold transition"
                        >
                            {!connected ? "Connecting..." : "Join Interview"}
                        </button>

                        <div className="flex items-center justify-center gap-2 mt-5 text-xs text-slate-500">
                            <span
                                className={`w-2 h-2 rounded-full ${connected
                                    ? "bg-green-400"
                                    : "bg-yellow-400"
                                    }`}
                            />
                            {connected
                                ? "Server connected"
                                : "Connecting to server..."}
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    // Interview workspace
    return (
    <div className="h-screen bg-slate-950 text-white flex flex-col overflow-hidden">

        {showWarning && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">

                <div className="w-full max-w-md bg-slate-900 border border-yellow-500/30 rounded-2xl p-6 shadow-2xl">

                    <div className="text-center">

                        <div className="text-4xl mb-4">
                            ⚠️
                        </div>

                        <h2 className="text-xl font-semibold text-white">
                            Please stay on the interview page
                        </h2>

                        <p className="text-sm text-slate-400 mt-3">
                            Switching tabs or windows has been detected.
                        </p>

                        <div className="mt-4 text-yellow-400 text-sm">
                            Warning {warningCount}
                        </div>

                        <button
                            onClick={dismissWarning}
                            className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium"
                        >
                            Return to Interview
                        </button>

                    </div>

                </div>

            </div>
        )}

        {candidateTabWarning && isInterviewer && (
            <div className="fixed top-6 right-6 z-[9999] w-96">
                <div className="bg-slate-900 border border-yellow-500/40 rounded-xl shadow-2xl p-5">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">
                            ⚠️
                        </div>

                        <div className="flex-1">
                            <h3 className="font-semibold text-white">
                                Tab Switch Detected
                            </h3>

                            <p className="text-sm text-slate-400 mt-1">
                                {candidateTabWarningName} switched tabs.
                            </p>

                            <div className="mt-3 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                <p className="text-sm text-yellow-400">
                                    Tab switches:{" "}
                                    <span className="font-bold">
                                        {candidateTabWarningCount}
                                    </span>
                                </p>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() =>
                                        setCandidateTabWarning(false)
                                    }
                                    className="flex-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-white"
                                >
                                    Dismiss
                                </button>

                                <button
                                    onClick={() => {
                                        const candidate =
                                            participants.find(
                                                (user) =>
                                                    !user.isInterviewer &&
                                                    (
                                                        user.username ===
                                                        candidateTabWarningName
                                                    )
                                            );

                                        if (candidate) {
                                            kickCandidate(
                                                candidate.socketId
                                            );
                                        }

                                        setCandidateTabWarning(false);
                                    }}
                                    className="flex-1 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-sm text-white font-medium"
                                >
                                    Kick Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {showFullscreenWarning && !isInterviewer && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80">
                <div className="w-full max-w-md bg-slate-900 border border-yellow-500/30 rounded-2xl p-6 shadow-2xl mx-4">
                    <div className="text-center">
                        <div className="text-4xl mb-4">⚠️</div>

                        <h2 className="text-xl font-semibold text-white">
                            Fullscreen Exited
                        </h2>

                        <p className="text-sm text-slate-400 mt-3">
                            Please return to fullscreen mode and continue the interview.
                        </p>

                        <div className="mt-4 text-yellow-400 text-sm">
                            Fullscreen exits: {exitCount}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={enterFullscreen}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium"
                            >
                                Return to Fullscreen
                            </button>

                            <button
                                onClick={dismissFullscreenWarning}
                                className="px-4 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-lg text-sm"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {isInterviewer && fullscreenExitWarning && (
            <div className="fixed top-6 right-6 z-[9999] w-80">
                <div className="bg-slate-900 border border-orange-500/40 rounded-xl shadow-2xl p-4">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">🖥️</div>

                        <div className="flex-1">
                            <h3 className="font-semibold text-white">
                                Fullscreen Exit Detected
                            </h3>

                            <p className="text-sm text-slate-400 mt-1">
                                {fullscreenExitWarningName} exited fullscreen.
                            </p>

                            <p className="text-sm text-orange-400 mt-2">
                                Fullscreen exits: {fullscreenExitWarningCount}
                            </p>

                            <button
                                onClick={() =>
                                    setFullscreenExitWarning(false)
                                }
                                className="mt-3 text-sm text-blue-400 hover:text-blue-300"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {isInterviewer && participants.some((user) => !user.isInterviewer) && (
            <div className="fixed bottom-6 right-6 z-[9998] w-80">
                <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">
                            Candidate Monitoring
                        </h3>

                        <span className="text-xs text-green-400">
                            Live
                        </span>
                    </div>

                    {participants
                        .filter((user) => !user.isInterviewer)
                        .map((candidate) => (
                            <div
                                key={candidate.socketId}
                                className="border-t border-slate-800 pt-3 mt-3"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white">
                                        {candidate.username}
                                    </span>

                                    <span className="text-xs text-green-400">
                                        Candidate
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-3">
                                    <div className="bg-slate-800 rounded-lg p-2">
                                        <p className="text-xs text-slate-400">
                                            Tab switches
                                        </p>
                                        <p className="text-lg font-semibold text-yellow-400">
                                            {candidate.tabSwitchCount || 0}
                                        </p>
                                    </div>

                                    <div className="bg-slate-800 rounded-lg p-2">
                                        <p className="text-xs text-slate-400">
                                            Fullscreen exits
                                        </p>
                                        <p className="text-lg font-semibold text-orange-400">
                                            {candidate.fullscreenExitCount || 0}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() =>
                                        kickCandidate(candidate.socketId)
                                    }
                                    className="w-full mt-3 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium"
                                >
                                    Kick Out
                                </button>
                            </div>
                        ))}
                </div>
            </div>
        )}

        {/* HEADER */}

            {/* HEADER */}
            <header className="h-16 shrink-0 border-b border-slate-800 bg-slate-950 px-5 lg:px-6 flex items-center justify-between">

                <div className="flex items-center gap-5 min-w-0">

                    <div className="font-bold text-xl shrink-0">
                        Dev<span className="text-blue-500">Room</span>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-sm min-w-0">
                        <span className="text-slate-600">/</span>
                        <span className="text-slate-500">
                            Interview Room
                        </span>
                        <span className="text-slate-700">/</span>
                        <span className="text-slate-300 font-medium">
                            {roomCode}
                        </span>
                    </div>

                </div>

                <div className="flex items-center gap-4 shrink-0">

                    <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
                        <span>
                            {participants.length} participant
                            {participants.length === 1 ? "" : "s"}
                        </span>
                    </div>

                    <div className="h-6 w-px bg-slate-800 hidden md:block" />

                    <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-green-400">
                            Live
                        </span>
                    </div>

                    <div className="h-7 w-px bg-slate-800" />

                    <div className="flex items-center gap-2">

                        <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sm font-semibold text-blue-300">
                            {username?.charAt(0)?.toUpperCase()}
                        </div>

                        <span className="hidden sm:block text-sm text-slate-300">
                            {username}
                        </span>

                    </div>

                </div>

            </header>


            {/* MAIN WORKSPACE */}
            <main className="flex-1 min-h-0 flex">


                {/* LEFT — PROBLEM */}
                <aside className="w-72 lg:w-80 shrink-0 border-r border-slate-800 bg-slate-900/70 flex flex-col min-h-0">

                    <div className="px-5 py-4 border-b border-slate-800 shrink-0">

                        <div className="flex items-start justify-between gap-3">

                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium shrink-0 ${currentProblem?.difficulty === "Easy"
                                ? "bg-green-500/10 border border-green-500/10 text-green-400"
                                : currentProblem?.difficulty === "Medium"
                                    ? "bg-yellow-500/10 border border-yellow-500/10 text-yellow-400"
                                    : "bg-red-500/10 border border-red-500/10 text-red-400"
                                }`}>
                                {currentProblem?.difficulty ?? "Easy"}
                            </span>

                        </div>

                    </div>


                    <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">

                        <div className="h-full flex flex-col min-h-0">

                            {/* PROBLEM SELECTOR */}

                            <div className="shrink-0 p-3 border-b border-slate-800 bg-slate-950">

                                <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2">
                                    Select Problem
                                </label>

                                <select
                                    value={selectedProblemId}
                                    onChange={(event) =>
                                        setSelectedProblemId(Number(event.target.value))
                                    }
                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-blue-500"
                                >
                                    {problems.map((problem) => (
                                        <option
                                            key={problem.id}
                                            value={problem.id}
                                        >
                                            {problem.title} — {problem.difficulty}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            {/* PROBLEM CONTENT */}

                            <div className="flex-1 min-h-0 overflow-y-auto problem-scrollbar">
                                <ProblemPanel
                                    problem={currentProblem}
                                />
                            </div>

                        </div>

                        {/* PARTICIPANTS */}
                        <div className="mt-8">

                            <div className="flex items-center justify-between mb-3">

                                <h3 className="text-sm font-semibold">
                                    Participants
                                </h3>

                                <span className="text-xs text-slate-500">
                                    {participants.length} online
                                </span>

                            </div>

                            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3">

                                {participants.length === 0 ? (

                                    <p className="text-sm text-slate-500">
                                        Waiting for participants...
                                    </p>

                                ) : (

                                    <div className="space-y-3">

                                        {participants.map((user) => (

                                            <div
                                                key={user.socketId}
                                                className="flex items-center gap-3"
                                            >

                                                <div className="relative shrink-0">

                                                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300">
                                                        {user.username
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-slate-950" />

                                                </div>

                                                <div className="min-w-0">

                                                    <p className="text-sm text-slate-200 truncate">
                                                        {user.username}
                                                    </p>

                                                    <p className="text-[11px] text-green-400">
                                                        Online
                                                    </p>

                                                </div>

                                            </div>

                                        ))}

                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </aside>


                {/* CENTER — EDITOR */}
                <section className="editor-workspace flex-1 min-w-0 flex flex-col bg-slate-950">

                    {/* EDITOR TOOLBAR */}
                    <EditorToolbar
                        language={language}
                        setLanguage={setLanguage}
                    />

                    {/* CODE EDITOR */}
                    <div className="flex-1 min-h-0">
                        <MonacoEditor
                            code={code}
                            setCode={updateCode}
                            language={language}
                        />
                    </div>

                    {/* RESIZE HANDLE */}
                    <div
                        onMouseDown={() => setIsResizing(true)}
                        className="h-1 shrink-0 cursor-row-resize bg-slate-800 hover:bg-blue-500 transition-colors relative group"
                    >
                        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-10 h-2 rounded-full bg-slate-600 group-hover:bg-blue-400 transition-colors" />
                    </div>

                    {/* OUTPUT TERMINAL */}
                    <div
                        className="shrink-0 border-t border-slate-800 bg-[#080b12] flex flex-col"
                        style={{ height: `${terminalHeight}px` }}
                    >
                        {/* TERMINAL HEADER */}
                        <div className="h-11 shrink-0 border-b border-slate-800 bg-slate-900/80 px-4 flex items-center justify-between">

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                </div>

                                <div className="h-4 w-px bg-slate-700" />

                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400 text-sm">▸</span>
                                    <span className="text-xs font-semibold text-slate-300">
                                        Terminal
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {output && !isRunning && (
                                    <span className="flex items-center gap-1.5 text-[10px] text-green-400 mr-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                        Finished
                                    </span>
                                )}

                                {isRunning && (
                                    <span className="flex items-center gap-1.5 text-[10px] text-yellow-400 mr-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                                        Running
                                    </span>
                                )}

                                <button
                                    onClick={() => { setOutput(""); setTestResults([]); }}
                                    disabled={!output || isRunning}
                                    className="px-2.5 py-1.5 rounded-md text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition"
                                >
                                    Clear
                                </button>

                                <button
                                    onClick={runTests}
                                    disabled={isTesting || isRunning}
                                    className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-semibold transition"
                                >
                                    {isTesting ? "Testing..." : "Run Tests"}
                                </button>

                                <button
                                    onClick={runCode}
                                    disabled={isRunning || isTesting}
                                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-semibold transition"
                                >
                                    {isRunning ? (
                                        <>
                                            <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            Running
                                        </>
                                    ) : (
                                        <>
                                            <span>▶</span>
                                            Run Code
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* TERMINAL BODY */}
                        <div className="flex-1 min-h-0 overflow-auto p-4 font-mono text-xs custom-scrollbar">

                            {!output && !isRunning ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mb-2">
                                        &gt;_
                                    </div>

                                    <p className="text-slate-500">
                                        No output yet
                                    </p>

                                    <p className="text-slate-700 text-[10px] mt-1">
                                        Click "Run Code" to execute your program
                                    </p>
                                </div>
                            ) : isRunning ? (
                                <div className="flex items-center gap-2 text-yellow-400">
                                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                                    <span>Executing program...</span>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                                        <span>$</span>
                                        <span>node program.js</span>
                                    </div>

                                    <pre className="whitespace-pre-wrap text-slate-300 leading-6">
                                        {output}
                                    </pre>
                                </div>
                            )}

                        </div>
                    </div>

                </section>

                {/* RIGHT — AI */}
                {/* RIGHT — AI PANEL */}

                <aside className="w-80 xl:w-96 shrink-0 border-l border-slate-800 bg-slate-950 flex flex-col min-h-0 overflow-hidden">
                    <MediaPanel
                        localVideoRef={localVideoRef}
                        localStream={localStream}
                        remoteStreams={remoteStreams}
                        cameraOn={cameraOn}
                        micOn={micOn}
                        toggleCamera={toggleCamera}
                        toggleMic={toggleMic}
                    />
                    {/* AI NAVBAR */}

                    <div className="shrink-0 border-b border-slate-800 bg-slate-950 p-2">

                        <div className="flex items-center gap-1 bg-slate-900 rounded-xl p-1">

                            {/* CO-PILOT TAB */}

                            <button
                                onClick={() => setActiveAIPanel("copilot")}
                                className={`
                    flex-1 flex items-center justify-center gap-2
                    px-3 py-2.5 rounded-lg text-xs font-medium
                    transition-all duration-200
                    ${activeAIPanel === "copilot"
                                        ? "bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-sm"
                                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/70 border border-transparent"
                                    }
                `}
                            >
                                <span className="text-sm">✦</span>

                                <span>
                                    AI Co-pilot
                                </span>
                            </button>


                            {/* INTERVIEWER TAB */}

                            <button
                                onClick={() => setActiveAIPanel("interviewer")}
                                className={`
                    flex-1 flex items-center justify-center gap-2
                    px-3 py-2.5 rounded-lg text-xs font-medium
                    transition-all duration-200
                    ${activeAIPanel === "interviewer"
                                        ? "bg-purple-600/15 text-purple-400 border border-purple-500/20 shadow-sm"
                                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/70 border border-transparent"
                                    }
                `}
                            >
                                <span className="text-sm">🤖</span>

                                <span>
                                    Interviewer
                                </span>
                            </button>

                        </div>

                    </div>


                    {/* ACTIVE PANEL */}

                    <div className="flex-1 min-h-0 overflow-hidden">


                        {/* ================= CO-PILOT ================= */}

                        {activeAIPanel === "copilot" && (

                            <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">

                                {/* HEADER */}

                                <div className="px-5 py-5 border-b border-slate-800 shrink-0">

                                    <div className="flex items-center justify-between">

                                        <div className="flex items-center gap-3">

                                            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                                ✦
                                            </div>

                                            <div>

                                                <h2 className="text-sm font-semibold text-white">
                                                    AI Co-pilot
                                                </h2>

                                                <p className="text-[10px] text-slate-500 mt-0.5">
                                                    Get a hint when you're stuck
                                                </p>

                                            </div>

                                        </div>

                                        <span className="text-[10px] text-slate-500">
                                            {aiRequestsUsed}/{AI_LIMIT}
                                        </span>

                                    </div>

                                </div>


                                {/* REQUEST COUNTER */}

                                <div className="px-5 pt-4">

                                    <div className="flex items-center justify-between mb-2">

                                        <span className="text-[9px] uppercase tracking-widest text-slate-500">
                                            AI Requests
                                        </span>

                                        <span className="text-[9px] text-slate-600">
                                            Development limit
                                        </span>

                                    </div>

                                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">

                                        <div
                                            className="h-full bg-blue-500 transition-all duration-300"
                                            style={{
                                                width: `${Math.min(
                                                    (aiRequestsUsed / AI_LIMIT) * 100,
                                                    100
                                                )}%`
                                            }}
                                        />

                                    </div>

                                </div>


                                {/* HINT CARD */}

                                <div className="p-5">

                                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-4">

                                        <div className="flex items-center gap-2 mb-3">

                                            <span className="text-lg">
                                                💡
                                            </span>

                                            <span className="text-xs font-semibold text-blue-400">
                                                HINT
                                            </span>

                                        </div>

                                        <p className="text-xs leading-5 text-slate-400 mb-4">
                                            Stuck? Ask the AI for a hint. It will guide
                                            you without giving the complete solution.
                                        </p>

                                        <button
                                            onClick={getHint}
                                            disabled={
                                                hintLoading ||
                                                aiRequestsUsed >= AI_LIMIT
                                            }
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-semibold transition"
                                        >

                                            {hintLoading ? (
                                                <>
                                                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                    Thinking...
                                                </>
                                            ) : (
                                                <>
                                                    💡
                                                    Get Hint
                                                </>
                                            )}

                                        </button>

                                        <p className="text-center text-[9px] text-slate-600 mt-3">
                                            One AI request is used per hint
                                        </p>

                                    </div>

                                </div>


                                {/* CURRENT OBSERVATION */}

                                <div className="px-5">

                                    <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">

                                        <div className="flex items-center justify-between mb-3">

                                            <span className="text-[9px] uppercase tracking-widest text-slate-500">
                                                Latest Hint
                                            </span>

                                            <span className="text-[9px] text-slate-600">
                                                {copilotStatus}
                                            </span>

                                        </div>

                                        <p className="text-xs text-slate-300 leading-5">
                                            {copilotObservation}
                                        </p>

                                    </div>

                                </div>


                                {/* HISTORY */}

                                <div className="mt-5 border-t border-slate-800">

                                    <div className="px-5 py-3 flex items-center justify-between">

                                        <span className="text-[10px] font-medium text-slate-400">
                                            Hint History
                                        </span>

                                        <span className="text-[9px] text-slate-600">
                                            {copilotHistory.length}
                                        </span>

                                    </div>

                                    {copilotHistory.length === 0 ? (

                                        <p className="px-5 py-8 text-center text-[10px] text-slate-600">
                                            No hints requested yet.
                                        </p>

                                    ) : (

                                        <div className="px-5 pb-5 space-y-2">

                                            {copilotHistory.map((item) => (

                                                <div
                                                    key={item.id}
                                                    className="rounded-lg bg-slate-900 border border-slate-800 p-3"
                                                >

                                                    <p className="text-[10px] text-slate-400 leading-5">
                                                        {item.observation}
                                                    </p>

                                                    <p className="text-[9px] text-slate-700 mt-2">
                                                        {item.time}
                                                    </p>

                                                </div>

                                            ))}

                                        </div>

                                    )}

                                </div>

                            </div>

                        )}


                        {/* ================= AI INTERVIEWER ================= */}

                        {activeAIPanel === "interviewer" && (

                            <div className="h-full flex flex-col min-h-0">




                                <div className="flex-1 min-h-0 overflow-hidden">

                                    <ChatPanel
                                        socket={socket}
                                        roomCode={roomCode}
                                        username={username}
                                        problem={currentProblem}
                                        code={code}
                                    />

                                </div>

                            </div>

                        )}

                    </div>

                </aside>

            </main>

        </div>
    );
}

export default Room;
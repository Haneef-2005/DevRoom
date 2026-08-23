DevRoom 🚀

A real-time, AI-powered coding interview platform that simulates a collaborative technical interview environment.

DevRoom brings together a live code editor, coding problems, code execution, video communication, candidate monitoring, and an AI coding co-pilot — all in one interview room.

🌐 Live Demo
Service	URL
Frontend	devroom-client.onrender.com
Backend	devroom-sxad.onrender.com

<br/>

🏠 Home — Create or Join a Room

<img src="./screenshots/home.png" alt="DevRoom Home Page" width="100%"/> <br/>

💻 Interview Room — Code Editor with AI Co-Pilot

<img src="./screenshots/interview-room.png" alt="Interview Room with AI Co-Pilot" width="100%"/> <br/>

🎥 Live Session — Candidate Monitoring & Video

<img src="./screenshots/live-session.png" alt="Live Interview Session with Candidate Monitoring" width="100%"/>
✨ Features
💻 Real-Time Code Editor
Monaco Editor-based coding environment
JavaScript and Python support
Collaborative coding
Code execution with terminal output
Predefined test-case execution
👥 Interview Rooms
Create and join rooms using a room code
Real-time participant synchronization
Interviewer and candidate roles
Live room status
🎥 Video Interview
Camera and microphone support
WebRTC-based peer-to-peer communication
Candidate and interviewer video panels
🤖 AI Coding Co-Pilot
AI-generated coding hints
Short observations about candidate code
Bug and edge-case detection
Efficiency and reasoning suggestions
Designed to guide candidates without revealing the complete solution
Powered by Google Gemini
🚨 Candidate Monitoring
Tab-switch detection
Fullscreen-exit detection
Candidate activity monitoring
Interviewer can remove a candidate
🧩 Coding Problems
Problem selection with difficulty labels
Problem descriptions with examples and constraints
Test-case execution
🛠️ Tech Stack
Layer	Technologies
Frontend	React.js, Vite, Tailwind CSS
Code Editor	Monaco Editor
Backend	Node.js, Express.js
Real-Time	Socket.IO, WebRTC
AI Service	Python, FastAPI, Google Gemini
Code Execution	Node.js, Python
Deployment	Render
Version Control	Git, GitHub
📁 Project Structure
DevRoom/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Editor/
│   │   │   └── Room/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── pages/
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── routes/
│   ├── socket/
│   ├── src/
│   └── package.json
│
├── ai-service/
│   ├── main.py
│   └── requirements.txt
│
└── README.md
⚙️ Environment Variables
Frontend — client/.env
env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_AI_URL=http://localhost:8000

For production, replace these with your deployed service URLs.

AI Service — ai-service/.env
env
GEMINI_API_KEY=your_gemini_api_key

⚠️ Never commit .env files or API keys to GitHub.

🚀 Local Setup
1. Clone the Repository
bash
git clone https://github.com/Haneef-2005/DevRoom.git
cd DevRoom
2. Start the Frontend
bash
cd client
npm install
npm run dev

If Socket.IO is missing: npm install socket.io-client

The frontend runs at http://localhost:5173

3. Start the Backend

Open a new terminal:

bash
cd server
npm install
npm start

The backend runs at http://localhost:5000

4. Start the AI Service

Open another terminal:

bash
cd ai-service
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (macOS/Linux)
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000

The AI service runs at http://localhost:8000

🔌 API Reference
Backend
Method	Endpoint	Description
GET	/	Health check
POST	/api/rooms/create	Create a new interview room
POST	/api/run	Execute submitted code
AI Service
Method	Endpoint	Description
GET	/	Health check
POST	/review	Get AI co-pilot feedback
/review — Request Body
json
{
  "problem": "Problem title and description",
  "code": "Candidate's current code"
}

Returns an AI observation about the candidate's code.

🌐 Deployment

The project is deployed as three separate services on Render:

Frontend → https://devroom-client.onrender.com
Node.js Backend → https://devroom-sxad.onrender.com
AI Service → deployed separately on Render

Production frontend environment variables must point to the corresponding deployed URLs.

🔐 CORS

Each production service must explicitly allow the deployed frontend origin:

https://devroom-client.onrender.com

When a service URL changes, update the CORS config and redeploy that service.

🧪 Testing

Try the following JavaScript solution in the editor to verify code execution:

javascript
function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }

  return [];
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6));      // [1, 2]
console.log(twoSum([3, 3], 6));         // [0, 1]

Expected Output:

[0, 1]
[1, 2]
[0, 1]
🤖 AI Co-Pilot Behavior

The AI co-pilot acts as an interview assistant, not a solution generator. It provides:

🐛 Bug observations
⚠️ Edge-case hints
⚡ Efficiency suggestions
🧠 Reasoning corrections
💡 Short coding hints

It is intentionally designed to guide the candidate's thinking rather than provide complete answers.

📌 Roadmap
 User authentication and profiles
 Interview scheduling
 Interview history and playback
 More programming language support
 Advanced code execution sandboxing
 AI interview scoring and reports
 Persistent problem and test-case management
 Improved WebRTC handling
👨‍💻 Author

Shaik Mohammad Haneef - AI & Machine Learning Student — NRI Institute of Technology

📄 License

This project is intended for educational and project-development purposes.

import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai

load_dotenv()

app = FastAPI(
    title="DevRoom AI Service",
    description="AI service for DevRoom",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY is missing from .env")

client = genai.Client(api_key=api_key)


class InterviewRequest(BaseModel):
    message: str
    problem: str
    code: str
class ReviewRequest(BaseModel):
    problem: str
    code: str

@app.get("/")
def root():
    return {
        "message": "DevRoom AI Service is running"
    }


@app.post("/review")
def review(request: ReviewRequest):

    prompt = f"""
You are an AI coding interview co-pilot.

The candidate is currently solving:

{request.problem}

Here is their current code:

{request.code}

Review the code as an interviewer observing the candidate.

Give ONE short observation about:
- a bug
- an edge case
- inefficient logic
- incorrect reasoning
- or a useful hint

Do not give the complete solution.

If the code is currently incomplete, give a helpful hint instead.

Keep the response under 2 sentences.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return {
            "observation": response.text
        }

    except Exception as error:
        print("GEMINI REVIEW ERROR:", repr(error))

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
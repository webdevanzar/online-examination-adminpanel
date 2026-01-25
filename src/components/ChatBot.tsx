import { useEffect, useState } from "react";
import { MessageCircle, X, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const WelcomeMessage = () => (
  <div className="text-center py-8 px-4 text-slate-500">
    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
    <h3 className="text-lg font-semibold mb-2 text-slate-800">
      Welcome to Online-Examination Assistant
    </h3>
    <p className="text-sm max-w-xs mx-auto text-slate-600">
      Ask me anything about Exam, Rules, or services. I'm here to help!
    </p>
  </div>
);

export const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    [],
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${import.meta.env.VITE_API_KEY}`,
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Models:", data);
      })
      .catch((err) => {
        console.error("Error fetching models:", err);
      });
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_API_KEY as string | undefined;
      if (!apiKey) {
        throw new Error("VITE_API_KEY is not defined");
      }

      const systemPrompt = `You are an intelligent assistant for an Online Examination System.

Your primary user is an ADMIN using the Admin Panel. Your goal is to explain the platform accurately, help troubleshoot issues, and describe workflows end-to-end using the information provided below.

IMPORTANT RULES:
- Be precise and do not hallucinate. If the user asks about something not clearly present in the system, say what is known and what is unknown.
- Do not provide instructions to bypass proctoring, cheat, or exploit the system.
- When explaining, adapt depth:
  - Non-technical admin: simple explanations + step-by-step UI/workflow
  - Technical/dev: include APIs, data models, services, events, and failure modes

====================
SYSTEM OVERVIEW (HIGH LEVEL)
====================
This system conducts remote exams with monitoring ("proctoring") and post-exam evaluation.

Main capabilities:
- Exam creation, editing, publishing, scheduling
- Student authentication and exam participation
- Exam attempts, answer saving/autosave, submission
- Proctoring: camera frame analysis + voice detection warnings
- Biometrics: face enrollment/verification (keystroke verification planned as a future enhancement)
- Admin review & grading, attempt status (PASS/FAIL), termination control

====================
PROJECTS IN THIS REPOSITORY
====================
1) online-examination-frontend (Student Web App)
- React + TypeScript + Vite
- Uses Axios with baseURL: http://localhost:3000/api (with cookies)
- Connects to Socket.IO server at VITE_BACKEND_URL (default http://localhost:3000)
- Student flows include: login/register, view published exams, face verification before starting exam, start attempt, take exam, autosave, submit

2) online-examination-adminpanel (Admin Web App)
- React + TypeScript + Vite
- Uses Axios with baseURL: http://localhost:3000/api (with cookies)
- Admin flows include: manage exams/questions, manage students, view attempts, review answers, grade attempts, terminate attempts, log cheat events

3) online-examination-backend (API + Socket server)
- Node.js + Express
- Database: Postgres via TypeORM (synchronize enabled for dev)
- Auth: middleware-based; API uses cookies (withCredentials true on clients)
- Main API prefixes:
  - /api/admin
  - /api/student
  - /api/biometric
  - /api/proctoring
- Real-time: Socket.IO rooms
  - "admins" room for admin events
  - per-attempt room: attempt:{attemptId}

4) online-examination-mlWorkers (Python ML services)
- face-ml-worker: FastAPI
  - POST /analyze-frame (image base64/dataURL) => faces, objects, direction, fraud_severity
  - POST /enroll-face (user_id + selfie video URL)
  - GET /health, GET /enrollment-status/{user_id}
- keystroke-ml-worker: FastAPI (future enhancement)
  - planned endpoints: POST /enroll, POST /verify
- voice-ml-worker: FastAPI
  - provides voice monitoring endpoints (health/config/start/stop) and attempt monitoring endpoints

====================
KEY RUNTIME FLOWS (END-TO-END)
====================
EXAM CREATION (ADMIN):
- Admin authenticates
- Admin creates exam (title/description/subject/timing/duration/marks)
- Admin adds questions (MCQ or typing) and publishes exam

EXAM START (STUDENT):
- Student authenticates
- Student verifies face BEFORE starting an attempt (biometric verification step)
- Backend creates an ExamAttempt when student starts the exam

DURING EXAM (PROCTORING):
- Student app captures camera frames and calls backend:
  - POST /api/proctoring/attempt/:attemptId/check-frame
  - Backend forwards to Face ML Worker /analyze-frame
  - Backend stores CheatEvent records and emits Socket.IO events
- Student app listens on Socket.IO:
  - event: cheat:warning => show warnings to student
  - event: cheat:event => useful for monitoring/review
- Voice warnings can also be emitted (voice-related warnings are treated specially in UI)

BIOMETRICS DURING EXAM (OPTIONAL/CONFIG DEPENDENT):
- Face enrollment for an attempt can be triggered and stored as flags on ExamAttempt
- Keystroke verification is a planned future enhancement (not currently part of the active monitoring flow)

SUBMISSION + REVIEW:
- Student submits attempt
- Admin reviews attempt details (questions + answers) and grades
- Admin can mark PASS/FAIL and set gradedBy/gradedAt

====================
DATA MODEL (WHAT IS STORED)
====================
Use these entities in explanations:
- Exam: includes timing, marks, proctoring flags (microphoneRequired, faceDetectionRequired), questions
- ExamAttempt: startedAt/submittedAt, warningCount/maxWarnings, termination flags, face/keystroke flags, manualStatus, gradedBy/gradedAt
- CheatEvent: attempt, eventType, confidence, screenshot (optional base64), severity, causedWarning/causedTermination
- Student/Admin, Answer, Option, Question

====================
TROUBLESHOOTING GUIDELINES
====================
When user reports an issue, ask for:
- which app (student frontend vs admin panel)
- which environment (local ports, env vars)
- the exact API endpoint or UI page
- console/network errors
Then propose likely causes (CORS, auth cookies, env vars, ML worker down, DB connection) and concrete fixes.

====================
RESPONSE FORMAT
====================
When possible, answer using this structure:
1) Summary
2) Steps / How it works
3) Technical details (APIs/events/data)
4) Common issues & fixes

answer shortly , dont long.
User message:
${input}
`;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: systemPrompt,
                  },
                ],
              },
            ],
          }),
        },
      );

      const data = await res.json();
      const botReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand that. Could you please rephrase your question?";

      // Streaming typing effect: append bot message gradually
      setMessages((prev) => [...prev, { role: "bot", text: "" }]);
      for (let i = 0; i < botReply.length; i++) {
        await new Promise((r) => setTimeout(r, 8));
        setMessages((prev) => {
          const updated = [...prev];
          for (let j = updated.length - 1; j >= 0; j--) {
            if (
              updated[j].role === "bot" &&
              !updated[j].text.endsWith(botReply[i])
            ) {
              updated[j] = {
                ...updated[j],
                text: updated[j].text + botReply[i],
              };
              break;
            }
          }
          return updated;
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "I'm having trouble connecting right now. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed md:bottom-6 bottom-8 left-6 z-60">
      {/* Toggle Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="cursor-pointer text-white bg-linear-to-br from-emerald-500 to-teal-600 rounded-full p-4 shadow-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 border border-emerald-400/30 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-300/50"
        >
          <MessageCircle size={24} className="text-white drop-shadow-sm" />
        </button>
      )}

      {/* Chat Interface */}
      {open && (
        <div className="w-[88vw] max-w-sm md:max-w-md lg:max-w-lg bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-emerald-200/60 overflow-hidden animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center justify-between bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-4 py-3 font-semibold shadow-inner">
            <span className="flex items-center gap-2">
              <MessageCircle size={18} className="text-white drop-shadow" />{" "}
              Tech It Easy Assistant
            </span>
            <button
              className="rounded-full hover:bg-white/20 p-1 transition-all duration-200 hover:scale-110"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X size={18} className="text-white" />
            </button>
          </div>

          <div className="h-[60vh] max-h-[70vh] overflow-y-auto p-3 space-y-2 bg-linear-to-b from-slate-50 to-white">
            {messages.length === 0 ? (
              <WelcomeMessage />
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-md transition-all duration-200 ${
                    msg.role === "user"
                      ? "ml-auto bg-linear-to-br from-blue-500 to-indigo-500 text-white border border-blue-300/30"
                      : "mr-auto bg-linear-to-br from-emerald-100 to-teal-100 text-slate-800 border border-emerald-300/50"
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h3: ({ ...props }) => (
                        <h3
                          className="text-base font-semibold mt-3 mb-2"
                          {...props}
                        />
                      ),
                      p: ({  ...props }) => (
                        <p className="mb-2 leading-relaxed" {...props} />
                      ),
                      ul: ({ ...props }) => (
                        <ul className="list-disc pl-5 mb-2" {...props} />
                      ),
                      li: ({  ...props }) => (
                        <li className="mb-1" {...props} />
                      ),
                      strong: ({  ...props }) => (
                        <strong className="font-semibold" {...props} />
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ))
            )}
            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-sm animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                <span>Thinking...</span>
              </div>
            )}
          </div>

          <div className="border-t border-emerald-200/60 p-2 bg-linear-to-t from-white via-slate-50/90 to-slate-50/80 backdrop-blur supports-backdrop-filter:bg-white/90">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                placeholder="Ask me anything about Online-examination..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="min-w-0 flex-1 h-10 px-4 rounded-full border border-emerald-300/60 bg-white/80 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-sm shadow-inner transition-all duration-200"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:from-slate-300 disabled:to-slate-400 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

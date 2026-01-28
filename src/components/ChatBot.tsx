import { useEffect, useState } from "react";
import { MessageCircle, X, Loader2, SendHorizontal } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const WelcomeMessage = () => (
  <div className="text-center py-10 px-6 text-slate-500">
    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner ring-1 ring-emerald-100">
      <MessageCircle className="w-8 h-8 text-emerald-500" />
    </div>
    <h3 className="text-xl font-black mb-2 text-slate-900 tracking-tight">
      ExamHub Assistant
    </h3>
    <p className="text-sm max-w-[200px] mx-auto text-slate-500 font-medium leading-relaxed">
      Smart assistance for exam management and troubleshooting.
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
- Biometrics: face enrollment/verification
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
- Admin flows include: manage exams/questions, manage students, view attempts, review answers, grade attempts, terminate attempts, log cheat events

3) online-examination-backend (API + Socket server)
- Database: Postgres via TypeORM
- Auth: middleware-based; API uses cookies (withCredentials true on clients)

4) online-examination-mlWorkers (Python ML services)
- face-ml-worker: FastAPI (/analyze-frame, /enroll-face)
- voice-ml-worker: FastAPI

====================
TROUBLESHOOTING GUIDELINES
====================
When user reports an issue, ask for:
- which app (student frontend vs admin panel)
- the environment/logs
- console/network errors
Then propose likely causes (CORS, auth cookies, env vars, ML worker down, DB connection) and concrete fixes.

RESPONSE FORMAT: Concise summary + technical details.
User message: ${input}`;

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
    <div className="fixed md:bottom-8 bottom-10 right-8 z-60">
      {/* Toggle Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="cursor-pointer text-white bg-linear-to-tr from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 border border-blue-400/30 hover:scale-110 active:scale-95 group"
        >
          <MessageCircle
            size={24}
            className="group-hover:rotate-12 transition-transform duration-300"
          />
        </button>
      )}

      {/* Chat Interface */}
      {open && (
        <div className="w-[90vw] max-w-[400px] bg-white/95 backdrop-blur-xl rounded-4xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <MessageCircle size={18} />
              </div>
              <span className="font-black tracking-tight text-sm uppercase">
                Assistant
              </span>
            </div>
            <button
              className="rounded-xl hover:bg-white/10 p-2 transition-all duration-200"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="h-[450px] overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/30">
            {messages.length === 0 ? (
              <WelcomeMessage />
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 rounded-tr-none"
                        : "bg-white text-slate-700 border border-slate-100 shadow-sm rounded-tl-none font-medium"
                    }`}
                  >
                    <div className="prose prose-sm prose-slate prose-p:leading-relaxed prose-headings:font-black">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h3: ({ ...props }) => (
                            <h3
                              className="text-sm font-black mb-1 mt-2"
                              {...props}
                            />
                          ),
                          p: ({ ...props }) => (
                            <p className="mb-2 last:mb-0" {...props} />
                          ),
                          ul: ({ ...props }) => (
                            <ul className="list-disc pl-4 mb-2" {...props} />
                          ),
                          li: ({ ...props }) => (
                            <li className="mb-0.5" {...props} />
                          ),
                          strong: ({ ...props }) => (
                            <strong className="font-black" {...props} />
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest pl-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span>Thinking</span>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="relative flex items-center gap-3">
              <input
                type="text"
                value={input}
                placeholder="Type your message..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="w-full h-12 pl-5 pr-14 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-sm"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="absolute right-1 text-white bg-blue-600 p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-30 transition-all duration-200 shadow-sm"
              >
                <SendHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

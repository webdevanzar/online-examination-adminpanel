import { useEffect, useRef, useState } from "react";
import { X, Loader2, SendHorizontal, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const WelcomeMessage = () => (
  <div className="text-center py-10 px-6 text-slate-500">
    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner ring-1 ring-blue-100">
      <Sparkles className="w-8 h-8 text-blue-500" />
    </div>
    <h3 className="text-xl font-black mb-2 text-slate-900 tracking-tight">
      ExamHub Assistant
    </h3>
    <p className="text-sm max-w-[240px] mx-auto text-slate-500 font-medium leading-relaxed">
      Smart assistance for exam management and troubleshooting.
    </p>
    <div className="mt-6 flex flex-wrap gap-2 justify-center">
      {[
        "How do I create an exam?",
        "Manage students",
        "View results",
        "Troubleshoot issues",
      ].map((hint) => (
        <span
          key={hint}
          className="text-xs bg-blue-50 text-blue-600 border border-blue-100 rounded-full px-3 py-1 font-medium cursor-default"
        >
          {hint}
        </span>
      ))}
    </div>
  </div>
);

interface ChatBotModalProps {
  open: boolean;
  onClose: () => void;
}

export const ChatBotModal = ({ open, onClose }: ChatBotModalProps) => {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    [],
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  useEffect(() => {
    fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${import.meta.env.VITE_API_KEY}`,
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => console.log("Models:", data))
      .catch((err) => console.error("Error fetching models:", err));
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_API_KEY as string | undefined;
      if (!apiKey) throw new Error("VITE_API_KEY is not defined");

      const systemPrompt = `You are an intelligent assistant for an Online Examination System.

Your primary user is an ADMIN using the Admin Panel. Admins are non-technical users.
Your goal is to provide simple, easy-to-understand, step-by-step UI navigation instructions for managing the system. Do NOT provide technical information, mention APIs, code, databases, or developer tools.

IMPORTANT RULES:
- Keep responses simple, friendly, and non-technical.
- If an admin asks how to do something (like manage exams, students, questions, or results), provide a step-by-step guide using the exact UI buttons and menus described below.
- Do not hallucinate features that don't exist in the UI guidelines below.

====================
UI NAVIGATION & ADMIN CAPABILITIES
====================
1. Dashboard
- Accessible via "Dashboard" in the sidebar. Overview of the system.

2. Exams (Manage Exams)
- To create an exam: Click on "Exams" in the left sidebar. Then, click the blue "Create New Exam" button at the top right.
- To edit an exam: On the "Exams" page, click the three dots (⋮) on an exam card and select "Edit Details".
- To delete an exam: Click the three dots (⋮) on an exam card and select "Delete Exam".
- To manage questions for an exam: Click directly on the exam card, or click the three dots (⋮) and select "Manage Questions".

3. Questions (Manage Questions)
- After selecting an exam to manage questions, you will be on the Questions page.
- To add a question: Click the "Add Question" button. You can choose between "Multiple Choice" or "Typing" (descriptive) questions.
- To edit or view a question: Click on the question in the list, or click the Eye icon.

4. Students (Manage Students)
- To view and manage students: Click on "Students" in the left sidebar.
- You can search for students by name or email.
- Under the "Actions" column for each student, you can:
  * Edit their details (Pencil icon)
  * Reset their password (Key icon)
  * View their selfie video (Video icon)
  * Activate/Deactivate their account (Trash/Activate icons)

5. Results (View and Review Results)
- To view exam results: Click on "Results" in the left sidebar.
- You can filter results by student, exam, and pass/fail status.
- To manually grade or review a student's submitted attempt: Click the "Review" button next to their submission.

RESPONSE FORMAT: Warm greeting, followed by clear, bulleted step-by-step instructions. Keep it brief.
User message: ${input}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
          }),
        },
      );

      const data = await res.json();
      const botReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand that. Could you please rephrase your question?";

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

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(15,23,42,0.6)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      {/* Modal Panel */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{
          maxHeight: "min(85vh, 720px)",
          animation: "chatModalIn 0.28s cubic-bezier(.22,1,.36,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-600 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <span className="font-black tracking-tight text-white text-base">
                AI Assistant
              </span>
              <p className="text-blue-200 text-[10px] font-semibold uppercase tracking-widest leading-none mt-0.5">
                ExamHub · Powered by Gemini
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl hover:bg-white/15 p-2 transition-all duration-200 text-white/80 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/60 custom-scrollbar">
          {messages.length === 0 ? (
            <WelcomeMessage />
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "bot" && (
                  <div className="w-7 h-7 rounded-lg bg-linear-to-tr from-blue-500 to-indigo-500 flex items-center justify-center mr-2 mt-1 shrink-0 shadow">
                    <Sparkles size={14} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 rounded-tr-sm"
                      : "bg-white text-slate-700 border border-slate-100 shadow-sm rounded-tl-sm"
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
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center ml-2 mt-1 shrink-0">
                    <span className="text-xs font-black text-slate-500">
                      You
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest pl-10">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              <span>Thinking…</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="shrink-0 px-5 py-4 border-t border-slate-100 bg-white">
          <div className="relative flex items-center gap-3">
            <input
              type="text"
              value={input}
              placeholder="Ask anything about your exam system…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="w-full h-12 pl-5 pr-14 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-sm"
              disabled={loading}
              autoFocus
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="absolute right-1.5 text-white bg-blue-600 p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-30 transition-all duration-200 shadow-sm"
            >
              <SendHorizontal size={18} />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2 font-medium">
            Press{" "}
            <kbd className="bg-slate-100 px-1 py-0.5 rounded text-slate-500 font-mono">
              Enter
            </kbd>{" "}
            to send &nbsp;·&nbsp;{" "}
            <kbd className="bg-slate-100 px-1 py-0.5 rounded text-slate-500 font-mono">
              Esc
            </kbd>{" "}
            to close
          </p>
        </div>
      </div>

      {/* Keyframe animation injected inline */}
      <style>{`
        @keyframes chatModalIn {
          from { opacity: 0; transform: scale(0.93) translateY(24px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
};

// Legacy named export kept for any other usages (renders nothing now)
export const ChatBot = () => null;

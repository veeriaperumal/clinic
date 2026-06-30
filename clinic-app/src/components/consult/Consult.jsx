import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronLeft } from "lucide-react";
import SectionHeading from "../layout/SectionHeading";
import { DOCTORS } from "../../data";

function ChatMessage({ message, index }) {
  const isPatient = message.from === "patient";
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isPatient ? "justify-end" : "justify-start"}`}
    >
      <div
        className="max-w-[85%] sm:max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed"
        style={{
          background: isPatient ? "var(--color-primary)" : "var(--color-bg)",
          color: isPatient ? "#fff" : "var(--color-ink)",
          borderBottomRightRadius: isPatient ? 4 : 12,
          borderBottomLeftRadius: isPatient ? 12 : 4,
        }}
      >
        {message.text}
      </div>
    </motion.div>
  );
}

function ActiveChat({ active, onEnd }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [consultStarted, setConsultStarted] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function startConsult() {
    setConsultStarted(true);
    setMessages([{ from: "doctor", text: `Hello, I'm ${active.name}. What's bringing you in today?` }]);
  }

  function send() {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [...m, { from: "patient", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const lower = text.toLowerCase();
      let reply = "Thanks for sharing that. Since when have you noticed this?";
      if (lower.includes("fever")) reply = "Noted — how high has your temperature gone, and for how many days?";
      else if (lower.includes("cold") || lower.includes("cough")) reply = "Understood. Any breathlessness, or is it mainly a dry cough?";
      else if (lower.includes("pain")) reply = "Can you point to where exactly the pain is, and rate it 1–10?";
      else if (lower.includes("thank")) reply = "You're welcome. I'll send a prescription to your medicine cabinet.";
      setMessages((m) => [...m, { from: "doctor", text: reply }]);
    }, 1400);
  }

  if (!consultStarted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg mx-auto">
        <button onClick={onEnd} className="text-xs font-medium flex items-center gap-1 mb-4 text-primary hover:underline touch-manipulation">
          <ChevronLeft size={12} /> Back to doctors
        </button>
        <div className="p-5 rounded-xl bg-surface border border-line text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto text-base font-semibold bg-primary-tint text-primary">
            {active.initials}
          </div>
          <h3 className="mt-3 text-base font-semibold">{active.name}</h3>
          <p className="text-xs text-ink-soft mt-0.5">{active.deptName}</p>
          <p className="text-[10px] mt-3 text-ink-soft">Consultation fee: ₹{active.fee}</p>
          <motion.button whileTap={{ scale: 0.97 }} onClick={startConsult} className="mt-4 px-5 py-2.5 sm:py-2 rounded-lg text-xs font-semibold bg-primary text-white touch-manipulation">
            Start consultation
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg mx-auto">
      <button onClick={onEnd} className="text-xs font-medium flex items-center gap-1 mb-4 text-primary hover:underline touch-manipulation">
        <ChevronLeft size={12} /> End consultation
      </button>
      <div className="rounded-xl overflow-hidden flex flex-col bg-surface border border-line" style={{ height: "clamp(24rem, 70vh, 36rem)" }}>
        <div className="flex items-center gap-2.5 p-3 border-b border-line">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold bg-primary-tint text-primary shrink-0">{active.initials}</div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{active.name}</p>
            <p className="text-[10px] flex items-center gap-1 text-success">
              <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" /> Online · ₹{active.fee} fee
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
          <AnimatePresence>
            {messages.map((m, i) => <ChatMessage key={i} message={m} index={i} />)}
          </AnimatePresence>
          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="px-3 py-2 rounded-xl text-xs bg-bg text-ink-soft">
                <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>typing…</motion.span>
              </div>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>
        <div className="p-2.5 flex items-center gap-2 border-t border-line">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Describe your symptoms…"
            className="flex-1 px-3 py-2.5 sm:py-2 rounded-lg text-xs outline-none bg-bg border border-line min-w-0"
          />
          <motion.button whileTap={{ scale: 0.95 }} onClick={send} className="w-10 h-10 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 bg-primary touch-manipulation">
            <Send size={14} color="#fff" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Consult() {
  const [active, setActive] = useState(null);

  return (
    <div>
      {active ? (
        <ActiveChat active={active} onEnd={() => setActive(null)} />
      ) : (
        <>
          <SectionHeading eyebrow="Telehealth" title="Consult online" sub="Message a doctor directly. Online doctors typically reply within a minute." />
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } }}
            className="space-y-2"
          >
            {DOCTORS.map((doc) => (
              <motion.div
                key={doc.id}
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                whileHover={{ y: -1 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-line"
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold bg-primary-tint text-primary">{doc.initials}</div>
                  <motion.span
                    animate={doc.online ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface ${doc.online ? "bg-success" : "bg-[#B7AFA4]"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{doc.name}</p>
                  <p className="text-xs text-ink-soft truncate">{doc.deptName}</p>
                  <p className={`text-[10px] mt-0.5 truncate ${doc.online ? "text-success" : "text-ink-soft"}`}>
                    {doc.online ? "Online now" : `Offline · next ${doc.next}`}
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={!doc.online}
                  onClick={() => setActive(doc)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold shrink-0 transition-colors disabled:opacity-40 touch-manipulation ${doc.online ? "bg-accent text-[#2A1B05]" : "bg-line text-ink-soft"}`}
                >
                  {doc.online ? "Start chat" : "Notify me"}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

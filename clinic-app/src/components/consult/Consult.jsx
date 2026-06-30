import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, ChevronLeft, Phone, PhoneOff, Video, VideoOff,
  Mic, MicOff, Speaker, X
} from "lucide-react";
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

function CallOverlay({ type, doctor, onEnd }) {
  const [status, setStatus] = useState("connecting");
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setStatus("connected");
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }, 1200);
    return () => {
      clearTimeout(connectTimer);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleEnd = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onEnd();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full p-6 bg-ink text-center relative overflow-hidden"
    >
      {/* video background */}
      {type === "video" && !videoOff && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-[#06332D] opacity-60" />
      )}

      {type === "video" && videoOff && (
        <div className="absolute inset-0 bg-gradient-to-br from-ink to-[#1a2e2b]" />
      )}

      {/* doctor avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 150, delay: 0.1 }}
        className="relative z-10"
      >
        <div
          className={`rounded-full flex items-center justify-center font-semibold bg-surface/10 text-white mx-auto ring-2 ring-white/20 ${
            type === "video" ? "w-24 h-24 text-2xl" : "w-28 h-28 text-3xl"
          }`}
        >
          {doctor.initials}
        </div>
        <div className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-ink ${status === "connected" ? "bg-success" : "bg-accent animate-pulse"}`} />
      </motion.div>

      {/* caller info */}
      <div className="relative z-10 mt-4">
        <p className="text-white font-semibold text-base">{doctor.name}</p>
        <p className="text-white/50 text-xs mt-0.5">{type === "voice" ? "Voice call" : "Video call"}</p>
      </div>

      {/* status / timer */}
      <div className="relative z-10 mt-3">
        {status === "connecting" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-white/60 text-xs"
          >
            Connecting…
          </motion.p>
        )}
        {status === "connected" && (
          <p className="text-white/60 text-xs tabular-nums">{formatTime(seconds)}</p>
        )}
        {status === "ended" && (
          <p className="text-white/40 text-xs">Call ended</p>
        )}
      </div>

      {/* controls */}
      <div className="relative z-10 flex items-center gap-4 mt-8">
        {status === "connected" && (
          <>
            {type === "video" && (
              <button
                onClick={() => setVideoOff((v) => !v)}
                className="w-11 h-11 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-colors touch-manipulation"
              >
                {videoOff ? <VideoOff size={18} /> : <Video size={18} />}
              </button>
            )}
            <button
              onClick={() => setMuted((m) => !m)}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-colors touch-manipulation"
            >
              {muted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button className="w-11 h-11 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-colors touch-manipulation">
              <Speaker size={18} />
            </button>
          </>
        )}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleEnd}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-danger text-white shadow-lg shadow-danger/30 hover:bg-[#a04030] transition-colors touch-manipulation"
        >
          {type === "voice" ? <PhoneOff size={20} /> : <X size={20} />}
        </motion.button>
      </div>
    </motion.div>
  );
}

function ActiveChat({ active, onEnd }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [consultStarted, setConsultStarted] = useState(false);
  const [call, setCall] = useState(null);
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

          {/* voice/video quick actions */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setConsultStarted(true) || setCall("voice")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-primary-tint text-primary border border-primary/20 touch-manipulation"
            >
              <Phone size={14} /> Voice
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setConsultStarted(true) || setCall("video")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-primary-tint text-primary border border-primary/20 touch-manipulation"
            >
              <Video size={14} /> Video
            </motion.button>
          </div>

          <div className="relative my-4 flex items-center gap-2">
            <span className="flex-1 border-t border-line" />
            <span className="text-[10px] text-ink-soft font-medium">or</span>
            <span className="flex-1 border-t border-line" />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={startConsult}
            className="w-full py-2.5 sm:py-2 rounded-lg text-xs font-semibold bg-primary text-white touch-manipulation"
          >
            Start text consultation
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
      <div className="rounded-xl overflow-hidden flex flex-col bg-surface border border-line" style={{ height: "clamp(28rem, 70vh, 40rem)" }}>
        {/* header with call buttons */}
        <div className="flex items-center gap-2.5 p-3 border-b border-line">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold bg-primary-tint text-primary shrink-0">{active.initials}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{active.name}</p>
            <p className="text-[10px] flex items-center gap-1 text-success">
              <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" /> Online · ₹{active.fee} fee
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setCall(call === "voice" ? null : "voice")}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors touch-manipulation ${
                call === "voice" ? "bg-primary text-white" : "bg-primary-tint text-primary hover:bg-primary hover:text-white"
              }`}
            >
              {call === "voice" ? <PhoneOff size={14} /> : <Phone size={14} />}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setCall(call === "video" ? null : "video")}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors touch-manipulation ${
                call === "video" ? "bg-primary text-white" : "bg-primary-tint text-primary hover:bg-primary hover:text-white"
              }`}
            >
              {call === "video" ? <VideoOff size={14} /> : <Video size={14} />}
            </motion.button>
          </div>
        </div>

        {/* call overlay or chat */}
        <AnimatePresence mode="wait">
          {call ? (
            <motion.div key="call" className="flex-1">
              <CallOverlay type={call} doctor={active} onEnd={() => setCall(null)} />
            </motion.div>
          ) : (
            <motion.div key="chat" className="flex-1 flex flex-col">
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
            </motion.div>
          )}
        </AnimatePresence>
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
          <SectionHeading eyebrow="Telehealth" title="Consult online" sub="Message, voice call, or video call a doctor directly." />
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

                {/* action buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {doc.online && (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setActive({ ...doc, callType: "voice" })}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary-tint text-primary hover:bg-primary hover:text-white transition-colors touch-manipulation"
                        title="Voice call"
                      >
                        <Phone size={13} />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setActive({ ...doc, callType: "video" })}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary-tint text-primary hover:bg-primary hover:text-white transition-colors touch-manipulation"
                        title="Video call"
                      >
                        <Video size={13} />
                      </motion.button>
                    </>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    disabled={!doc.online}
                    onClick={() => setActive({ ...doc, callType: null })}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-colors disabled:opacity-40 touch-manipulation ${doc.online ? "bg-accent text-[#2A1B05]" : "bg-line text-ink-soft"}`}
                  >
                    {doc.online ? "Chat" : "Notify me"}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

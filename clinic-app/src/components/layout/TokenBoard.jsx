import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TOKEN_KEYS } from "../../data";

function TokenValue({ value, label }) {
  return (
    <div className="flex items-baseline gap-1 sm:gap-1.5">
      <span className="text-[10px] font-semibold text-white/55">{label}</span>
      <motion.span
        key={value}
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-sm sm:text-base font-bold tabular-nums text-accent"
      >
        {String(value).padStart(2, "0")}
      </motion.span>
    </div>
  );
}

export default function TokenBoard() {
  const [tokens, setTokens] = useState({ GEN: 18, ENT: 6, DIA: 11, PED: 24, GYN: 4 });
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion.current) return;
    const id = setInterval(() => {
      setTokens((prev) => {
        const key = TOKEN_KEYS[Math.floor(Math.random() * TOKEN_KEYS.length)];
        return { ...prev, [key]: prev[key] + 1 };
      });
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 py-2 flex items-center gap-3 sm:gap-5 overflow-x-auto scrollbar-thin bg-ink border-b border-white/10">
      <span className="text-[10px] uppercase tracking-widest shrink-0 text-white/45 font-semibold">
        Now serving
      </span>
      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        {TOKEN_KEYS.map((k) => (
          <TokenValue key={k} label={k} value={tokens[k]} />
        ))}
      </div>
    </div>
  );
}

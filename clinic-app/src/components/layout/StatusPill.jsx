import { motion } from "framer-motion";

const STATUS_MAP = {
  ready: { bg: "#E8F2EA", fg: "#2F6B45", label: "Ready", dot: "bg-success" },
  processing: { bg: "#FCEFE0", fg: "#A2611A", label: "Processing", dot: "bg-warning" },
  awaiting: { bg: "#F1EEEA", fg: "#6B645B", label: "Awaiting", dot: "bg-[#6B645B]" },
};

export default function StatusPill({ status }) {
  const s = STATUS_MAP[status];
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ background: s.bg, color: s.fg }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </motion.span>
  );
}

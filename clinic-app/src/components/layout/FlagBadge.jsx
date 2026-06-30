import { motion } from "framer-motion";

export default function FlagBadge({ flag }) {
  const color = flag === "normal" ? "#2F6B45" : "#B8503F";
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-[10px] font-semibold"
      style={{ color }}
    >
      {flag === "normal" ? "Normal" : flag === "low" ? "Low" : "High"}
    </motion.span>
  );
}

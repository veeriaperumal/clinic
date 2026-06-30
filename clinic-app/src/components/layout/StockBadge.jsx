import { motion } from "framer-motion";

const STOCK_MAP = {
  in: { bg: "#E8F2EA", fg: "#2F6B45", label: "In stock" },
  low: { bg: "#FCEFE0", fg: "#A2611A", label: "Low stock" },
  out: { bg: "#F7E9E7", fg: "#B8503F", label: "Out of stock" },
};

export default function StockBadge({ stock }) {
  const s = STOCK_MAP[stock];
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.label}
    </motion.span>
  );
}

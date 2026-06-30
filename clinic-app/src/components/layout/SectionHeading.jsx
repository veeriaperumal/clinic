import { motion } from "framer-motion";

export default function SectionHeading({ eyebrow, title, sub, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={`mb-4 ${className}`}
    >
      {eyebrow && (
        <p className="text-[10px] font-semibold tracking-widest uppercase mb-1 text-accent-dark">
          {eyebrow}
        </p>
      )}
      <h2 className="text-lg md:text-xl font-semibold text-ink leading-tight">
        {title}
      </h2>
      {sub && <p className="text-xs text-ink-soft mt-0.5">{sub}</p>}
    </motion.div>
  );
}

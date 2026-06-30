import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Pill } from "lucide-react";
import SectionHeading from "../layout/SectionHeading";
import StockBadge from "../layout/StockBadge";
import { MEDICINES } from "../../data";

export default function Medicine() {
  const [query, setQuery] = useState("");
  const filtered = MEDICINES.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <SectionHeading eyebrow="In-house pharmacy" title="Check medicine availability" sub="Search before your visit so you don't make a wasted trip." />

      <div className="relative mb-4 w-full max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by medicine name…"
          className="w-full pl-9 pr-8 py-2.5 sm:py-2 rounded-lg text-xs outline-none bg-surface border border-line transition-shadow focus:border-primary/50 focus:shadow-[0_0_0_2px_rgba(14,92,83,0.1)]"
        />
        {query && (
          <motion.button initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} onClick={() => setQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-ink-soft hover:text-ink font-medium touch-manipulation">
            Clear
          </motion.button>
        )}
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.03 } } }}
        className="space-y-1.5"
      >
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-ink-soft">
              No medicine matches &quot;{query}&quot;. Try a generic name instead of a brand.
            </motion.p>
          ) : (
            filtered.map((m) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -1 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-line"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 bg-primary-tint">
                  <Pill size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{m.name}</p>
                  <p className="text-[10px] text-ink-soft truncate">{m.form}</p>
                  {m.stock === "out" && m.sub && <p className="text-[10px] mt-0.5 text-accent-dark truncate">Try: {m.sub}</p>}
                </div>
                <span className="text-xs font-semibold shrink-0">₹{m.price}</span>
                <StockBadge stock={m.stock} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

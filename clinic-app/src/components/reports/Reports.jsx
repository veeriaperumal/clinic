import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ChevronLeft, Download, Check } from "lucide-react";
import SectionHeading from "../layout/SectionHeading";
import StatusPill from "../layout/StatusPill";
import FlagBadge from "../layout/FlagBadge";
import { REPORTS } from "../../data";

export default function Reports() {
  const [openId, setOpenId] = useState(null);
  const [downloaded, setDownloaded] = useState({});
  const open = REPORTS.find((r) => r.id === openId);

  if (open) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl mx-auto"
      >
        <button
          onClick={() => setOpenId(null)}
          className="text-xs font-medium flex items-center gap-1 mb-4 text-primary hover:underline touch-manipulation"
        >
          <ChevronLeft size={12} /> All reports
        </button>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="p-4 sm:p-5 rounded-xl bg-surface border border-line shadow-card"
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
              <h3 className="text-base font-semibold truncate">{open.test}</h3>
              <p className="text-xs text-ink-soft truncate">
                Collected {open.date} · Clinic Lab
              </p>
            </div>
            <StatusPill status={open.status} />
          </div>

          {open.params.length > 0 && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.04 } },
              }}
            >
              <div className="grid grid-cols-4 gap-1 sm:gap-2 text-[10px] uppercase tracking-wide pb-1.5 mb-1 text-ink-soft font-semibold border-b border-line">
                <span>Parameter</span>
                <span>Result</span>
                <span>Range</span>
                <span>Flag</span>
              </div>
              {open.params.map((p) => (
                <motion.div
                  key={p.name}
                  variants={{
                    hidden: { opacity: 0, x: -6 },
                    show: { opacity: 1, x: 0 },
                  }}
                  className="grid grid-cols-4 gap-1 sm:gap-2 py-2 text-xs border-b border-line/40"
                >
                  <span className="truncate">{p.name}</span>
                  <span className="font-medium truncate">
                    {p.result} {p.unit}
                  </span>
                  <span className="text-ink-soft truncate">{p.range}</span>
                  <FlagBadge flag={p.flag} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setDownloaded((d) => ({ ...d, [open.id]: true }))}
            className={`mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 sm:py-2 rounded-lg text-xs font-semibold transition-colors touch-manipulation ${downloaded[open.id] ? "bg-success-bg text-success" : "bg-primary text-white"}`}
          >
            {downloaded[open.id] ? (
              <>
                <Check size={14} /> Downloaded
              </>
            ) : (
              <>
                <Download size={14} /> Download PDF
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Lab & consult history"
        title="My reports"
        sub="Reports appear here as soon as the lab finishes processing."
      />
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.04 } },
        }}
        className="space-y-1.5"
      >
        {REPORTS.map((r) => (
          <motion.button
            key={r.id}
            variants={{
              hidden: { opacity: 0, y: 6 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={r.status === "ready" ? { x: 2 } : {}}
            whileTap={r.status === "ready" ? { scale: 0.99 } : {}}
            onClick={() => r.status === "ready" && setOpenId(r.id)}
            disabled={r.status !== "ready"}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-left disabled:cursor-default bg-surface border border-line touch-manipulation"
          >
            <FileText size={16} className="text-ink-soft shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{r.test}</p>
              <p className="text-[10px] text-ink-soft">{r.date}</p>
            </div>
            <StatusPill status={r.status} />
            {r.status === "ready" && (
              <ChevronLeft
                size={14}
                className="text-ink-soft rotate-180 shrink-0 hidden xs:block"
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

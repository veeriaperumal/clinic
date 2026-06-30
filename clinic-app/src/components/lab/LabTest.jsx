import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, CheckCircle2 } from "lucide-react";
import SectionHeading from "../layout/SectionHeading";
import { LAB_TESTS, MORNING_SLOTS, EVENING_SLOTS, nextDays } from "../../data";

export default function LabTest() {
  const [selected, setSelected] = useState([]);
  const [collection, setCollection] = useState("home");
  const [day, setDay] = useState(null);
  const [slot, setSlot] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const days = nextDays(4);

  function toggle(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const chosen = LAB_TESTS.filter((t) => selected.includes(t.id));
  const total = chosen.reduce((s, t) => s + t.price, 0);
  const fasting = chosen.some((t) => t.fasting);

  if (confirmed) {
    const orderId = "LAB" + Math.floor(10000 + Math.random() * 89999);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} className="w-full max-w-lg mx-auto">
        <div className="p-4 sm:p-5 rounded-xl bg-surface border border-line shadow-card">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-2 mb-4 text-success">
            <CheckCircle2 size={18} />
            <span className="text-sm font-semibold">Lab order placed</span>
          </motion.div>
          <p className="text-[10px] uppercase tracking-widest text-ink-soft font-semibold">Order ID</p>
          <p className="text-xl font-bold mb-4 text-primary">{orderId}</p>
          <div className="space-y-1.5 mb-3 pb-3 border-b border-dashed border-line text-xs">
            {chosen.map((t) => (
              <div key={t.id} className="flex justify-between gap-2"><span className="truncate">{t.name}</span><span className="font-semibold shrink-0">₹{t.price}</span></div>
            ))}
          </div>
          <div className="flex justify-between text-sm font-semibold mb-4"><span>Total</span><span>₹{total}</span></div>
          <dl className="space-y-1.5 text-xs mb-4">
            {[
              ["Collection", collection === "home" ? "Home collection" : "Walk-in"],
              ["Date", `${day.label}, ${day.date}`],
              ["Time", slot],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-2"><dt className="text-ink-soft shrink-0">{label}</dt><dd className="font-medium text-right">{value}</dd></div>
            ))}
          </dl>
          {fasting && (
            <div className="flex gap-2 p-2.5 rounded-lg text-[10px] mb-4 bg-warning-bg text-warning">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>One or more tests need 8–10 hours of fasting. Avoid food before your slot, water is fine.</span>
            </div>
          )}
          <motion.button whileTap={{ scale: 0.98 }} onClick={() => { setConfirmed(false); setSelected([]); setDay(null); setSlot(null); }} className="w-full py-2.5 sm:py-2 rounded-lg text-xs font-semibold bg-primary text-white touch-manipulation">
            Book another test
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
      <div className="lg:col-span-2 min-w-0">
        <SectionHeading eyebrow="Lab orders" title="Book a lab test" sub="Select the tests you need. Prices include collection." />
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.03 } } }}
          className="space-y-1.5"
        >
          {LAB_TESTS.map((t) => (
            <motion.label
              key={t.id}
              variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
              whileHover={{ x: 2 }}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer bg-surface border transition-colors touch-manipulation ${selected.includes(t.id) ? "border-primary" : "border-line"}`}
            >
              <span
                className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${selected.includes(t.id) ? "bg-primary" : "bg-transparent border"}`}
                style={{ borderColor: selected.includes(t.id) ? "transparent" : "var(--color-line)" }}
                onClick={(e) => { e.preventDefault(); toggle(t.id); }}
              >
                <AnimatePresence>{selected.includes(t.id) && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check size={10} color="#fff" strokeWidth={3} /></motion.div>}</AnimatePresence>
              </span>
              <div className="flex-1 text-xs min-w-0" onClick={() => toggle(t.id)}>
                <p className="font-medium truncate">{t.name}</p>
                <p className="text-[10px] text-ink-soft truncate">{t.code}{t.fasting ? " · Fasting required" : ""}</p>
              </div>
              <span className="text-xs font-semibold shrink-0">₹{t.price}</span>
            </motion.label>
          ))}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:sticky lg:top-4 self-start">
        <div className="p-3 sm:p-4 rounded-xl bg-surface border border-line">
          <p className="text-[10px] uppercase tracking-widest mb-3 text-ink-soft font-semibold">Order summary</p>
          {chosen.length === 0 ? (
            <p className="text-xs text-ink-soft">No tests selected yet.</p>
          ) : (
            <div className="space-y-1.5 mb-3 pb-3 border-b border-dashed border-line text-xs">
              {chosen.map((t) => (
                <div key={t.id} className="flex justify-between gap-2"><span className="truncate">{t.name}</span><span className="shrink-0 font-semibold">₹{t.price}</span></div>
              ))}
            </div>
          )}
          <div className="flex justify-between text-sm font-semibold mb-4"><span>Total</span><span>₹{total}</span></div>

          <p className="text-[10px] font-semibold mb-1.5">Collection</p>
          <div className="flex gap-1.5 mb-3">
            {[{ id: "home", label: "Home" }, { id: "walkin", label: "Walk-in" }].map((c) => (
              <button key={c.id} onClick={() => setCollection(c.id)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-colors touch-manipulation ${collection === c.id ? "bg-primary text-white" : "bg-transparent text-ink border border-line"}`}>
                {c.label}
              </button>
            ))}
          </div>

          <p className="text-[10px] font-semibold mb-1.5">Date</p>
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-thin">
            {days.map((d) => (
              <button key={d.key} onClick={() => setDay(d)} className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[10px] text-center transition-colors touch-manipulation ${day?.key === d.key ? "bg-primary text-white" : "bg-transparent text-ink border border-line"}`}>
                {d.label}
              </button>
            ))}
          </div>

          <p className="text-[10px] font-semibold mb-1.5">Time</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {[...MORNING_SLOTS.slice(0, 3), ...EVENING_SLOTS.slice(0, 3)].map((s) => (
              <button key={s} onClick={() => setSlot(s)} className={`px-2 py-1 rounded-lg text-[10px] transition-colors touch-manipulation ${slot === s ? "bg-primary text-white" : "bg-transparent text-ink border border-line"}`}>
                {s}
              </button>
            ))}
          </div>

          <motion.button whileTap={{ scale: 0.97 }} disabled={chosen.length === 0 || !day || !slot} onClick={() => setConfirmed(true)} className="w-full py-2.5 sm:py-2 rounded-lg text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed bg-accent text-[#2A1B05] touch-manipulation">
            Place order
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

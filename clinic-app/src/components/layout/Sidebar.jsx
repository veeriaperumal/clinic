import { motion, AnimatePresence } from "framer-motion";
import { NAV } from "../../data";

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { delay: 0.08 + i * 0.03, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export default function Sidebar({ active, onNavigate, open, onClose }) {
  const sidebarContent = (
    <div className="flex flex-col h-full px-2 sm:px-3 py-3 sm:py-4 gap-0.5">
      {NAV.map((item, i) => (
        <motion.button
          key={item.id}
          custom={i}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { onNavigate(item.id); onClose?.(); }}
          className={`flex items-center gap-2.5 px-3 py-2.5 sm:py-2 rounded-xl text-xs font-medium text-left transition-all touch-manipulation ${
            active === item.id
              ? "bg-primary-tint text-primary-dark font-semibold"
              : "text-ink-soft hover:bg-primary-tint/40"
          }`}
        >
          <item.icon size={16} strokeWidth={1.75} />
          {item.label}
        </motion.button>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-auto pt-4 hidden md:block"
      >
        <div className="p-3 rounded-xl text-[11px] bg-bg text-ink-soft leading-relaxed">
          <p className="font-semibold mb-0.5 text-ink">Need urgent help?</p>
          Call <span className="font-semibold">+91 44 4XXX XXXX</span>
        </div>
      </motion.div>
    </div>
  );

  return (
    <>
      <motion.nav className="hidden md:flex flex-col w-56 shrink-0 border-r border-line bg-surface overflow-hidden">
        {sidebarContent}
      </motion.nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-20 bg-black/15 md:hidden"
              onClick={onClose}
            />
            <motion.nav
              key="mobile-nav"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 250 }}
              className="fixed left-0 top-0 bottom-0 z-30 w-72 xs:w-64 max-w-[85vw] bg-surface border-r border-line md:hidden shadow-xl"
            >
              {sidebarContent}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

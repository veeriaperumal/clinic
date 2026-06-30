import { motion } from "framer-motion";
import { Stethoscope, Menu, X } from "lucide-react";

export default function Header({ navOpen, onToggleNav }) {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 border-b border-line bg-surface/90 backdrop-blur-md sticky top-0 z-30"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 -ml-1 rounded-lg active:bg-primary-tint/50 touch-manipulation"
          onClick={onToggleNav}
          aria-label="Toggle menu"
        >
          <motion.div
            animate={{ rotate: navOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {navOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.div>
        </button>
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center bg-primary shadow-sm shadow-primary/20 shrink-0">
            <Stethoscope size={16} color="#fff" strokeWidth={1.75} />
          </div>
          <div>
            <p className="leading-none text-sm sm:text-base font-semibold tracking-tight">
              Clinic
            </p>
            <p className="text-[10px] leading-none mt-0.5 text-ink-soft font-medium hidden xs:block">
              Family Clinic, Chennai
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-2.5">
        <span className="hidden xs:inline text-xs font-medium text-ink-soft">
          Demo Patient
        </span>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold bg-accent text-[#2A1B05] cursor-pointer shrink-0">
          DP
        </div>
      </div>
    </motion.header>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, ChevronRight, ChevronLeft, Star, Stethoscope,
  User, Clock, IndianRupee, Calendar
} from "lucide-react";
import SectionHeading from "../layout/SectionHeading";
import { DEPARTMENTS, DOCTORS, MORNING_SLOTS, EVENING_SLOTS, nextDays } from "../../data";

const stepVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.2 } },
};

function StepIndicator({ step }) {
  const steps = ["Department", "Doctor", "Slot", "Confirm"];
  return (
    <div className="flex items-center gap-1 sm:gap-1.5 mb-4 sm:mb-5 overflow-x-auto pb-1 scrollbar-thin">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center shrink-0">
          <motion.div
            animate={{
              backgroundColor: step > i + 1 ? "var(--color-success)" : step === i + 1 ? "var(--color-primary)" : "transparent",
              color: step >= i + 1 ? "#fff" : "var(--color-ink-soft)",
              borderColor: step >= i + 1 ? "transparent" : "var(--color-line)",
            }}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[10px] font-semibold border"
            style={{ borderWidth: step >= i + 1 ? 0 : 1 }}
          >
            {step > i + 1 ? <CheckCircle2 size={12} /> : <span>{i + 1}</span>}
            <span className="hidden sm:inline">{label}</span>
          </motion.div>
          {i < 3 && <ChevronRight size={12} className="mx-1 text-line shrink-0" />}
        </div>
      ))}
    </div>
  );
}

function DeptGrid({ departments, onSelect }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } }}
      className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2"
    >
      {departments.map((d) => (
        <motion.button
          key={d.id}
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          whileHover={{ y: -2, boxShadow: "var(--shadow-card-hover)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(d)}
          className="p-3 sm:p-4 rounded-xl text-left bg-surface border border-line touch-manipulation"
        >
          <span className="text-[10px] font-semibold text-accent-dark">{d.short}</span>
          <p className="mt-1 text-sm font-semibold">{d.name}</p>
        </motion.button>
      ))}
    </motion.div>
  );
}

function DoctorList({ doctors, onSelect, onBack }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.03 } } }}
      className="space-y-2"
    >
      {doctors.map((doc) => (
        <motion.button
          key={doc.id}
          variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSelect(doc)}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-left bg-surface border border-line touch-manipulation"
        >
          <div className="relative shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-sm font-semibold bg-gradient-to-br from-primary-tint to-primary/10 text-primary">
              {doc.initials}
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface ${doc.online ? "bg-success" : "bg-[#B7AFA4]"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{doc.name}</p>
            <p className="text-xs text-ink-soft truncate">{doc.deptName} · {doc.qual}</p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[10px] text-ink-soft">
              <span className="flex items-center gap-0.5"><Star size={9} fill="#E08A3E" stroke="none" />{doc.rating}</span>
              <span className="flex items-center gap-0.5"><IndianRupee size={9} />{doc.fee}</span>
              <span className="flex items-center gap-0.5"><Clock size={9} />{doc.next}</span>
            </div>
          </div>
          <ChevronRight size={15} className="text-ink-soft shrink-0" />
        </motion.button>
      ))}
      <button onClick={onBack} className="text-xs font-medium flex items-center gap-1 text-primary mt-1 touch-manipulation">
        <ChevronLeft size={12} /> Back to departments
      </button>
    </motion.div>
  );
}

function SlotPicker({ day, setDay, slot, setSlot, onConfirm, onBack }) {
  const days = nextDays(6);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
        <Calendar size={13} className="text-primary" /> Choose a date
      </p>
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 sm:mb-4 scrollbar-thin">
        {days.map((d) => (
          <motion.button
            key={d.key}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDay(d)}
            className={`shrink-0 px-2.5 sm:px-3 py-2 rounded-lg text-xs text-center transition-all touch-manipulation ${
              day?.key === d.key
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "bg-surface text-ink border border-line hover:border-primary/30"
            }`}
          >
            <div className="font-medium">{d.label}</div>
            <div className="text-[10px] opacity-80 mt-0.5">{d.date}</div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {day && (
          <motion.div key={day.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <Clock size={13} className="text-primary" /> Choose a time
            </p>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-4">
              {[
                { label: "Morning", slots: MORNING_SLOTS },
                { label: "Evening", slots: EVENING_SLOTS },
              ].map((period) => (
                <div key={period.label}>
                  <p className="text-[10px] uppercase tracking-widest mb-1.5 text-ink-soft font-semibold">{period.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {period.slots.map((s) => (
                      <motion.button
                        key={s}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => setSlot(s)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs transition-all touch-manipulation ${
                          slot === s
                            ? "bg-primary text-white shadow-sm shadow-primary/20"
                            : "bg-surface text-ink border border-line hover:border-primary/30"
                        }`}
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 pt-3 border-t border-line">
        <button onClick={onBack} className="text-xs font-medium flex items-center gap-1 text-primary touch-manipulation">
          <ChevronLeft size={12} /> Back
        </button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!day || !slot}
          onClick={onConfirm}
          className="ml-auto px-4 sm:px-5 py-2 rounded-lg text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed bg-accent text-[#2A1B05] touch-manipulation"
        >
          Confirm appointment
        </motion.button>
      </div>
    </motion.div>
  );
}

function Confirmed({ confirmed, doctor, day, slot, onReset }) {
  const details = [
    ["Doctor", doctor.name],
    ["Department", doctor.deptName],
    ["Date", `${day.label}, ${day.date}`],
    ["Time", slot],
    ["Consultation fee", `₹${doctor.fee}`],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="p-4 sm:p-5 rounded-xl bg-surface border border-line shadow-card">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-4 text-success"
        >
          <CheckCircle2 size={18} />
          <span className="text-sm font-semibold">Appointment confirmed</span>
        </motion.div>
        <div className="flex items-end justify-between pb-4 mb-4 border-b border-dashed border-line">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-[10px] uppercase tracking-widest text-ink-soft font-semibold">Your token</p>
            <p className="text-3xl sm:text-4xl font-bold mt-0.5 text-primary">
              {confirmed.short}-{confirmed.token}
            </p>
          </motion.div>
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 180 }}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-primary-tint">
              <Stethoscope size={24} strokeWidth={1.25} className="text-primary" />
            </div>
          </motion.div>
        </div>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
          className="space-y-2 text-sm"
        >
          {details.map(([label, value]) => (
            <motion.div
              key={label}
              variants={{ hidden: { opacity: 0, x: -6 }, show: { opacity: 1, x: 0 } }}
              className="flex justify-between py-1"
            >
              <span className="text-ink-soft text-xs">{label}</span>
              <span className="font-medium text-xs text-right">{value}</span>
            </motion.div>
          ))}
        </motion.div>
        <p className="text-[10px] mt-4 text-ink-soft flex items-center gap-1">
          <Clock size={11} /> Arrive 10 minutes early. Your token appears on the board near your turn.
        </p>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="mt-4 w-full py-2.5 sm:py-2 rounded-lg text-xs font-semibold bg-primary text-white touch-manipulation"
        >
          Book another appointment
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function Appointment() {
  const [step, setStep] = useState(1);
  const [dept, setDept] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [day, setDay] = useState(null);
  const [slot, setSlot] = useState(null);
  const [confirmed, setConfirmed] = useState(null);

  const filteredDoctors = dept ? DOCTORS.filter((d) => d.dept === dept) : DOCTORS;

  function reset() {
    setStep(1); setDept(null); setDoctor(null);
    setDay(null); setSlot(null); setConfirmed(null);
  }

  function confirmBooking() {
    const deptInfo = DEPARTMENTS.find((d) => d.id === doctor.dept);
    const token = Math.floor(Math.random() * 20) + 25;
    setConfirmed({ token, short: deptInfo.short });
  }

  if (confirmed) {
    return <Confirmed {...{ confirmed, doctor, day, slot, onReset: reset }} />;
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Step 1–4"
        title="Book an appointment"
        sub="Choose a department, a doctor, then a slot."
      />
      <StepIndicator step={step} />

      <AnimatePresence mode="wait">
        <motion.div key={step} variants={stepVariants} initial="enter" animate="center" exit="exit">
          {step === 1 && <DeptGrid departments={DEPARTMENTS} onSelect={(d) => { setDept(d.id); setStep(2); }} />}
          {step === 2 && <DoctorList doctors={filteredDoctors} onSelect={(doc) => { setDoctor(doc); setStep(3); }} onBack={() => setStep(1)} />}
          {step === 3 && <SlotPicker {...{ day, setDay, slot, setSlot }} onConfirm={confirmBooking} onBack={() => setStep(2)} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

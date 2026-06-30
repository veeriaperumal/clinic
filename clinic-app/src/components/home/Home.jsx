import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, Calendar, FlaskConical, Video, FileText, Pill,
  Users, Award, Activity, Star, Clock, Shield, HeartPulse,
  TrendingUp, ChevronRight, ChevronLeft, Stethoscope
} from "lucide-react";
import { DOCTORS } from "../../data";

function AnimatedCounter({ end, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = Math.max(1, Math.floor(end / 50));
    const interval = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(interval); }
      else setCount(start);
    }, duration / 50);
    return () => clearInterval(interval);
  }, [inView, end]);

  return <span ref={ref} className="tabular-nums font-bold text-lg xs:text-xl md:text-2xl">{prefix}{count}{suffix}</span>;
}

function DoctorCard({ doc }) {
  return (
    <div className="relative shrink-0 w-[170px] xs:w-[180px] sm:w-[190px] p-3 sm:p-4 rounded-xl bg-surface border border-line cursor-grab active:cursor-grabbing select-none">
      <div className="relative mx-auto w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-sm font-semibold bg-primary-tint text-primary mb-2 sm:mb-2.5">
        {doc.initials}
        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface ${doc.online ? "bg-success" : "bg-[#B7AFA4]"}`} />
      </div>
      <p className="text-xs font-semibold text-center leading-tight">{doc.name}</p>
      <p className="text-[10px] text-ink-soft text-center">{doc.deptName}</p>
      <div className="flex items-center justify-center gap-2 mt-1.5 text-[10px] text-ink-soft">
        <span className="flex items-center gap-0.5"><Star size={9} fill="#E08A3E" stroke="none" />{doc.rating}</span>
        <span>₹{doc.fee}</span>
      </div>
      <button className="mt-2 sm:mt-2.5 w-full py-1.5 sm:py-1 rounded-lg text-[10px] font-semibold bg-primary text-white touch-manipulation">
        {doc.online ? "Book now" : "View profile"}
      </button>
    </div>
  );
}

const WHY = [
  { icon: Clock, title: "Same-day slots", desc: "Available within 24 hours" },
  { icon: Shield, title: "Trusted since 2012", desc: "35,000+ families trust us" },
  { icon: HeartPulse, title: "Integrated care", desc: "Clinic, pharmacy & lab under one roof" },
  { icon: TrendingUp, title: "98% satisfaction", desc: "Rated 4.8★ across 12,000+ reviews" },
];

export default function Home({ go }) {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  const scrollCarousel = useCallback((dir) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 210, behavior: "smooth" });
    setTimeout(checkScroll, 300);
  }, [checkScroll]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const id = setInterval(() => {
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 20) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 210, behavior: "smooth" });
      }
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="max-w-full overflow-hidden">
      {/* ─── HERO ─── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden rounded-xl mb-3 sm:mb-4 bg-gradient-to-br from-primary via-primary-dark to-[#06332D] px-4 sm:px-5 md:px-8 py-5 sm:py-6 md:py-8"
      >
        <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-white/8 bg-white/5 right-[15%] top-[10%] animate-pulse" />
        <div className="absolute w-8 h-8 sm:w-10 sm:h-10 rounded-xl rotate-45 border border-white/8 bg-white/5 left-[20%] bottom-[20%] animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 rounded-full text-[10px] font-semibold bg-white/15 text-white/90 backdrop-blur-sm mb-2 sm:mb-3">
            <HeartPulse size={12} /> Your health, our priority
          </span>
          <h1 className="text-white font-bold leading-[1.15] text-lg sm:text-xl md:text-2xl lg:text-3xl mb-1.5 mt-1.5 sm:mt-2">
            Healthcare that <span className="text-accent-light">feels like family</span>
          </h1>
          <p className="text-white/65 text-xs sm:text-sm max-w-lg mb-3 sm:mb-4">
            Book appointments, order lab tests, consult doctors online — all from one place.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "appointment", icon: Calendar, label: "Book Appointment" },
              { id: "lab", icon: FlaskConical, label: "Lab Tests" },
              { id: "consult", icon: Video, label: "Consult Online" },
            ].map((qa) => (
              <motion.button
                key={qa.id}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => go(qa.id)}
                className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-medium bg-white/10 backdrop-blur-sm text-white border border-white/15 hover:bg-white/20 transition-colors touch-manipulation"
              >
                <qa.icon size={13} />
                {qa.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── TRUST STATS ─── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 xs:grid-cols-4 gap-2 mb-3 sm:mb-4"
      >
        {[
          { icon: Users, end: 35000, label: "Patients served", suffix: "+" },
          { icon: Award, end: 12, label: "Years of trust", suffix: "+" },
          { icon: Activity, end: 150, label: "Daily appointments", suffix: "+" },
          { icon: Star, end: 98, label: "Satisfaction", suffix: "%" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -2 }}
            className="p-2.5 sm:p-3 rounded-xl bg-surface border border-line flex items-center gap-2 sm:gap-2.5"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 bg-primary-tint">
              <stat.icon size={14} className="text-primary" />
            </div>
            <div className="leading-tight min-w-0">
              <AnimatedCounter end={stat.end} suffix={stat.suffix} />
              <p className="text-[10px] text-ink-soft truncate">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* ─── DOCTOR CAROUSEL ─── */}
      <section className="mb-3 sm:mb-4">
        <div className="flex items-center justify-between mb-2 sm:mb-2.5">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-accent-dark">Our team</p>
            <h2 className="text-sm font-semibold text-ink truncate">Top-rated doctors</h2>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={() => scrollCarousel(-1)}
              disabled={!canScrollLeft}
              className="w-7 h-7 rounded-full flex items-center justify-center border border-line text-ink disabled:border-line/30 disabled:text-line/40 hover:bg-primary-tint transition-colors touch-manipulation"
            ><ChevronLeft size={13} /></button>
            <button
              onClick={() => scrollCarousel(1)}
              disabled={!canScrollRight}
              className="w-7 h-7 rounded-full flex items-center justify-center border border-line text-ink disabled:border-line/30 disabled:text-line/40 hover:bg-primary-tint transition-colors touch-manipulation"
            ><ChevronRight size={13} /></button>
          </div>
        </div>
        <div
          ref={carouselRef}
          className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin -mx-0.5 px-0.5"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {DOCTORS.map((doc) => (
            <div key={doc.id} style={{ scrollSnapAlign: "start" }}>
              <DoctorCard doc={doc} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── QUICK ACTIONS GRID + WHY ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } }}
      >
        <div className="flex items-center justify-between mb-2 sm:mb-2.5">
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-accent-dark">Quick actions</p>
            <h2 className="text-sm font-semibold text-ink">What would you like to do?</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 mb-3 sm:mb-4">
          {[
            { id: "appointment", icon: Calendar, label: "Book Appointment", desc: "Same-day slots" },
            { id: "lab", icon: FlaskConical, label: "Lab Tests", desc: "Home collection" },
            { id: "consult", icon: Video, label: "Online Consult", desc: "Chat instantly" },
            { id: "reports", icon: FileText, label: "My Reports", desc: "View results" },
            { id: "medicine", icon: Pill, label: "Medicine Check", desc: "Check stock" },
          ].map((c) => (
            <motion.button
              key={c.id}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -3, boxShadow: "var(--shadow-card-hover)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => go(c.id)}
              className="p-3 sm:p-4 rounded-xl text-left bg-surface border border-line flex flex-col items-center text-center touch-manipulation"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center bg-primary-tint mb-1.5 sm:mb-2">
                <c.icon size={15} className="text-primary" />
              </div>
              <h3 className="text-xs font-semibold text-ink leading-tight">{c.label}</h3>
              <p className="text-[10px] text-ink-soft mt-0.5">{c.desc}</p>
              <span className="inline-flex items-center gap-0.5 mt-1.5 sm:mt-2 text-[10px] font-medium text-primary">
                Open <ArrowRight size={10} />
              </span>
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 mb-2">
          {WHY.map((item) => (
            <motion.div
              key={item.title}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -2 }}
              className="p-2.5 sm:p-3 rounded-xl bg-surface border border-line flex items-center gap-2 sm:gap-2.5"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary-tint">
                <item.icon size={13} className="text-primary" />
              </div>
              <div className="leading-tight min-w-0">
                <h3 className="text-xs font-semibold truncate">{item.title}</h3>
                <p className="text-[10px] text-ink-soft truncate">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

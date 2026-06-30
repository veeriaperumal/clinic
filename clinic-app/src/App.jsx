import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "./components/layout/Header";
import TokenBoard from "./components/layout/TokenBoard";
import Sidebar from "./components/layout/Sidebar";
import PageWrapper from "./components/layout/PageWrapper";
import Home from "./components/home/Home";
import Appointment from "./components/appointment/Appointment";
import LabTest from "./components/lab/LabTest";
import Consult from "./components/consult/Consult";
import Reports from "./components/reports/Reports";
import Medicine from "./components/medicine/Medicine";

const PAGES = {
  home: Home,
  appointment: Appointment,
  lab: LabTest,
  consult: Consult,
  reports: Reports,
  medicine: Medicine,
};

export default function App() {
  const [active, setActive] = useState("home");
  const [navOpen, setNavOpen] = useState(false);

  const ActivePage = PAGES[active];

  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [navOpen]);

  const handleNavigate = useCallback((id) => {
    setActive(id);
    setNavOpen(false);
  }, []);

  return (
    <div className="min-h-screen w-full bg-bg text-ink">
      <Header navOpen={navOpen} onToggleNav={() => setNavOpen((v) => !v)} />
      <TokenBoard />

      <div className="flex relative">
        <Sidebar
          active={active}
          onNavigate={handleNavigate}
          open={navOpen}
          onClose={() => setNavOpen(false)}
        />

        <main className="flex-1 w-full min-w-0 px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 min-h-[calc(100vh-8rem)]">
          <AnimatePresence mode="wait">
            <PageWrapper key={active}>
              <ActivePage go={handleNavigate} />
            </PageWrapper>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

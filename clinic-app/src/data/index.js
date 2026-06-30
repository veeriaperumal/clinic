import {
  Calendar, FlaskConical, Video, FileText, Pill,
  HomeIcon
} from "lucide-react";

export const DEPARTMENTS = [
  { id: "gen", name: "General Medicine", short: "GEN" },
  { id: "ent", name: "ENT", short: "ENT" },
  { id: "dia", name: "Diabetes Care", short: "DIA" },
  { id: "ped", name: "Paediatrics", short: "PED" },
  { id: "gyn", name: "Gynaecology", short: "GYN" },
];

export const DOCTORS = [
  { id: "d1", name: "Dr. Meera Krishnan", dept: "gen", deptName: "General Medicine", qual: "MBBS, MD", fee: 300, rating: 4.9, next: "Today, 4:40 PM", online: true, initials: "MK" },
  { id: "d2", name: "Dr. Arjun Suresh", dept: "ent", deptName: "ENT Specialist", qual: "MBBS, MS (ENT)", fee: 450, rating: 4.8, next: "Tomorrow, 11:00 AM", online: false, initials: "AS" },
  { id: "d3", name: "Dr. Lakshmi Iyer", dept: "dia", deptName: "Diabetologist", qual: "MBBS, DM", fee: 500, rating: 5.0, next: "Today, 6:10 PM", online: true, initials: "LI" },
  { id: "d4", name: "Dr. Karthik Rajan", dept: "ped", deptName: "Paediatrician", qual: "MBBS, MD (Paeds)", fee: 350, rating: 4.9, next: "Today, 5:20 PM", online: true, initials: "KR" },
  { id: "d5", name: "Dr. Priya Bhaskaran", dept: "gyn", deptName: "Gynaecologist", qual: "MBBS, DGO", fee: 500, rating: 4.7, next: "Tomorrow, 10:30 AM", online: false, initials: "PB" },
];

export const MORNING_SLOTS = ["9:00 AM", "9:20 AM", "9:40 AM", "10:00 AM", "10:20 AM", "11:00 AM"];
export const EVENING_SLOTS = ["5:00 PM", "5:20 PM", "5:40 PM", "6:00 PM", "6:20 PM", "7:00 PM"];

export const LAB_TESTS = [
  { id: "t1", name: "Complete Blood Count (CBC)", code: "CBC-01", price: 350, fasting: false },
  { id: "t2", name: "Fasting Blood Sugar", code: "FBS-02", price: 150, fasting: true },
  { id: "t3", name: "Lipid Profile", code: "LIP-03", price: 600, fasting: true },
  { id: "t4", name: "Thyroid Profile (T3, T4, TSH)", code: "THY-04", price: 500, fasting: false },
  { id: "t5", name: "HbA1c", code: "HBA-05", price: 450, fasting: false },
  { id: "t6", name: "Liver Function Test", code: "LFT-06", price: 550, fasting: true },
  { id: "t7", name: "Urine Routine", code: "URN-07", price: 200, fasting: false },
  { id: "t8", name: "Vitamin D, 25-OH", code: "VTD-08", price: 900, fasting: false },
];

export const MEDICINES = [
  { id: "m1", name: "Paracetamol 650mg", form: "Tablet · 10s strip", price: 25, stock: "in" },
  { id: "m2", name: "Azithromycin 500mg", form: "Tablet · 3s strip", price: 85, stock: "low" },
  { id: "m3", name: "Metformin 500mg", form: "Tablet · 15s strip", price: 40, stock: "in" },
  { id: "m4", name: "Amoxicillin 500mg", form: "Capsule · 10s strip", price: 60, stock: "out", sub: "Amoxiclav 625mg" },
  { id: "m5", name: "Cetirizine 10mg", form: "Tablet · 10s strip", price: 18, stock: "in" },
  { id: "m6", name: "Pantoprazole 40mg", form: "Tablet · 15s strip", price: 95, stock: "in" },
  { id: "m7", name: "Atorvastatin 10mg", form: "Tablet · 10s strip", price: 70, stock: "low" },
  { id: "m8", name: "Insulin Glargine 100IU/mL", form: "Injection pen · 3mL", price: 650, stock: "out", sub: "Insulin Lispro pen" },
];

export const REPORTS = [
  {
    id: "r1", test: "Complete Blood Count", date: "26 Jun 2026", status: "ready",
    params: [
      { name: "Haemoglobin", result: "10.8", unit: "g/dL", range: "12.0–15.5", flag: "low" },
      { name: "WBC Count", result: "7,200", unit: "/µL", range: "4,000–11,000", flag: "normal" },
      { name: "Platelet Count", result: "2.4", unit: "lakh/µL", range: "1.5–4.1", flag: "normal" },
      { name: "RBC Count", result: "4.6", unit: "mill/µL", range: "4.2–5.4", flag: "normal" },
    ],
  },
  {
    id: "r2", test: "Thyroid Profile", date: "18 Jun 2026", status: "ready",
    params: [
      { name: "TSH", result: "2.4", unit: "µIU/mL", range: "0.4–4.0", flag: "normal" },
      { name: "T3", result: "1.1", unit: "ng/mL", range: "0.8–2.0", flag: "normal" },
      { name: "T4", result: "8.2", unit: "µg/dL", range: "5.0–12.0", flag: "normal" },
    ],
  },
  { id: "r3", test: "Lipid Profile", date: "29 Jun 2026", status: "processing", params: [] },
  { id: "r4", test: "HbA1c", date: "30 Jun 2026", status: "awaiting", params: [] },
];

export const NAV = [
  { id: "home", label: "Overview", icon: HomeIcon },
  { id: "appointment", label: "Book Appointment", icon: Calendar },
  { id: "lab", label: "Lab Tests", icon: FlaskConical },
  { id: "consult", label: "Consult Online", icon: Video },
  { id: "reports", label: "My Reports", icon: FileText },
  { id: "medicine", label: "Medicine Check", icon: Pill },
];

export const TOKEN_KEYS = ["GEN", "ENT", "DIA", "PED", "GYN"];

export function nextDays(n) {
  const days = [];
  const base = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    days.push({
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-IN", { weekday: "short" }),
      date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      key: d.toISOString().slice(0, 10),
    });
  }
  return days;
}

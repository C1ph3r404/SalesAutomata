export type Tint = "clay" | "sage" | "sand" | "plum";

export const tints: Record<Tint, string> = {
  clay: "bg-accent-soft text-accent-ink",
  sage: "bg-jade-soft text-jade",
  sand: "bg-amber-soft text-amber",
  plum: "bg-surface-2 text-ink-2",
};

/* ------------------------------------------------------------------ leads */

export type Lead = {
  id: string;
  name: string;
  score: number;
  stage: "HOT" | "QUALIFYING" | "BOOKED" | "NEW";
  requirement: string;
  source: string;
  owner: string;
  time: string;
};

export const leads: Lead[] = [
  { id: "l1", name: "Ahmed Raza", score: 87, stage: "HOT", requirement: "2BHK · DHA Phase 6", source: "WhatsApp", owner: "Usman Tariq", time: "1m" },
  { id: "l2", name: "Fatima Noor", score: 82, stage: "HOT", requirement: "3BHK · DHA Phase 5", source: "WhatsApp", owner: "Ayesha Karim", time: "5m" },
  { id: "l3", name: "Omar Farooq", score: 68, stage: "QUALIFYING", requirement: "4BHK · Askari 11", source: "WhatsApp", owner: "Ahmed Raza", time: "8m" },
  { id: "l4", name: "Usman Tariq", score: 91, stage: "BOOKED", requirement: "Viewing · Thu 5:00 PM", source: "WhatsApp", owner: "Usman Tariq", time: "12m" },
  { id: "l5", name: "Zara Khan", score: 42, stage: "NEW", requirement: "3BHK · Bahria Town", source: "Instagram", owner: "Fatima Noor", time: "26m" },
  { id: "l6", name: "Bilal Ahmed", score: 31, stage: "NEW", requirement: "Plot · DHA Phase 6", source: "WhatsApp", owner: "Danish Mehmood", time: "34m" },
  { id: "l7", name: "Sana Malik", score: 59, stage: "QUALIFYING", requirement: "Commercial · Blue Area", source: "WhatsApp", owner: "Ayesha Karim", time: "1h" },
  { id: "l8", name: "Hina Sattar", score: 55, stage: "QUALIFYING", requirement: "2BHK rental · Gulberg", source: "Web form", owner: "Ahmed Raza", time: "2h" },
];

/* ------------------------------------------------------------------ users */

export type User = {
  id: string;
  name: string;
  initials: string;
  role: string;
  phone: string;
  email: string;
  timezone: string;
  status: "Active" | "Invited" | "Paused";
  seat: string;
  joined: string;
  lastActive: string;
  leads: number;
  response: string;
  conversion: string;
  bookings: number;
  tint: Tint;
};

export const users: User[] = [
  {
    id: "usman-tariq",
    name: "Usman Tariq",
    initials: "UT",
    role: "Team Lead",
    phone: "+92 300 1234567",
    email: "usman@alnoor.pk",
    timezone: "Asia/Karachi",
    status: "Active",
    seat: "Owner",
    joined: "Jan 2025",
    lastActive: "now",
    leads: 42,
    response: "4s",
    conversion: "31%",
    bookings: 18,
    tint: "plum",
  },
  {
    id: "ahmed-raza",
    name: "Ahmed Raza",
    initials: "AR",
    role: "Senior Closer",
    phone: "+92 321 9876543",
    email: "ahmed@alnoor.pk",
    timezone: "Asia/Karachi",
    status: "Active",
    seat: "Agent",
    joined: "Mar 2025",
    lastActive: "12m ago",
    leads: 38,
    response: "6s",
    conversion: "27%",
    bookings: 14,
    tint: "sage",
  },
  {
    id: "ayesha-karim",
    name: "Ayesha Karim",
    initials: "AK",
    role: "Sales Agent",
    phone: "+92 333 5550199",
    email: "ayesha@alnoor.pk",
    timezone: "Asia/Karachi",
    status: "Active",
    seat: "Agent",
    joined: "Jun 2025",
    lastActive: "1h ago",
    leads: 29,
    response: "9s",
    conversion: "22%",
    bookings: 9,
    tint: "clay",
  },
  {
    id: "fatima-noor",
    name: "Fatima Noor",
    initials: "FN",
    role: "Sales Agent",
    phone: "+92 345 2204811",
    email: "fatima@alnoor.pk",
    timezone: "Asia/Karachi",
    status: "Active",
    seat: "Agent",
    joined: "Aug 2025",
    lastActive: "3h ago",
    leads: 21,
    response: "11s",
    conversion: "18%",
    bookings: 6,
    tint: "sand",
  },
  {
    id: "danish-mehmood",
    name: "Danish Mehmood",
    initials: "DM",
    role: "Sales Agent",
    phone: "+92 312 7740032",
    email: "danish@alnoor.pk",
    timezone: "Asia/Karachi",
    status: "Invited",
    seat: "Agent",
    joined: "—",
    lastActive: "never",
    leads: 0,
    response: "—",
    conversion: "—",
    bookings: 0,
    tint: "plum",
  },
  {
    id: "sana-malik",
    name: "Sana Malik",
    initials: "SM",
    role: "Sales Agent",
    phone: "+92 300 6612845",
    email: "sana@alnoor.pk",
    timezone: "Asia/Karachi",
    status: "Paused",
    seat: "Agent",
    joined: "Feb 2025",
    lastActive: "6d ago",
    leads: 17,
    response: "14s",
    conversion: "12%",
    bookings: 4,
    tint: "sage",
  },
];

export const activity = [
  { id: "a1", text: "Booked a viewing for Usman Tariq", time: "12m ago", kind: "Booking" },
  { id: "a2", text: "Replied to Sana Malik in 4s", time: "1h ago", kind: "Reply" },
  { id: "a3", text: "Handed off Hina Sattar to a human", time: "3h ago", kind: "Handoff" },
  { id: "a4", text: "Qualified Omar Farooq — budget 4.5 Cr", time: "5h ago", kind: "Qualified" },
];

/* --------------------------------------------------------- automations */

export const workflows = [
  {
    id: "w1",
    name: "Auto-qualify inbound leads",
    status: "Active",
    runs: 214,
    last: "6m ago",
    desc: "Score, tag and route every new WhatsApp lead.",
  },
  {
    id: "w2",
    name: "Book viewings from offered slots",
    status: "Active",
    runs: 96,
    last: "18m ago",
    desc: "Create the calendar event and send reminders.",
  },
  {
    id: "w3",
    name: "Escalate hot leads to the team",
    status: "Paused",
    runs: 12,
    last: "3d ago",
    desc: "Ping the owner on WhatsApp when score crosses 80.",
  },
];

/* ------------------------------------------------------------ dashboard */

export const bubbles = [
  { id: "b1", tone: "blue" as const, text: "Have you seen the DHA Phase 6 listing?", meta: "Ahmed · 1m" },
  { id: "b2", tone: "dark" as const, text: "Yes — 2BHK, corner unit, ready to move.", meta: "Al-Noor Bot" },
  { id: "b3", tone: "blue" as const, text: "Is 3.2 crore negotiable?", meta: "Ahmed · 1m" },
  { id: "b4", tone: "dark" as const, text: "Slightly. I can hold a viewing at 5 PM.", meta: "Al-Noor Bot" },
];

export const metaRows = [
  { label: "Estimation", value: "61%", note: "Qualification rate" },
  { label: "Approx", value: "$48K", note: "Estimated close" },
  { label: "Cadence", value: "6 steps", note: "Auto follow-up" },
];

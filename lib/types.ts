export type LeadStage = "NEW" | "QUALIFYING" | "HOT" | "BOOKED" | "LOST";
export type UserStatus = "Active" | "Invited" | "Paused";
export type Tint = "clay" | "sage" | "sand" | "plum";
export type MessageDirection = "in" | "out";
export type MessageChannel = "whatsapp" | "sim";

export type UserSummary = {
  id: string;
  name: string;
  initials: string;
  role: string;
  tint: Tint;
};

export type User = {
  id: string;
  name: string;
  initials: string;
  role: string;
  phone: string;
  email: string;
  timezone: string;
  status: UserStatus;
  seat: string;
  joined: string;
  lastActive: string;
  leads: number;
  response: string;
  conversion: string;
  bookings: number;
  tint: Tint;
  createdAt: string;
  updatedAt: string;
};

export type LeadFields = {
  intent: string | null;
  budget: string | null;
  timeline: string | null;
  location: string | null;
  requirement: string | null;
};

export type Lead = LeadFields & {
  id: string;
  externalId: string | null;
  name: string;
  phone: string | null;
  source: string;
  notes: string | null;
  stage: LeadStage;
  score: number;
  scoreReason: string;
  ownerId: string | null;
  owner?: UserSummary | null;
  handoffRequested: boolean;
  handoffSummary: string | null;
  handoffAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: string;
  leadId: string;
  conversationId: string | null;
  direction: MessageDirection;
  body: string;
  channel: MessageChannel;
  waMessageId: string | null;
  status: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  leadId: string;
  status: "bot" | "human" | "closed";
  assignedTo: string | null;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
};

export type Appointment = {
  id: string;
  leadId: string;
  startsAt: string;
  endsAt: string;
  status: "booked" | "cancelled" | "done";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Followup = {
  id: string;
  leadId: string;
  runAt: string;
  reason: string;
  step: string;
  status: "pending" | "sent" | "cancelled";
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadDetail = Lead & {
  conversation: Conversation | null;
  messages: Message[];
  appointments: Appointment[];
  followups: Followup[];
};

export type UserDetail = User & {
  assignedLeads: Lead[];
};

export type Workflow = {
  id: string;
  name: string;
  status: string;
  runs: number;
  last: string;
  desc: string;
  createdAt: string;
  updatedAt: string;
};

export type Metrics = {
  leads: {
    total: number;
    new: number;
    hot: number;
    qualifying: number;
    booked: number;
    lost: number;
  };
  appointments: {
    total: number;
    booked: number;
    today: number;
  };
  followups: {
    pending: number;
    sent: number;
  };
  users: {
    total: number;
    active: number;
  };
  qualificationRate: number;
  bookingRate: number;
  medianFirstReplySeconds: number;
};

export type TurnResult = {
  lead: LeadDetail;
  messages: Message[];
  reply: string;
  appointment: Appointment | null;
  followup: Followup | null;
  handoff: boolean;
};

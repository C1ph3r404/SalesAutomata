export interface Agent {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  specialization: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  developer: string | null;
  project_type: string;
  status: string;
  city: string;
  locality: string | null;
  address: string | null;
  possession_date: string | null;
  amenities: string[];
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  project_id: string | null;
  title: string;
  property_type: string;
  listing_type: string;
  price: number;
  price_per_sqft: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  balconies: number | null;
  area_sqft: number | null;
  floor: number | null;
  total_floors: number | null;
  furnishing: string | null;
  facing: string | null;
  parking: number | null;
  availability: string;
  status: string;
  city: string;
  locality: string | null;
  address: string | null;
  description: string | null;
  features: string[];
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  source: string;
  status: string;
  listing_type: string | null;
  property_type: string | null;
  budget_min: number | null;
  budget_max: number | null;
  preferred_city: string | null;
  preferred_locality: string | null;
  bedrooms: number | null;
  purpose: string | null;
  timeline: string | null;
  qualification_score: number;
  assigned_agent_id: string | null;
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  lead_id: string;
  channel: string;
  status: string;
  started_at: string;
  last_message_at: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  lead_id: string;
  direction: string;
  sender: string;
  body: string;
  message_type: string;
  whatsapp_message_id: string | null;
  created_at: string;
}

export interface Appointment {
  id: string;
  lead_id: string;
  property_id: string | null;
  agent_id: string | null;
  appointment_type: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface FollowUp {
  id: string;
  lead_id: string;
  due_at: string;
  channel: string;
  note: string | null;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_by: string;
  created_at: string;
}

export interface InterestedLead {
  id: string;
  lead_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  budget_min: number | null;
  budget_max: number | null;
  preferred_city: string | null;
  preferred_locality: string | null;
  property_type: string | null;
  bedrooms: number | null;
  purpose: string | null;
  property_id: string | null;
  message: string | null;
  source: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  is_active: boolean;
  created_at: string;
}

export type LeadDetail = Lead & {
  agents: Agent | null;
  conversations: Conversation[];
  appointments: Appointment[];
  follow_ups: FollowUp[];
  lead_activities: LeadActivity[];
};

export type PropertyDetail = Property & {
  projects: Project | null;
};

export type ProjectDetail = Project & {
  properties: Property[];
};

export type AgentDetail = Agent & {
  leads: Lead[];
};

export type ConversationDetail = Conversation & {
  leads: Lead | null;
  messages: Message[];
};

export interface ListResponse<T> {
  data: T[];
  count: number | null;
  limit: number;
  offset: number;
}

export interface DashboardSummary {
  leads: {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    site_visit_scheduled: number;
    negotiation: number;
    won: number;
    lost: number;
  };
  properties: {
    total: number;
    available: number;
  };
  projects: {
    total: number;
  };
  agents: {
    total: number;
    active: number;
  };
  conversations: {
    open: number;
  };
  follow_ups: {
    pending: number;
  };
  appointments: {
    scheduled: number;
  };
}

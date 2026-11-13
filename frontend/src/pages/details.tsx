import { DataTable, type Column } from "../components/DataTable";
import { KeyValue } from "../components/KeyValue";
import { ErrorMessage, Loading } from "../components/Status";
import { formatDate, formatMoney, shortId, text } from "../format";
import { useApi } from "../hooks/useApi";
import { navigate } from "../router";
import type {
  AgentDetail,
  Appointment,
  Conversation,
  ConversationDetail,
  FollowUp,
  Lead,
  LeadActivity,
  LeadDetail,
  Message,
  ProjectDetail,
  Property,
  PropertyDetail,
} from "../types";

function PageHeader({
  title,
  backPath,
  backLabel,
  onRefresh,
}: {
  title: string;
  backPath: string;
  backLabel: string;
  onRefresh: () => void;
}) {
  return (
    <p>
      <button type="button" onClick={() => navigate(backPath)}>
        {backLabel}
      </button>{" "}
      <button type="button" onClick={onRefresh}>
        Refresh
      </button>
      <span> — {title}</span>
    </p>
  );
}

const conversationColumns: Column<Conversation>[] = [
  { key: "id", label: "ID", render: (row) => shortId(row.id) },
  { key: "channel", label: "Channel" },
  { key: "status", label: "Status" },
  { key: "started_at", label: "Started", render: (row) => formatDate(row.started_at) },
  {
    key: "last_message_at",
    label: "Last message",
    render: (row) => formatDate(row.last_message_at),
  },
];

const appointmentColumns: Column<Appointment>[] = [
  { key: "scheduled_at", label: "Scheduled", render: (row) => formatDate(row.scheduled_at) },
  { key: "appointment_type", label: "Type" },
  { key: "status", label: "Status" },
  { key: "duration_minutes", label: "Minutes" },
  { key: "location", label: "Location", render: (row) => text(row.location) },
];

const followUpColumns: Column<FollowUp>[] = [
  { key: "due_at", label: "Due", render: (row) => formatDate(row.due_at) },
  { key: "channel", label: "Channel" },
  { key: "status", label: "Status" },
  { key: "note", label: "Note", render: (row) => text(row.note) },
];

const activityColumns: Column<LeadActivity>[] = [
  { key: "created_at", label: "Created", render: (row) => formatDate(row.created_at) },
  { key: "activity_type", label: "Type" },
  { key: "description", label: "Description", render: (row) => text(row.description) },
  { key: "created_by", label: "Created by" },
];

const leadColumns: Column<Lead>[] = [
  { key: "name", label: "Name", render: (row) => text(row.name) },
  { key: "phone", label: "Phone" },
  { key: "status", label: "Status" },
  { key: "source", label: "Source" },
  { key: "qualification_score", label: "Score" },
];

const propertyColumns: Column<Property>[] = [
  { key: "title", label: "Title" },
  { key: "property_type", label: "Type" },
  { key: "listing_type", label: "Listing" },
  { key: "price", label: "Price", render: (row) => formatMoney(row.price) },
  { key: "city", label: "City" },
  { key: "availability", label: "Availability" },
];

const messageColumns: Column<Message>[] = [
  { key: "created_at", label: "Created", render: (row) => formatDate(row.created_at) },
  { key: "direction", label: "Direction" },
  { key: "sender", label: "Sender" },
  { key: "body", label: "Body" },
  { key: "message_type", label: "Type" },
];

export function LeadDetailPage({ id }: { id: string }) {
  const { data, loading, error, reload } = useApi<LeadDetail>(`/api/leads/${id}`);

  if (loading) {
    return <Loading label="Loading lead..." />;
  }
  if (error) {
    return <ErrorMessage message={error} onRetry={() => void reload()} />;
  }
  if (!data) {
    return <p>Lead not found.</p>;
  }

  return (
    <section>
      <h2>Lead</h2>
      <PageHeader
        title={text(data.name) + " / " + data.phone}
        backPath="/leads"
        backLabel="Back to leads"
        onRefresh={() => void reload()}
      />

      <KeyValue
        entries={[
          ["ID", data.id],
          ["Name", text(data.name)],
          ["Phone", data.phone],
          ["Email", text(data.email)],
          ["Source", data.source],
          ["Status", data.status],
          ["Listing type", text(data.listing_type)],
          ["Property type", text(data.property_type)],
          ["Budget min", formatMoney(data.budget_min)],
          ["Budget max", formatMoney(data.budget_max)],
          ["Preferred city", text(data.preferred_city)],
          ["Preferred locality", text(data.preferred_locality)],
          ["Bedrooms", text(data.bedrooms)],
          ["Purpose", text(data.purpose)],
          ["Timeline", text(data.timeline)],
          ["Qualification score", data.qualification_score],
          [
            "Assigned agent",
            data.agents ? (
              <button
                type="button"
                onClick={() => navigate(`/agents/${data.agents?.id}`)}
              >
                {data.agents.name}
              </button>
            ) : (
              "—"
            ),
          ],
          ["Last contacted", formatDate(data.last_contacted_at)],
          ["Next follow-up", formatDate(data.next_follow_up_at)],
          ["Notes", text(data.notes)],
          ["Created", formatDate(data.created_at)],
          ["Updated", formatDate(data.updated_at)],
        ]}
      />

      <h3>Conversations ({data.conversations.length})</h3>
      <DataTable
        columns={conversationColumns}
        rows={data.conversations}
        getKey={(row) => row.id}
        actions={(row) => (
          <button
            type="button"
            onClick={() => navigate(`/conversations/${row.id}`)}
          >
            View
          </button>
        )}
      />

      <h3>Appointments ({data.appointments.length})</h3>
      <DataTable
        columns={appointmentColumns}
        rows={data.appointments}
        getKey={(row) => row.id}
        actions={(row) =>
          row.property_id ? (
            <button
              type="button"
              onClick={() => navigate(`/properties/${row.property_id}`)}
            >
              Property
            </button>
          ) : null
        }
      />

      <h3>Follow-ups ({data.follow_ups.length})</h3>
      <DataTable
        columns={followUpColumns}
        rows={data.follow_ups}
        getKey={(row) => row.id}
      />

      <h3>Activities ({data.lead_activities.length})</h3>
      <DataTable
        columns={activityColumns}
        rows={data.lead_activities}
        getKey={(row) => row.id}
      />
    </section>
  );
}

export function PropertyDetailPage({ id }: { id: string }) {
  const { data, loading, error, reload } = useApi<PropertyDetail>(
    `/api/properties/${id}`,
  );

  if (loading) {
    return <Loading label="Loading property..." />;
  }
  if (error) {
    return <ErrorMessage message={error} onRetry={() => void reload()} />;
  }
  if (!data) {
    return <p>Property not found.</p>;
  }

  return (
    <section>
      <h2>Property</h2>
      <PageHeader
        title={data.title}
        backPath="/properties"
        backLabel="Back to properties"
        onRefresh={() => void reload()}
      />

      <KeyValue
        entries={[
          ["ID", data.id],
          ["Title", data.title],
          ["Type", data.property_type],
          ["Listing", data.listing_type],
          ["Price", formatMoney(data.price)],
          ["Price per sqft", formatMoney(data.price_per_sqft)],
          ["Bedrooms", text(data.bedrooms)],
          ["Bathrooms", text(data.bathrooms)],
          ["Balconies", text(data.balconies)],
          ["Area (sqft)", text(data.area_sqft)],
          ["Floor", text(data.floor)],
          ["Total floors", text(data.total_floors)],
          ["Furnishing", text(data.furnishing)],
          ["Facing", text(data.facing)],
          ["Parking", text(data.parking)],
          ["Availability", data.availability],
          ["Status", data.status],
          ["City", data.city],
          ["Locality", text(data.locality)],
          ["Address", text(data.address)],
          ["Description", text(data.description)],
          ["Features", text(data.features)],
          ["Images", text(data.images)],
          [
            "Project",
            data.projects ? (
              <button
                type="button"
                onClick={() => navigate(`/projects/${data.projects?.id}`)}
              >
                {data.projects.name}
              </button>
            ) : (
              "—"
            ),
          ],
          ["Created", formatDate(data.created_at)],
          ["Updated", formatDate(data.updated_at)],
        ]}
      />

      <h3>Project</h3>
      {data.projects ? (
        <KeyValue
          entries={[
            ["Name", data.projects.name],
            ["Developer", text(data.projects.developer)],
            ["Type", data.projects.project_type],
            ["Status", data.projects.status],
            ["City", data.projects.city],
            ["Locality", text(data.projects.locality)],
            ["Possession", text(data.projects.possession_date)],
          ]}
        />
      ) : (
        <p>No project linked.</p>
      )}
    </section>
  );
}

export function ProjectDetailPage({ id }: { id: string }) {
  const { data, loading, error, reload } = useApi<ProjectDetail>(
    `/api/projects/${id}`,
  );

  if (loading) {
    return <Loading label="Loading project..." />;
  }
  if (error) {
    return <ErrorMessage message={error} onRetry={() => void reload()} />;
  }
  if (!data) {
    return <p>Project not found.</p>;
  }

  return (
    <section>
      <h2>Project</h2>
      <PageHeader
        title={data.name}
        backPath="/projects"
        backLabel="Back to projects"
        onRefresh={() => void reload()}
      />

      <KeyValue
        entries={[
          ["ID", data.id],
          ["Name", data.name],
          ["Developer", text(data.developer)],
          ["Type", data.project_type],
          ["Status", data.status],
          ["City", data.city],
          ["Locality", text(data.locality)],
          ["Address", text(data.address)],
          ["Possession", text(data.possession_date)],
          ["Amenities", text(data.amenities)],
          ["Description", text(data.description)],
          ["Created", formatDate(data.created_at)],
          ["Updated", formatDate(data.updated_at)],
        ]}
      />

      <h3>Properties ({data.properties.length})</h3>
      <DataTable
        columns={propertyColumns}
        rows={data.properties}
        getKey={(row) => row.id}
        actions={(row) => (
          <button
            type="button"
            onClick={() => navigate(`/properties/${row.id}`)}
          >
            View
          </button>
        )}
      />
    </section>
  );
}

export function AgentDetailPage({ id }: { id: string }) {
  const { data, loading, error, reload } = useApi<AgentDetail>(
    `/api/agents/${id}`,
  );

  if (loading) {
    return <Loading label="Loading agent..." />;
  }
  if (error) {
    return <ErrorMessage message={error} onRetry={() => void reload()} />;
  }
  if (!data) {
    return <p>Agent not found.</p>;
  }

  return (
    <section>
      <h2>Agent</h2>
      <PageHeader
        title={data.name}
        backPath="/agents"
        backLabel="Back to agents"
        onRefresh={() => void reload()}
      />

      <KeyValue
        entries={[
          ["ID", data.id],
          ["Name", data.name],
          ["Phone", text(data.phone)],
          ["Email", text(data.email)],
          ["Specialization", text(data.specialization)],
          ["Active", text(data.is_active)],
          ["Created", formatDate(data.created_at)],
          ["Updated", formatDate(data.updated_at)],
        ]}
      />

      <h3>Leads ({data.leads.length})</h3>
      <DataTable
        columns={leadColumns}
        rows={data.leads}
        getKey={(row) => row.id}
        actions={(row) => (
          <button type="button" onClick={() => navigate(`/leads/${row.id}`)}>
            View
          </button>
        )}
      />
    </section>
  );
}

export function ConversationDetailPage({ id }: { id: string }) {
  const { data, loading, error, reload } = useApi<ConversationDetail>(
    `/api/conversations/${id}`,
  );

  if (loading) {
    return <Loading label="Loading conversation..." />;
  }
  if (error) {
    return <ErrorMessage message={error} onRetry={() => void reload()} />;
  }
  if (!data) {
    return <p>Conversation not found.</p>;
  }

  return (
    <section>
      <h2>Conversation</h2>
      <PageHeader
        title={shortId(data.id)}
        backPath="/conversations"
        backLabel="Back to conversations"
        onRefresh={() => void reload()}
      />

      <KeyValue
        entries={[
          ["ID", data.id],
          ["Lead", shortId(data.lead_id)],
          ["Channel", data.channel],
          ["Status", data.status],
          ["Started", formatDate(data.started_at)],
          ["Last message", formatDate(data.last_message_at)],
          ["Created", formatDate(data.created_at)],
          [
            "Open lead",
            data.leads ? (
              <button
                type="button"
                onClick={() => navigate(`/leads/${data.leads?.id}`)}
              >
                {text(data.leads.name)} / {data.leads.phone}
              </button>
            ) : (
              "—"
            ),
          ],
        ]}
      />

      <h3>Messages ({data.messages.length})</h3>
      <DataTable
        columns={messageColumns}
        rows={data.messages}
        getKey={(row) => row.id}
      />
    </section>
  );
}

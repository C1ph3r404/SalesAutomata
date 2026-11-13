import { DataTable, type Column } from "../components/DataTable";
import { ErrorMessage, Loading } from "../components/Status";
import { formatDate, formatMoney, text } from "../format";
import { useApi } from "../hooks/useApi";
import { navigate } from "../router";
import type { DashboardSummary, Lead, ListResponse } from "../types";

const recentLeadColumns: Column<Lead>[] = [
  { key: "name", label: "Name", render: (row) => text(row.name) },
  { key: "phone", label: "Phone" },
  { key: "status", label: "Status" },
  { key: "source", label: "Source" },
  { key: "qualification_score", label: "Score" },
  { key: "budget_max", label: "Budget", render: (row) => formatMoney(row.budget_max) },
  { key: "created_at", label: "Created", render: (row) => formatDate(row.created_at) },
];

export function DashboardPage() {
  const summary = useApi<DashboardSummary>("/api/dashboard/summary");
  const recent = useApi<ListResponse<Lead>>("/api/leads", {
    limit: 5,
    order: "created_at.desc",
  });

  return (
    <section>
      <h2>Dashboard</h2>
      <p>
        <button type="button" onClick={() => void summary.reload()}>
          Refresh summary
        </button>{" "}
        <button type="button" onClick={() => void recent.reload()}>
          Refresh recent leads
        </button>
      </p>

      {summary.loading ? <Loading label="Loading summary..." /> : null}
      {summary.error ? (
        <ErrorMessage message={summary.error} onRetry={() => void summary.reload()} />
      ) : null}
      {summary.data ? (
        <>
          <h3>Leads</h3>
          <dl>
            <div>
              <dt>Total</dt>
              <dd>{summary.data.leads.total}</dd>
            </div>
            <div>
              <dt>New</dt>
              <dd>{summary.data.leads.new}</dd>
            </div>
            <div>
              <dt>Contacted</dt>
              <dd>{summary.data.leads.contacted}</dd>
            </div>
            <div>
              <dt>Qualified</dt>
              <dd>{summary.data.leads.qualified}</dd>
            </div>
            <div>
              <dt>Site visit scheduled</dt>
              <dd>{summary.data.leads.site_visit_scheduled}</dd>
            </div>
            <div>
              <dt>Negotiation</dt>
              <dd>{summary.data.leads.negotiation}</dd>
            </div>
            <div>
              <dt>Won</dt>
              <dd>{summary.data.leads.won}</dd>
            </div>
            <div>
              <dt>Lost</dt>
              <dd>{summary.data.leads.lost}</dd>
            </div>
          </dl>

          <h3>Inventory</h3>
          <dl>
            <div>
              <dt>Properties</dt>
              <dd>
                {summary.data.properties.total} ({summary.data.properties.available} available)
              </dd>
            </div>
            <div>
              <dt>Projects</dt>
              <dd>{summary.data.projects.total}</dd>
            </div>
            <div>
              <dt>Agents</dt>
              <dd>
                {summary.data.agents.total} ({summary.data.agents.active} active)
              </dd>
            </div>
            <div>
              <dt>Open conversations</dt>
              <dd>{summary.data.conversations.open}</dd>
            </div>
            <div>
              <dt>Pending follow-ups</dt>
              <dd>{summary.data.follow_ups.pending}</dd>
            </div>
            <div>
              <dt>Scheduled appointments</dt>
              <dd>{summary.data.appointments.scheduled}</dd>
            </div>
          </dl>

          <p>
            <button type="button" onClick={() => navigate("/leads")}>
              All leads
            </button>{" "}
            <button type="button" onClick={() => navigate("/properties")}>
              Properties
            </button>{" "}
            <button type="button" onClick={() => navigate("/appointments")}>
              Appointments
            </button>{" "}
            <button type="button" onClick={() => navigate("/follow-ups")}>
              Follow-ups
            </button>
          </p>
        </>
      ) : null}

      <h3>Recent leads</h3>
      {recent.loading ? <Loading label="Loading recent leads..." /> : null}
      {recent.error ? (
        <ErrorMessage message={recent.error} onRetry={() => void recent.reload()} />
      ) : null}
      {recent.data ? (
        <DataTable
          columns={recentLeadColumns}
          rows={recent.data.data}
          getKey={(row) => row.id}
          actions={(row) => (
            <button type="button" onClick={() => navigate(`/leads/${row.id}`)}>
              View
            </button>
          )}
        />
      ) : null}
    </section>
  );
}

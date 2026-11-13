import { Layout } from "./components/Layout";
import {
  AgentDetailPage,
  ConversationDetailPage,
  LeadDetailPage,
  ProjectDetailPage,
  PropertyDetailPage,
} from "./pages/details";
import { DashboardPage } from "./pages/DashboardPage";
import {
  ActivitiesPage,
  AgentsPage,
  AppointmentsPage,
  ConversationsPage,
  FollowUpsPage,
  InterestedLeadsPage,
  LeadsPage,
  MessagesPage,
  ProjectsPage,
  PropertiesPage,
  TemplatesPage,
} from "./pages/lists";
import { useHashRoute } from "./router";

function renderRoute(route: string) {
  const [resource, id] = route.split("/").filter(Boolean);

  switch (resource) {
    case undefined:
      return <DashboardPage />;
    case "leads":
      return id ? <LeadDetailPage id={id} /> : <LeadsPage />;
    case "properties":
      return id ? <PropertyDetailPage id={id} /> : <PropertiesPage />;
    case "projects":
      return id ? <ProjectDetailPage id={id} /> : <ProjectsPage />;
    case "agents":
      return id ? <AgentDetailPage id={id} /> : <AgentsPage />;
    case "conversations":
      return id ? <ConversationDetailPage id={id} /> : <ConversationsPage />;
    case "messages":
      return <MessagesPage />;
    case "appointments":
      return <AppointmentsPage />;
    case "follow-ups":
      return <FollowUpsPage />;
    case "activities":
      return <ActivitiesPage />;
    case "interested-leads":
      return <InterestedLeadsPage />;
    case "message-templates":
      return <TemplatesPage />;
    default:
      return (
        <section>
          <h2>Page not found</h2>
          <p>Unknown route: {route}</p>
        </section>
      );
  }
}

export default function App() {
  const route = useHashRoute();

  return <Layout current={route}>{renderRoute(route)}</Layout>;
}

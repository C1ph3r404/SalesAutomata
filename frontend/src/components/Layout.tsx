import type { ReactNode } from "react";

import { API_BASE } from "../api";
import { navigate } from "../router";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard" },
  { path: "/leads", label: "Leads" },
  { path: "/properties", label: "Properties" },
  { path: "/projects", label: "Projects" },
  { path: "/agents", label: "Agents" },
  { path: "/conversations", label: "Conversations" },
  { path: "/messages", label: "Messages" },
  { path: "/appointments", label: "Appointments" },
  { path: "/follow-ups", label: "Follow-ups" },
  { path: "/activities", label: "Activities" },
  { path: "/interested-leads", label: "Interested leads" },
  { path: "/message-templates", label: "Templates" },
];

export function Layout({
  current,
  children,
}: {
  current: string;
  children: ReactNode;
}) {
  return (
    <>
      <header>
        <h1>SalesAutomata</h1>
        <p>Plain React data browser for the Supabase-backed API.</p>
        <nav>
          {NAV_ITEMS.map((item) => {
            const active =
              item.path === "/"
                ? current === "/"
                : current.startsWith(item.path);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>
      <hr />
      <main>{children}</main>
      <hr />
      <footer>
        <p>API: {API_BASE}</p>
      </footer>
    </>
  );
}

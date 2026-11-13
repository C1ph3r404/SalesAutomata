"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import type { Lead } from "@/lib/types";
import { formatTime } from "@/lib/format";
import { EmptyBlock, StatusPill, stageTone } from "@/components/ui";

const tabs = ["All", "Hot", "Qualifying", "Booked", "New"];

export function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [tab, setTab] = useState("All");
  const router = useRouter();

  const rows =
    tab === "All"
      ? initialLeads
      : initialLeads.filter(
          (lead) => lead.stage.toLowerCase() === tab.toLowerCase(),
        );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`tab ${tab === item ? "tab-active" : ""}`}
          >
            {item}
          </button>
        ))}
        <span className="micro ml-auto">
          {rows.length} of {initialLeads.length} leads
        </span>
      </div>

      {initialLeads.length === 0 ? (
        <div className="mt-3">
          <EmptyBlock label="No leads yet. Create one or reset the demo." />
        </div>
      ) : (
        <div className="panel mt-3 overflow-x-auto">
          <table className="table">
            <thead className="thead">
              <tr>
                <th className="tcell">Lead</th>
                <th className="tcell">Score</th>
                <th className="tcell">Stage</th>
                <th className="tcell">Requirement</th>
                <th className="tcell">Source</th>
                <th className="tcell">Owner</th>
                <th className="tcell text-right">Updated</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="tcell text-muted" colSpan={7}>
                    No leads in this stage.
                  </td>
                </tr>
              ) : (
                rows.map((lead) => (
                  <tr
                    key={lead.id}
                    className="trow cursor-pointer"
                    onClick={() => router.push(`/leads/${lead.id}`)}
                  >
                    <td className="tcell font-semibold text-ink">
                      {lead.name}
                    </td>
                    <td className="tcell">
                      <span className="num-lg text-[17px] text-ink">
                        {lead.score}
                      </span>
                    </td>
                    <td className="tcell">
                      <StatusPill tone={stageTone(lead.stage)}>
                        {lead.stage}
                      </StatusPill>
                    </td>
                    <td className="tcell text-ink-2">
                      {lead.requirement ?? "—"}
                    </td>
                    <td className="tcell text-muted">{lead.source}</td>
                    <td className="tcell text-ink-2">
                      {lead.owner?.name ?? "Unassigned"}
                    </td>
                    <td className="tcell text-right text-muted">
                      {formatTime(lead.updatedAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <p className="micro">Showing all stages · scored by the bot</p>
        <span className="micro-strong flex items-center gap-1 text-ink">
          Open pipeline
          <ArrowUpRight className="h-3 w-3" strokeWidth={2.6} />
        </span>
      </div>
    </div>
  );
}
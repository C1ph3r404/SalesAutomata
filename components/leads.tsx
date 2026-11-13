"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { leads } from "@/lib/data";
import { StatusPill, stageTone } from "@/components/ui";

const tabs = ["All", "Hot", "Qualifying", "Booked", "New"];

export function LeadsTable() {
  const [tab, setTab] = useState("All");

  const rows =
    tab === "All"
      ? leads
      : leads.filter((l) => l.stage.toLowerCase() === tab.toLowerCase());

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`tab ${tab === t ? "tab-active" : ""}`}
          >
            {t}
          </button>
        ))}
        <span className="micro ml-auto">
          {rows.length} of {leads.length} leads
        </span>
      </div>

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
              <th className="tcell text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id} className="trow">
                <td className="tcell font-semibold text-ink">{l.name}</td>
                <td className="tcell">
                  <span className="num-lg text-[17px] text-ink">{l.score}</span>
                </td>
                <td className="tcell">
                  <StatusPill tone={stageTone(l.stage)}>{l.stage}</StatusPill>
                </td>
                <td className="tcell text-ink-2">{l.requirement}</td>
                <td className="tcell text-muted">{l.source}</td>
                <td className="tcell text-ink-2">{l.owner}</td>
                <td className="tcell text-right text-muted">{l.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

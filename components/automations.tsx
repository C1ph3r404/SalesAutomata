"use client";

import { useState } from "react";
import { ArrowRight, Check, Copy, Webhook } from "lucide-react";
import type { Workflow } from "@/lib/types";
import { StatusPill } from "@/components/ui";

const branches = [
  {
    title: "WhatsApp reply",
    note: "Send the scored reply inside the 24h window",
  },
  {
    title: "CRM sync",
    note: "Push lead, stage and transcript to HubSpot",
  },
  {
    title: "Human handoff",
    note: "Ping the owner when the score crosses 80",
  },
];

export function N8nConnect({
  workflows,
  webhookUrl,
}: {
  workflows: Workflow[];
  webhookUrl: string;
}) {
  const [connected, setConnected] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function test() {
    if (testing) return;
    setTesting(true);
    setError(null);

    try {
      const response = await fetch("/api/health");
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error("Backend health check failed");
      }

      setConnected(true);
    } catch (cause) {
      setConnected(false);
      setError(cause instanceof Error ? cause.message : "Connection failed");
    } finally {
      setTesting(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Could not copy the webhook URL");
    }
  }

  return (
    <div>
      <section className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-ink text-white">
              <Webhook className="h-5 w-5" strokeWidth={2} />
            </span>
            <div>
              <p className="micro-strong">n8n · Workflow automation</p>
              <p className="micro mt-1">
                Run follow-ups, bookings and CRM writes in your own n8n
              </p>
            </div>
          </div>
          <StatusPill tone={connected ? "jade" : "amber"}>
            {connected ? "Connected" : "Not connected"}
          </StatusPill>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="instance">
              n8n instance URL
            </label>
            <input
              id="instance"
              className="field-input"
              placeholder="https://n8n.yourdomain.com"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="apikey">
              API key
            </label>
            <input
              id="apikey"
              className="field-input"
              type="password"
              placeholder="n8n_api_…"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="field-label" htmlFor="webhook">
            SalesAutomata webhook
          </label>
          <div className="flex items-center gap-2">
            <input
              id="webhook"
              className="field-input font-mono text-[11.5px] text-ink-2"
              readOnly
              value={webhookUrl}
            />
            <button
              type="button"
              className="tag tag-ghost shrink-0"
              onClick={copy}
            >
              {copied ? (
                <Check className="h-3 w-3" strokeWidth={2.4} />
              ) : (
                <Copy className="h-3 w-3" strokeWidth={2.4} />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="micro mt-2">
            Paste this into an n8n Webhook node — inbound leads arrive here.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={test}
            className="tag tag-blue"
            disabled={testing}
          >
            {testing ? "Checking…" : connected ? "Recheck" : "Connect n8n"}
          </button>
          <button type="button" onClick={test} className="tag tag-ghost">
            Test connection
          </button>
          {connected ? (
            <span className="micro flex items-center gap-1.5 text-jade">
              <Check className="h-3 w-3" strokeWidth={3} />
              Backend reachable
            </span>
          ) : (
            <span className="micro">
              {error ?? "Backend not checked yet"}
            </span>
          )}
        </div>
      </section>

      <section className="panel mt-4 p-5">
        <div className="flex items-center justify-between">
          <p className="micro-strong">Automation flow</p>
          <span className="micro">Trigger → Qualify → Route</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="flow-node">WhatsApp inbound</span>
          <ArrowRight className="flow-arrow h-4 w-4" strokeWidth={2.2} />
          <span className="flow-node flow-node-blue">n8n webhook</span>
          <ArrowRight className="flow-arrow h-4 w-4" strokeWidth={2.2} />
          <span className="flow-node">AI qualifier</span>
          <ArrowRight className="flow-arrow h-4 w-4" strokeWidth={2.2} />
          <span className="flow-node">Score &amp; route</span>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {branches.map((branch) => (
            <div
              key={branch.title}
              className="rounded-xl border border-line bg-paper px-3 py-2.5"
            >
              <p className="text-[11.5px] font-bold text-ink">
                {branch.title}
              </p>
              <p className="mt-1 text-[10.5px] leading-snug text-muted">
                {branch.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="micro-strong">Workflows</p>
          <span className="micro">{workflows.length} in this workspace</span>
        </div>

        {workflows.length === 0 ? (
          <div className="panel p-5">
            <p className="text-[12px] text-muted">
              No workflows yet. Reset the demo or create one in n8n.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {workflows.map((workflow) => (
              <article key={workflow.id} className="panel p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-bold leading-snug tracking-tight text-ink">
                    {workflow.name}
                  </p>
                  <StatusPill
                    tone={workflow.status === "Active" ? "jade" : "amber"}
                  >
                    {workflow.status}
                  </StatusPill>
                </div>
                <p className="mt-2 text-[11.5px] leading-snug text-muted">
                  {workflow.desc}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5">
                  <span className="micro">{workflow.runs} runs</span>
                  <span className="micro">Last {workflow.last}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
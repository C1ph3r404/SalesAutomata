"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import type { Lead, LeadDetail } from "@/lib/types";
import { LeadCard } from "@/components/lead-card";
import { ChatThread } from "@/components/chat-thread";
import { ResetButton } from "@/components/reset-button";
import { EmptyBlock, LoadingBlock } from "@/components/ui";

export function ChatSimulator({ initialLeads }: { initialLeads: Lead[] }) {
  const [selectedId, setSelectedId] = useState(initialLeads[0]?.id ?? "");
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [warping, setWarping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function load(id: string, quiet = false) {
    if (!quiet) setLoading(true);

    try {
      const response = await fetch(`/api/leads/${id}`, { cache: "no-store" });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error ?? "Could not load lead");
      }

      setLead(data.lead);
    } catch (cause) {
      if (!quiet) {
        setError(
          cause instanceof Error ? cause.message : "Could not load lead",
        );
      }
    } finally {
      if (!quiet) setLoading(false);
    }
  }

  useEffect(() => {
    if (!selectedId) {
      setLead(null);
      return;
    }

    setLead(null);
    setError(null);
    setNotice(null);
    void load(selectedId);
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;

    const timer = window.setInterval(() => {
      if (!sending) void load(selectedId, true);
    }, 2000);

    return () => window.clearInterval(timer);
  }, [selectedId, sending]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = input.trim();

    if (!lead || !message || sending) return;

    setSending(true);
    setError(null);
    setNotice(null);
    setInput("");

    try {
      const response = await fetch("/api/turn", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          message,
          channel: "sim",
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error ?? "The bot did not reply");
      }

      setLead(data.lead);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The bot did not reply");
      setInput(message);
    } finally {
      setSending(false);
    }
  }

  async function timeWarp() {
    if (!lead || warping) return;

    setWarping(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch("/api/time-warp?days=3", {
        method: "POST",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error ?? "Time-warp failed");
      }

      await load(lead.id, true);
      setNotice(`${data.flushed} follow-up(s) sent`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Time-warp failed");
    } finally {
      setWarping(false);
    }
  }

  const initials = lead?.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
      <section className="panel flex min-h-[580px] flex-col p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="micro-strong">WhatsApp simulator</p>
            <span className="tag tag-blue">Sandbox</span>
          </div>

          <select
            className="field-input max-w-[240px]"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
          >
            {initialLeads.length === 0 ? (
              <option value="">No leads</option>
            ) : (
              initialLeads.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {item.stage}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto">
          {loading ? (
            <LoadingBlock label="Loading conversation…" />
          ) : lead ? (
            <ChatThread
              messages={lead.messages}
              leadName={lead.name}
              leadInitials={initials}
              emptyText="No messages yet. Type as the customer below."
            />
          ) : (
            <EmptyBlock label="Select a lead or reset the demo." />
          )}
        </div>

        {sending ? (
          <p className="micro mt-3">Bot is typing…</p>
        ) : null}

        <form
          onSubmit={send}
          className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3"
        >
          <input
            className="field-input flex-1"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type as the customer…"
            disabled={!lead || sending}
          />
          <button
            type="submit"
            className="tag tag-blue shrink-0"
            disabled={!lead || sending || !input.trim()}
          >
            {sending ? "Sending…" : "Send"}
          </button>
        </form>

        {error ? (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11.5px] text-red-700">
            {error}
          </p>
        ) : null}
      </section>

      <div className="grid gap-4">
        {lead ? (
          <LeadCard lead={lead} />
        ) : (
          <EmptyBlock label="Select a lead to see its card." />
        )}

        <section className="panel p-4">
          <p className="micro-strong">Demo controls</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="tag tag-ghost"
              onClick={timeWarp}
              disabled={!lead || warping}
            >
              {warping ? "Warping…" : "Time-warp +3 days"}
            </button>
            <Link
              href={lead ? `/leads/${lead.id}` : "/leads"}
              className="tag tag-ghost"
            >
              Open lead
            </Link>
            <ResetButton className="tag tag-ghost" />
          </div>

          {notice ? (
            <p className="mt-3 text-[11.5px] font-medium text-jade">
              {notice}
            </p>
          ) : null}

          <p className="micro mt-3">
            Sends through /api/turn · card refreshes live
          </p>
        </section>
      </div>
    </div>
  );
}
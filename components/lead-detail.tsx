"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { LeadDetail, User } from "@/lib/types";
import { LeadCard } from "@/components/lead-card";
import { ChatThread } from "@/components/chat-thread";
import { EmptyBlock, StatusPill, stageTone } from "@/components/ui";
import { formatDateTime } from "@/lib/format";

function toLocalInput(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function defaultAppointment() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(17, 0, 0, 0);
  return toLocalInput(date);
}

function defaultFollowup() {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  date.setHours(10, 0, 0, 0);
  return toLocalInput(date);
}

export function LeadDetailPanel({
  lead,
  users,
}: {
  lead: LeadDetail;
  users: User[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [slot, setSlot] = useState(defaultAppointment);
  const [followupAt, setFollowupAt] = useState(defaultFollowup);
  const [reason, setReason] = useState(
    "Check in about the shortlisted property and confirm next steps",
  );
  const [step, setStep] = useState("day-3");

  const initials = lead.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function send(
    path: string,
    method: "PATCH" | "POST",
    body?: unknown,
  ) {
    if (busy) return;

    setBusy(path);
    setError(null);

    try {
      const response = await fetch(path, {
        method,
        headers: body ? { "content-type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error ?? "Request failed");
      }

      startTransition(() => router.refresh());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Request failed");
    } finally {
      setBusy(null);
    }
  }

  async function book(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!slot) {
      setError("Pick a date and time first");
      return;
    }

    await send(`/api/leads/${lead.id}/appointments`, "POST", {
      startsAt: new Date(slot).toISOString(),
      durationMinutes: 30,
      notes: "Viewing",
    });
  }

  async function schedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!followupAt || !reason.trim()) {
      setError("Pick a date and add a reason first");
      return;
    }

    await send(`/api/leads/${lead.id}/followups`, "POST", {
      runAt: new Date(followupAt).toISOString(),
      reason: reason.trim(),
      step,
    });
  }

  return (
    <div>
      <nav className="breadcrumb">
        <Link href="/leads">Leads</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink">{lead.name}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="micro">Lead / {lead.source}</p>
          <h1 className="display mt-2 text-[clamp(34px,5vw,56px)] text-ink">
            {lead.name}
          </h1>
          <p className="micro mt-2">{lead.phone ?? "No phone on file"}</p>
        </div>

        <div className="flex items-center gap-2">
          {pending ? <span className="micro">Refreshing…</span> : null}
          <StatusPill tone={stageTone(lead.stage)}>{lead.stage}</StatusPill>
          <span className="tag tag-ghost">Score {lead.score}</span>
        </div>
      </div>

      <div className="mt-5 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="grid gap-4">
          <LeadCard lead={lead} />

          <section className="panel p-5">
            <div className="flex items-center justify-between">
              <p className="micro-strong">Conversation</p>
              <span className="micro">{lead.messages.length} messages</span>
            </div>
            <div className="mt-4">
              <ChatThread
                messages={lead.messages}
                leadName={lead.name}
                leadInitials={initials}
              />
            </div>
          </section>
        </div>

        <div className="grid gap-4">
          <section className="panel p-5">
            <p className="micro-strong">Controls</p>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="stage">
                  Stage
                </label>
                <select
                  id="stage"
                  className="field-input"
                  value={lead.stage}
                  disabled={Boolean(busy)}
                  onChange={(event) =>
                    send(`/api/leads/${lead.id}`, "PATCH", {
                      stage: event.target.value,
                    })
                  }
                >
                  {["NEW", "QUALIFYING", "HOT", "BOOKED", "LOST"].map(
                    (stage) => (
                      <option key={stage}>{stage}</option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label className="field-label" htmlFor="owner">
                  Owner
                </label>
                <select
                  id="owner"
                  className="field-input"
                  value={lead.ownerId ?? ""}
                  disabled={Boolean(busy)}
                  onChange={(event) =>
                    send(`/api/leads/${lead.id}`, "PATCH", {
                      ownerId: event.target.value || null,
                    })
                  }
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <form className="mt-4 border-t border-line pt-4" onSubmit={book}>
              <label className="field-label" htmlFor="slot">
                Book a viewing
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  id="slot"
                  type="datetime-local"
                  className="field-input min-w-[190px] flex-1"
                  value={slot}
                  onChange={(event) => setSlot(event.target.value)}
                />
                <button
                  type="submit"
                  className="tag tag-blue"
                  disabled={Boolean(busy)}
                >
                  {busy?.includes("appointments") ? "Booking…" : "Book"}
                </button>
              </div>
            </form>

            <form
              className="mt-4 border-t border-line pt-4"
              onSubmit={schedule}
            >
              <div className="flex items-center justify-between">
                <label className="field-label" htmlFor="followupAt">
                  Schedule follow-up
                </label>
                <button
                  type="button"
                  className="micro-strong text-blue"
                  disabled={Boolean(busy)}
                  onClick={() => send("/api/time-warp?days=3", "POST")}
                >
                  Time-warp +3 days
                </button>
              </div>
              <input
                id="followupAt"
                type="datetime-local"
                className="field-input"
                value={followupAt}
                onChange={(event) => setFollowupAt(event.target.value)}
              />
              <input
                className="field-input mt-2"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Reason for the follow-up"
              />
              <div className="mt-2 flex gap-2">
                <select
                  className="field-input"
                  value={step}
                  onChange={(event) => setStep(event.target.value)}
                >
                  <option value="day-1">Day 1</option>
                  <option value="day-3">Day 3</option>
                  <option value="day-7">Day 7</option>
                  <option value="custom">Custom</option>
                </select>
                <button
                  type="submit"
                  className="tag tag-blue shrink-0"
                  disabled={Boolean(busy)}
                >
                  {busy?.includes("followups") ? "Saving…" : "Schedule"}
                </button>
              </div>
            </form>

            <div className="mt-4 border-t border-line pt-4">
              <button
                type="button"
                className="tag tag-dark w-full justify-center"
                disabled={Boolean(busy)}
                onClick={() =>
                  send(`/api/leads/${lead.id}/handoff`, "POST", {
                    summary: `${lead.name} requested a human. Stage ${lead.stage}, score ${lead.score}.`,
                  })
                }
              >
                Handoff to human
              </button>
            </div>

            {error ? (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11.5px] text-red-700">
                {error}
              </p>
            ) : null}
          </section>

          <section className="panel p-5">
            <p className="micro-strong">Appointments</p>
            {lead.appointments.length === 0 ? (
              <div className="mt-3">
                <EmptyBlock label="No appointments booked." />
              </div>
            ) : (
              <ul className="mt-1 divide-y divide-line">
                {lead.appointments.map((appointment) => (
                  <li key={appointment.id} className="py-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[12.5px] font-semibold text-ink">
                        {formatDateTime(appointment.startsAt)}
                      </p>
                      <StatusPill
                        tone={
                          appointment.status === "booked" ? "blue" : "ghost"
                        }
                      >
                        {appointment.status}
                      </StatusPill>
                    </div>
                    <p className="mt-1 text-[10.5px] text-muted">
                      {appointment.notes ?? "Viewing"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel p-5">
            <p className="micro-strong">Follow-ups</p>
            {lead.followups.length === 0 ? (
              <div className="mt-3">
                <EmptyBlock label="No follow-ups scheduled." />
              </div>
            ) : (
              <ul className="mt-1 divide-y divide-line">
                {lead.followups.map((followup) => (
                  <li key={followup.id} className="py-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="tag tag-ghost">{followup.step}</span>
                      <StatusPill
                        tone={
                          followup.status === "pending" ? "amber" : "jade"
                        }
                      >
                        {followup.status}
                      </StatusPill>
                    </div>
                    <p className="mt-2 text-[11.5px] leading-snug text-ink-2">
                      {followup.reason}
                    </p>
                    <p className="micro mt-1">
                      {formatDateTime(followup.runAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";

const sources = ["WhatsApp", "Instagram", "Web form"];

export function NewLeadForm({ users }: { users: User[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    source: "WhatsApp",
    requirement: "",
    budget: "",
    timeline: "",
    location: "",
    ownerId: "",
    notes: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    if (!form.name.trim()) {
      setError("Full name is required");
      return;
    }

    setSaving(true);
    setError(null);

    const payload: Record<string, string> = {
      name: form.name.trim(),
      source: form.source,
    };

    if (form.phone.trim()) payload.phone = form.phone.trim();
    if (form.requirement.trim()) payload.requirement = form.requirement.trim();
    if (form.budget.trim()) payload.budget = form.budget.trim();
    if (form.timeline.trim()) payload.timeline = form.timeline.trim();
    if (form.location.trim()) payload.location = form.location.trim();
    if (form.ownerId) payload.ownerId = form.ownerId;
    if (form.notes.trim()) payload.notes = form.notes.trim();

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ?? data.details?.formErrors?.[0] ?? "Could not create lead",
        );
      }

      router.push(`/leads/${data.lead.id}`);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create lead");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <section className="panel mt-5 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              className="field-input"
              placeholder="e.g. Ahmed Raza"
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              className="field-input"
              placeholder="+92 300 …"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="source">
              Source
            </label>
            <select
              id="source"
              className="field-input"
              value={form.source}
              onChange={(event) => update("source", event.target.value)}
            >
              {sources.map((source) => (
                <option key={source}>{source}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="requirement">
              Requirement
            </label>
            <input
              id="requirement"
              className="field-input"
              placeholder="2BHK · DHA Phase 6"
              value={form.requirement}
              onChange={(event) => update("requirement", event.target.value)}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="budget">
              Budget
            </label>
            <input
              id="budget"
              className="field-input"
              placeholder="3.2 Cr"
              value={form.budget}
              onChange={(event) => update("budget", event.target.value)}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="timeline">
              Timeline
            </label>
            <input
              id="timeline"
              className="field-input"
              placeholder="30 days"
              value={form.timeline}
              onChange={(event) => update("timeline", event.target.value)}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              className="field-input"
              placeholder="DHA Phase 6"
              value={form.location}
              onChange={(event) => update("location", event.target.value)}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="owner">
              Owner
            </label>
            <select
              id="owner"
              className="field-input"
              value={form.ownerId}
              onChange={(event) => update("ownerId", event.target.value)}
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

        <div className="mt-4">
          <label className="field-label" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            className="field-input min-h-[90px]"
            placeholder="Anything the bot should know…"
            value={form.notes}
            onChange={(event) => update("notes", event.target.value)}
          />
        </div>

        {error ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button type="submit" className="tag tag-blue" disabled={saving}>
            {saving ? "Creating…" : "Create lead"}
          </button>
          <Link href="/leads" className="tag tag-ghost">
            Cancel
          </Link>
          <span className="micro ml-auto">
            The bot qualifies it automatically
          </span>
        </div>
      </section>
    </form>
  );
}
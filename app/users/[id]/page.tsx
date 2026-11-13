import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { activity, leads, users } from "@/lib/data";
import { Avatar, StatusPill } from "@/components/ui";

const statusTone = {
  Active: "jade",
  Invited: "ghost",
  Paused: "amber",
} as const;

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = users.find((u) => u.id === id);

  if (!user) notFound();

  const assigned = leads.filter((l) => l.owner === user.name);

  const stats = [
    { label: "Leads handled", value: user.leads },
    { label: "Median response", value: user.response },
    { label: "Conversion", value: user.conversion },
    { label: "Bookings", value: user.bookings },
  ];

  const info = [
    { label: "Phone", value: user.phone },
    { label: "Email", value: user.email },
    { label: "Timezone", value: user.timezone },
    { label: "Seat", value: user.seat },
    { label: "Joined", value: user.joined },
    { label: "Last active", value: user.lastActive },
  ];

  return (
    <div>
      <nav className="breadcrumb">
        <Link href="/users">Users</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink">{user.name}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-5">
        <div className="flex items-center gap-4">
          <Avatar initials={user.initials} tint={user.tint} size="lg" />
          <div>
            <h1 className="display text-[clamp(34px,5vw,56px)] text-ink">
              {user.name}
            </h1>
            <p className="micro mt-2">
              {user.role} · {user.seat}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusPill tone={statusTone[user.status]}>{user.status}</StatusPill>
          <button type="button" className="tag tag-blue">
            Message
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-tile">
            <p className="num-lg text-ink">{s.value}</p>
            <p className="micro mt-2">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="panel p-5">
          <p className="micro-strong">Information</p>

          <div className="mt-1">
            {info.map((row) => (
              <div className="data-row" key={row.label}>
                <span className="micro">{row.label}</span>
                <span className="text-right text-[12.5px] font-medium text-ink">
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-line pt-4">
            <p className="micro-strong">
              Assigned leads · {assigned.length}
            </p>

            {assigned.length === 0 ? (
              <p className="mt-3 text-[12px] text-muted">
                No leads assigned yet.
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-line">
                {assigned.map((l) => (
                  <li key={l.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-semibold text-ink">
                        {l.name}
                      </p>
                      <p className="truncate text-[10.5px] text-muted">
                        {l.requirement}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="num-lg text-[16px] text-ink">
                        {l.score}
                      </span>
                      <StatusPill
                        tone={
                          l.stage === "HOT"
                            ? "blue"
                            : l.stage === "BOOKED"
                              ? "dark"
                              : "ghost"
                        }
                      >
                        {l.stage}
                      </StatusPill>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="panel p-5">
          <p className="micro-strong">Recent activity</p>
          <ul className="mt-1 divide-y divide-line">
            {activity.map((a) => (
              <li key={a.id} className="py-3">
                <p className="text-[12px] font-medium leading-snug text-ink">
                  {a.text}
                </p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="tag tag-ghost">{a.kind}</span>
                  <span className="micro">{a.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { users } from "@/lib/data";
import { Avatar, StatusPill } from "@/components/ui";

const statusTone = {
  Active: "jade",
  Invited: "ghost",
  Paused: "amber",
} as const;

export function UserTable() {
  return (
    <div className="panel overflow-x-auto">
      <table className="table">
        <thead className="thead">
          <tr>
            <th className="tcell">User</th>
            <th className="tcell">Status</th>
            <th className="tcell">Leads</th>
            <th className="tcell">Response</th>
            <th className="tcell">Conversion</th>
            <th className="tcell">Bookings</th>
            <th className="tcell">Last active</th>
            <th className="tcell" />
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="trow">
              <td className="tcell">
                <Link
                  href={`/users/${u.id}`}
                  className="flex items-center gap-2.5"
                >
                  <Avatar initials={u.initials} tint={u.tint} size="sm" />
                  <span>
                    <span className="block font-semibold text-ink">
                      {u.name}
                    </span>
                    <span className="block text-[10px] text-muted">
                      {u.role}
                    </span>
                  </span>
                </Link>
              </td>
              <td className="tcell">
                <StatusPill tone={statusTone[u.status]}>{u.status}</StatusPill>
              </td>
              <td className="tcell">
                <span className="num-lg text-[17px] text-ink">{u.leads}</span>
              </td>
              <td className="tcell text-ink-2">{u.response}</td>
              <td className="tcell text-ink-2">{u.conversion}</td>
              <td className="tcell text-ink-2">{u.bookings}</td>
              <td className="tcell text-muted">{u.lastActive}</td>
              <td className="tcell text-right">
                <Link
                  href={`/users/${u.id}`}
                  aria-label={`Open ${u.name}`}
                  className="text-muted transition-colors hover:text-ink"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { User } from "@/lib/types";
import { Avatar, EmptyBlock, StatusPill } from "@/components/ui";

const statusTone = {
  Active: "jade",
  Invited: "ghost",
  Paused: "amber",
} as const;

export function UserTable({ users }: { users: User[] }) {
  if (users.length === 0) {
    return <EmptyBlock label="No users yet." />;
  }

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
          {users.map((user) => (
            <tr key={user.id} className="trow">
              <td className="tcell">
                <Link
                  href={`/users/${user.id}`}
                  className="flex items-center gap-2.5"
                >
                  <Avatar initials={user.initials} tint={user.tint} size="sm" />
                  <span>
                    <span className="block font-semibold text-ink">
                      {user.name}
                    </span>
                    <span className="block text-[10px] text-muted">
                      {user.role}
                    </span>
                  </span>
                </Link>
              </td>
              <td className="tcell">
                <StatusPill tone={statusTone[user.status]}>
                  {user.status}
                </StatusPill>
              </td>
              <td className="tcell">
                <span className="num-lg text-[17px] text-ink">{user.leads}</span>
              </td>
              <td className="tcell text-ink-2">{user.response}</td>
              <td className="tcell text-ink-2">{user.conversion}</td>
              <td className="tcell text-ink-2">{user.bookings}</td>
              <td className="tcell text-muted">{user.lastActive}</td>
              <td className="tcell text-right">
                <Link
                  href={`/users/${user.id}`}
                  aria-label={`Open ${user.name}`}
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
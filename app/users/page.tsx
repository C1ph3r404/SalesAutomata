import { PageHead } from "@/components/ui";
import { UserTable } from "@/components/users";
import { listUsers } from "@/lib/db/users";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await listUsers();

  return (
    <div>
      <PageHead
        eyebrow="Workspace / Users"
        title="Users"
        right={<span className="tag tag-ghost">{users.length} seats</span>}
      />

      <div className="mt-5">
        <UserTable users={users} />
      </div>
    </div>
  );
}
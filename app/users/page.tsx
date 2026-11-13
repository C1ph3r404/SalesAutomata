import { PageHead } from "@/components/ui";
import { UserTable } from "@/components/users";

export default function UsersPage() {
  return (
    <div>
      <PageHead
        eyebrow="Workspace / Users"
        title="Users"
        right={<span className="tag tag-ghost">6 seats</span>}
      />

      <div className="mt-5">
        <UserTable />
      </div>
    </div>
  );
}

import Link from "next/link";
import { PageHead } from "@/components/ui";

export default function NotFound() {
  return (
    <div>
      <PageHead
        eyebrow="Workspace / 404"
        title="Not found"
        right={
          <Link href="/leads" className="tag tag-blue">
            Back to leads
          </Link>
        }
      />
      <div className="panel mt-5 p-6">
        <p className="text-[12.5px] text-muted">
          That lead or page does not exist. It may have been removed by a demo
          reset.
        </p>
      </div>
    </div>
  );
}
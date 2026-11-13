import Link from "next/link";
import { PageHead } from "@/components/ui";
import { users } from "@/lib/data";

export default function NewLeadPage() {
  return (
    <div>
      <PageHead
        eyebrow="Leads / New"
        title="New lead"
        right={
          <Link href="/leads" className="tag tag-ghost">
            Cancel
          </Link>
        }
      />

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
            />
          </div>

          <div>
            <label className="field-label" htmlFor="source">
              Source
            </label>
            <select id="source" className="field-input" defaultValue="WhatsApp">
              <option>WhatsApp</option>
              <option>Instagram</option>
              <option>Web form</option>
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
            />
          </div>

          <div>
            <label className="field-label" htmlFor="owner">
              Owner
            </label>
            <select id="owner" className="field-input" defaultValue="Usman Tariq">
              {users.map((u) => (
                <option key={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="budget">
              Budget
            </label>
            <input id="budget" className="field-input" placeholder="3.2 Cr" />
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
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button type="button" className="tag tag-blue">
            Create lead
          </button>
          <Link href="/leads" className="tag tag-ghost">
            Cancel
          </Link>
          <span className="micro ml-auto">
            The bot qualifies it automatically
          </span>
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Zap } from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/leads", label: "Leads" },
  { href: "/users", label: "Users" },
  { href: "/automations", label: "Automations" },
];

export function Topbar() {
  const pathname = usePathname();

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 py-5">
      <div className="flex items-center gap-7">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-blue text-white shadow-[0_2px_0_0_var(--color-blue-deep)]">
            <Zap className="h-[17px] w-[17px]" strokeWidth={2.4} />
          </span>
          <span className="text-[13px] font-bold tracking-tight text-ink">
            SalesAutomata
          </span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`micro-strong flex items-center gap-1.5 transition-opacity ${
                  active ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
                {active ? (
                  <span className="h-1 w-1 rounded-full bg-blue" />
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/leads/new" className="tag tag-blue">
          New lead
        </Link>
        <div className="toggle" role="group" aria-label="Theme">
          <span className="toggle-btn toggle-btn-active">
            <Moon className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <span className="toggle-btn">
            <Sun className="h-4 w-4" strokeWidth={2.2} />
          </span>
        </div>
      </div>
    </header>
  );
}

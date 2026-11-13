import type { Message } from "@/lib/types";
import { formatTime } from "@/lib/format";
import { EmptyBlock } from "@/components/ui";

function Dot({ label, tone }: { label: string; tone: "blue" | "dark" }) {
  return (
    <span
      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[8px] font-bold ${
        tone === "blue"
          ? "bg-blue text-white"
          : "bg-ink text-white"
      }`}
    >
      {label}
    </span>
  );
}

export function ChatThread({
  messages,
  leadName,
  leadInitials,
  emptyText = "No messages yet. Send one from the simulator.",
}: {
  messages: Message[];
  leadName?: string;
  leadInitials?: string;
  emptyText?: string;
}) {
  if (messages.length === 0) {
    return <EmptyBlock label={emptyText} />;
  }

  return (
    <div className="space-y-2.5">
      {messages.map((message) => {
        const isOut = message.direction === "out";

        return (
          <div
            key={message.id}
            className={`flex items-end gap-2 ${isOut ? "" : "justify-end"}`}
          >
            {isOut ? <Dot label="Bot" tone="dark" /> : null}

            <div className={`bubble ${isOut ? "bubble-dark" : "bubble-blue"}`}>
              <p className="text-[12.5px] font-medium">{message.body}</p>
              <p className="mt-1 text-[8.5px] font-bold uppercase tracking-[0.14em] opacity-70">
                {isOut ? "Al-Noor Bot" : (leadName ?? "Lead")} ·{" "}
                {formatTime(message.createdAt)}
              </p>
            </div>

            {!isOut ? (
              <Dot label={leadInitials ?? "L"} tone="blue" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
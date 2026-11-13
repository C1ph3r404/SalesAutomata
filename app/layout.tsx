import type { Metadata } from "next";
import { Topbar } from "@/components/Topbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "SalesAutomata — Knight of the Inbox",
  description: "AI WhatsApp sales closer for real estate teams.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Nastaliq+Urdu:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <div className="mx-auto max-w-[1240px] px-4 pb-10 sm:px-6">
          <Topbar />
          {children}
        </div>
      </body>
    </html>
  );
}

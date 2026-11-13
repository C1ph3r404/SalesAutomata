import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SalesAutomata — AI Sales Closer",
  description:
    "Capture leads, qualify them instantly, and close deals with an AI sales closer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink antialiased">
        {children}
      </body>
    </html>
  );
}

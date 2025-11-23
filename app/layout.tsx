import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';


export const metadata: Metadata = {
  title: "Real-time Patient Intake | Agnos Assignment",
  description:
    "Responsive patient form and staff view with real-time synchronization.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-950 text-slate-50">
          <header className="border-b border-slate-800 px-6 py-4">
            <div className="mx-auto flex max-w-5xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-lg md:text-xl font-semibold tracking-tight">
                  Real-time Patient Intake
                </h1>
                <p className="mt-1 text-xs text-slate-400">
                  Candidate Assignment – Front-end Developer
                </p>
              </div>

              <nav className="flex flex-wrap gap-2 text-sm">
                <Link
                  href="/"
                  className="rounded-md border border-slate-700 px-3 py-1 hover:border-sky-500"
                >
                  Home
                </Link>
                <Link
                  href="/patient"
                  className="rounded-md border border-slate-700 px-3 py-1 hover:border-sky-500"
                >
                  Patient Form
                </Link>
                <Link
                  href="/staff"
                  className="rounded-md border border-slate-700 px-3 py-1 hover:border-sky-500"
                >
                  Staff View
                </Link>
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-5xl px-6 py-6">{children}</main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}

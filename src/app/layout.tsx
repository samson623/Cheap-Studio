import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AppHeader from "@/components/AppHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cheap Studio",
  description: "Generative playground UI demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased min-h-screen bg-[radial-gradient(circle_at_top,_#0b1b3b,_#020817_55%)] text-slate-100"
        )}
      >
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.2),_transparent_55%)]" />
          <div className="pointer-events-none absolute inset-y-0 right-[-20%] w-[65%] bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_60%)]" />
          <div className="relative z-10 flex min-h-screen flex-col">
            <AppHeader />
            <main className="flex-1 pb-16">{children}</main>
            <footer className="border-t border-white/10 bg-[#050d1f]/80">
              <div className="mx-auto max-w-6xl px-4 py-4 text-xs uppercase tracking-[0.25em] text-white/40">
                UI prototype · Cheap Studio
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}

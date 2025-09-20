import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

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
          "antialiased min-h-screen bg-slate-950 text-slate-100"
        )}
      >
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_60%)]" />
          <div className="relative z-10 flex min-h-screen flex-col">
            <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
              <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
                <Link href="/" className="font-semibold tracking-tight text-white">
                  Cheap Studio
                </Link>
                <nav className="flex items-center gap-2 text-sm">
                  <Link
                    href="/"
                    className="rounded-md px-3 py-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/generate/image"
                    className="rounded-md px-3 py-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    Generate · Image
                  </Link>
                  <Link
                    href="/generate/video"
                    className="rounded-md px-3 py-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    Generate · Video
                  </Link>
                  <Link
                    href="/usage"
                    className="rounded-md px-3 py-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    Usage
                  </Link>
                </nav>
              </div>
            </header>
            <main className="flex-1 pb-16">{children}</main>
            <footer className="border-t border-white/10 bg-slate-950/80">
              <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-white/60">
                UI prototype · Cheap Studio
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}

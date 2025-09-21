import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TopNav } from "@/components/TopNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Photo Studio",
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
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(30,64,175,0.45),_transparent_65%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(16,185,129,0.18),_transparent_70%)]" />
          <div className="relative z-10 flex min-h-screen flex-col">
            <TopNav />
            <main className="flex-1 pb-16">{children}</main>
            <footer className="border-t border-white/10 bg-slate-950/80">
              <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-white/60">
                UI prototype · Photo Studio
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}

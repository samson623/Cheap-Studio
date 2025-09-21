"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/generate/image", label: "Generate Image" },
  { href: "/generate/video", label: "Generate Video" },
  { href: "/gallery", label: "Gallery" },
  { href: "/billing", label: "Billing" },
];

export default function AppHeader() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="border-b border-white/10 bg-[#050d1f]/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-white transition hover:text-sky-300"
        >
          Photo Studio
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-sm text-white/70 shadow-lg shadow-sky-500/5 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative rounded-full px-4 py-1.5 transition hover:text-white",
                isActive(item.href)
                  ? "bg-gradient-to-r from-sky-500/30 to-indigo-500/40 text-white shadow-[0_0_0_1px_rgba(148,197,255,0.35)]"
                  : "text-white/70"
              )}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-xs text-white/70">
          <div className="hidden text-right sm:block">
            <p className="uppercase tracking-[0.2em] text-[10px] text-white/40">Welcome</p>
            <p className="text-sm font-medium text-white">Demo User</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-200 sm:inline-flex">
              Pro
            </span>
            <Avatar className="h-9 w-9 border border-white/10">
              <AvatarImage src="https://i.pravatar.cc/80?img=32" alt="Demo User" />
              <AvatarFallback className="bg-white/10 text-white">DU</AvatarFallback>
            </Avatar>
          </div>
          <Button className="hidden rounded-full bg-emerald-400 text-emerald-950 hover:bg-emerald-300 sm:inline-flex">
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}


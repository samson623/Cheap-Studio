"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/generate/image", label: "Generate · Image" },
  { href: "/generate/video", label: "Generate · Video" },
  { href: "/", label: "Gallery" },
  { href: "/billing", label: "Billing" },
];

export function TopNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-white">
          Photo Studio
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-white/70 transition hover:bg-white/10 hover:text-white",
                isActive(item.href) && "bg-white/10 text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm text-white/70">
          <span className="hidden sm:inline">Welcome, Demo User</span>
          <Button
            type="button"
            className="rounded-full bg-emerald-500/90 text-white hover:bg-emerald-400"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}

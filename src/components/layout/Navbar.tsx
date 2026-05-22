"use client";

import { Search, Bell, Command } from "lucide-react";
import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/inventory": "Inventory",
  "/finance": "Finance",
  "/ai": "AI Operations",
  "/vendors": "Vendors",
  "/reports": "Reports",
  "/settings": "Settings",
};

export function Navbar() {
  const pathname = usePathname();
  const page = titles[pathname] || "NexOps";

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-[var(--border-primary)] bg-[var(--bg-primary)] shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center text-[13px]">
        <span className="text-[var(--text-quaternary)] font-medium">Brew & Bite Café</span>
        <span className="mx-2.5 text-[var(--text-quaternary)]">/</span>
        <span className="text-[var(--text-primary)] font-medium">{page}</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="hidden md:flex items-center gap-2 h-8 px-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[10px] text-[13px] text-[var(--text-quaternary)] hover:border-[var(--border-secondary)] hover:text-[var(--text-tertiary)] transition-all duration-200 w-52">
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-left">Search…</span>
          <div className="flex items-center gap-0.5 text-[10px] font-semibold text-[var(--text-quaternary)] bg-[var(--bg-hover)] px-1.5 py-0.5 rounded-md">
            <Command className="w-2.5 h-2.5" />K
          </div>
        </button>

        {/* Notifications */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-[10px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-all duration-200">
          <Bell className="w-4 h-4" strokeWidth={1.8} />
          <span className="absolute top-1.5 right-1.5 w-[6px] h-[6px] bg-[var(--accent)] rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--purple)] flex items-center justify-center text-[11px] font-semibold text-white cursor-pointer">
          K
        </div>
      </div>
    </header>
  );
}

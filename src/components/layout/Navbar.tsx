"use client";

import { Search, Bell, Command, Menu } from "lucide-react";
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
    <header className="h-14 flex items-center justify-between px-6 border-b border-[var(--border-primary)]/50 bg-[var(--bg-secondary)]/70 backdrop-blur-md shrink-0 z-20 sticky top-0">
      {/* Mobile Menu & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button className="md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center text-[15px] tracking-wide select-none">
          <span className="hidden sm:inline text-[var(--text-tertiary)] font-bold uppercase text-[16px]">Brew & Bite Café</span>
          <span className="hidden sm:inline mx-2 text-[var(--text-quaternary)]">/</span>
          <span className="text-[var(--text-primary)] font-semibold">{page}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="hidden md:flex items-center gap-2 h-8 px-3 bg-[var(--bg-primary)]/60 border border-[var(--border-primary)] rounded-xl text-[16px] text-[var(--text-tertiary)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-all duration-300 w-56 cursor-pointer group shadow-sm">
          <Search className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:scale-105 transition-transform" />
          <span className="flex-1 text-left font-medium">Quick search…</span>
          <div className="flex items-center gap-0.5 text-[16px] font-bold text-[var(--text-tertiary)] bg-[var(--border-primary)] border border-[var(--border-secondary)]/35 px-1.5 py-0.5 rounded-md">
            <Command className="w-2.5 h-2.5" />K
          </div>
        </button>

        {/* Notifications */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-hover)] transition-all duration-300 cursor-pointer shadow-sm">
          <Bell className="w-4 h-4" strokeWidth={2} />
          <span className="absolute top-2 right-2 w-[5px] h-[5px] bg-[var(--red)] rounded-full animate-pulse shadow-md shadow-[var(--red)]/40" />
        </button>

        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--purple)] flex items-center justify-center text-[15px] font-bold text-white cursor-pointer shadow-md shadow-[var(--accent)]/10 hover:shadow-[var(--accent)]/30 hover:scale-105 hover:rotate-6 transition-all duration-300">
          K
        </div>
      </div>
    </header>
  );
}

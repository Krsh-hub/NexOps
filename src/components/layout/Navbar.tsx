"use client";

import { useState } from "react";
import { Search, Bell, Command } from "lucide-react";
import { usePathname } from "next/navigation";
import { CommandPalette } from "./CommandPalette";
import { NotificationsPopover } from "./NotificationsPopover";

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
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <>
      <header className="h-14 flex items-center justify-between px-4 sm:px-6 border-b border-[var(--border-primary)] bg-white/90 backdrop-blur-md shrink-0 z-20 sticky top-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="flex items-center text-[14px] sm:text-[15px] tracking-wide select-none">
            <span className="hidden sm:inline text-[var(--text-tertiary)] font-bold uppercase text-[12px] tracking-wider">
              Brew & Bite Café
            </span>
            <span className="hidden sm:inline mx-2 text-[var(--text-quaternary)]">/</span>
            <span className="text-[var(--text-primary)] font-semibold">{page}</span>
          </div>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2 h-8 px-2.5 sm:px-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[13px] text-[var(--text-tertiary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] hover:bg-white transition-all duration-200 w-36 sm:w-56 cursor-pointer group shadow-xs"
          >
            <Search className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors shrink-0" />
            <span className="flex-1 text-left font-medium truncate">Quick search…</span>
            <div className="hidden sm:flex items-center gap-0.5 text-[11px] font-bold text-[var(--text-tertiary)] bg-white border border-[var(--border-primary)] px-1.5 py-0.5 rounded-md font-mono shadow-xs">
              <Command className="w-2.5 h-2.5" />K
            </div>
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative w-8 h-8 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-transparent hover:border-[var(--border-primary)] transition-all duration-200 cursor-pointer shadow-xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4" strokeWidth={2} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--red)] rounded-full animate-pulse shadow-xs" />
          </button>

          {/* Operator Avatar */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-[12px] font-bold text-white shadow-xs cursor-pointer hover:scale-105 transition-transform">
              OP
            </div>
          </div>
        </div>
      </header>

      {/* Global Modals */}
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      <NotificationsPopover
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </>
  );
}

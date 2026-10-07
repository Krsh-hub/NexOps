"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Command, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
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
  const [businessName, setBusinessName] = useState("My Workspace");
  const [operatorInitials, setOperatorInitials] = useState("OP");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.businessName) {
          setBusinessName(data.businessName);
        }
        if (data && data.operatorName) {
          const parts = data.operatorName.trim().split(" ");
          const initials = parts.length > 1
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : data.operatorName.slice(0, 2).toUpperCase();
          setOperatorInitials(initials || "OP");
        }
      })
      .catch(() => {});
  }, [pathname]);

  return (
    <>
      <header className="h-16 flex items-center justify-between px-6 sm:px-8 border-b border-slate-200/90 bg-white/95 backdrop-blur-md shrink-0 z-20 sticky top-0 shadow-xs">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="flex items-center text-[14px] sm:text-[15px] tracking-wide select-none">
            <span className="hidden sm:inline text-slate-500 font-bold uppercase text-[12px] tracking-wider truncate max-w-[200px]">
              {businessName}
            </span>
            <span className="hidden sm:inline mx-2 text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">{page}</span>
          </div>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick Search Button */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-2.5 h-9 px-3 sm:px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-500 hover:border-emerald-600 hover:text-slate-900 hover:bg-white transition-all duration-200 w-36 sm:w-56 cursor-pointer group shadow-xs"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
            <span className="flex-1 text-left font-medium truncate">Quick search…</span>
            <div className="hidden sm:flex items-center gap-0.5 text-[11px] font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md font-mono shadow-xs">
              <Command className="w-2.5 h-2.5" />K
            </div>
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all duration-200 cursor-pointer shadow-xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4" strokeWidth={2} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-xs" />
          </button>

          {/* Operator Avatar */}
          <div className="flex items-center gap-2 pl-1">
            <Link
              href="/settings"
              title="Workspace Settings"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-[12px] font-bold text-white shadow-xs cursor-pointer hover:scale-105 transition-transform"
            >
              {operatorInitials}
            </Link>
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

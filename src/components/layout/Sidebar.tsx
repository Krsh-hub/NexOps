"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  CircleDollarSign,
  Bot,
  Users,
  FileText,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Finance", href: "/finance", icon: CircleDollarSign },
  { name: "AI Operations", href: "/ai", icon: Bot },
  { name: "Vendors", href: "/vendors", icon: Users },
  { name: "Reports", href: "/reports", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-[230px] h-full flex-col border-r border-[var(--border-primary)] bg-[var(--bg-secondary)] shrink-0 z-30 shadow-sm">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-all duration-300">
            <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="font-bold text-[16px] text-[var(--text-primary)] tracking-wide uppercase transition-colors">
            NexOps
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto scrollbar-hide bg-[var(--bg-secondary)]">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 px-3.5 py-[9px] rounded-xl text-[14px] font-semibold transition-all duration-200 relative overflow-hidden ${
                isActive
                  ? "bg-emerald-50 text-emerald-800 border-l-2 border-[var(--accent)] font-bold shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border-l-2 border-transparent"
              }`}
            >
              <item.icon
                className={`w-[17px] h-[17px] transition-transform duration-200 ${
                  isActive
                    ? "text-[var(--accent)] scale-105"
                    : "text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
                }`}
                strokeWidth={2}
              />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] space-y-1">
        <Link
          href="/settings"
          className={`group flex items-center gap-3 px-3.5 py-[9px] rounded-xl text-[14px] font-semibold transition-all duration-200 relative border-l-2 ${
            pathname === "/settings"
              ? "bg-emerald-50 text-emerald-800 border-[var(--accent)] font-bold shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border-transparent"
          }`}
        >
          <Settings
            className={`w-[17px] h-[17px] transition-transform duration-200 ${
              pathname === "/settings"
                ? "text-[var(--accent)]"
                : "text-[var(--text-tertiary)] group-hover:rotate-45"
            }`}
            strokeWidth={2}
          />
          Settings
        </Link>
        <button className="w-full flex items-center gap-3 px-3.5 py-[9px] rounded-xl text-[14px] font-semibold text-[var(--text-secondary)] hover:text-[var(--red)] hover:bg-rose-50 transition-all duration-200 text-left border-l-2 border-transparent cursor-pointer group">
          <LogOut
            className="w-[17px] h-[17px] text-[var(--text-tertiary)] group-hover:text-[var(--red)] group-hover:-translate-x-0.5 transition-transform"
            strokeWidth={2}
          />
          Log out
        </button>
      </div>
    </aside>
  );
}

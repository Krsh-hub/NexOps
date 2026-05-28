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
    <aside className="hidden md:flex w-[220px] h-full flex-col border-r border-[var(--border-primary)] bg-[var(--bg-secondary)] shrink-0 z-30 shadow-2xl shadow-black/40">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-[var(--border-primary)]/40 bg-[var(--bg-primary)]/30 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--purple)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/20 group-hover:shadow-[var(--accent)]/40 group-hover:scale-105 transition-all duration-300">
            <Sparkles className="w-3.5 h-3.5 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="font-bold text-[16px] text-[var(--text-primary)] tracking-wide uppercase group-hover:text-white transition-colors">NexOps</span>
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
              className={`group flex items-center gap-3 px-3.5 py-[9px] rounded-xl text-[15px] font-semibold transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? "bg-gradient-to-r from-[rgba(99,102,241,0.12)] to-[rgba(139,92,246,0.02)] text-[var(--text-primary)] border-l-2 border-[var(--accent)] shadow-sm shadow-[var(--accent)]/5"
                  : "text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-hover)] border-l-2 border-transparent"
              }`}
            >
              <item.icon className={`w-[16px] h-[16px] transition-transform duration-300 ${isActive ? "text-[var(--accent)] scale-105" : "text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] group-hover:scale-105"}`} strokeWidth={2} />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] space-y-1">
        <Link
          href="/settings"
          className={`group flex items-center gap-3 px-3.5 py-[9px] rounded-xl text-[15px] font-semibold transition-all duration-300 relative border-l-2 ${
            pathname === "/settings"
              ? "bg-gradient-to-r from-[rgba(99,102,241,0.12)] to-[rgba(139,92,246,0.02)] text-[var(--text-primary)] border-[var(--accent)]"
              : "text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-hover)] border-transparent"
          }`}
        >
          <Settings className={`w-[16px] h-[16px] transition-transform duration-300 ${pathname === "/settings" ? "text-[var(--accent)]" : "text-[var(--text-tertiary)] group-hover:rotate-45"}`} strokeWidth={2} />
          Settings
        </Link>
        <button className="w-full flex items-center gap-3 px-3.5 py-[9px] rounded-xl text-[15px] font-semibold text-[var(--text-tertiary)] hover:text-[var(--red)] hover:bg-[var(--red-subtle)] transition-all duration-300 text-left border-l-2 border-transparent cursor-pointer group">
          <LogOut className="w-[16px] h-[16px] text-[var(--text-tertiary)] group-hover:text-[var(--red)] group-hover:-translate-x-0.5 transition-transform" strokeWidth={2} />
          Log out
        </button>
      </div>
    </aside>
  );
}

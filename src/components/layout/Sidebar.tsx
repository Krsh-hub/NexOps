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
    <aside className="w-[220px] h-full flex flex-col border-r border-[var(--border-primary)] bg-[var(--bg-primary)] shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center px-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--purple)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/10 group-hover:shadow-[var(--accent)]/20 transition-shadow">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-[15px] text-[var(--text-primary)]">NexOps</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-[9px] rounded-[10px] text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[var(--bg-hover)] text-[var(--text-primary)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              <item.icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-[var(--border-primary)] space-y-0.5">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-[9px] rounded-[10px] text-[13px] font-medium transition-all duration-200 ${
            pathname === "/settings"
              ? "bg-[var(--bg-hover)] text-[var(--text-primary)]"
              : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
          }`}
        >
          <Settings className="w-[18px] h-[18px]" strokeWidth={1.8} />
          Settings
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-[9px] rounded-[10px] text-[13px] font-medium text-[var(--text-tertiary)] hover:text-[var(--red)] hover:bg-[var(--red-subtle)] transition-all duration-200 text-left">
          <LogOut className="w-[18px] h-[18px]" strokeWidth={1.8} />
          Log out
        </button>
      </div>
    </aside>
  );
}

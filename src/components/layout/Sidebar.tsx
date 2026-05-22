import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  CircleDollarSign, 
  Bot, 
  Users, 
  FileText, 
  Settings,
  LogOut
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
  return (
    <aside className="w-64 border-r border-[var(--border-subtle)] bg-[var(--bg-base)] flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[var(--accent-primary)] flex items-center justify-center">
            <span className="text-white font-bold text-xs">N</span>
          </div>
          <span className="font-semibold text-[var(--text-primary)] tracking-wide">NexOps</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
        <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-2">
          Workspace
        </div>
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
              item.name === "Dashboard" 
                ? "bg-[var(--bg-hover)] text-[var(--text-primary)]" 
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-[var(--border-subtle)] flex flex-col gap-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <button className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--danger)] text-left">
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}

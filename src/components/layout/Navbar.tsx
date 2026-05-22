import { Search, Bell, Command } from "lucide-react";

export function Navbar() {
  return (
    <header className="h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-base)] flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center text-sm font-medium text-[var(--text-secondary)]">
          Brew & Bite Café
          <span className="mx-2 text-[var(--border-default)]">/</span>
          <span className="text-[var(--text-primary)]">Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search / Command Bar Hint */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-md text-[var(--text-muted)] text-sm w-64 hover:border-[var(--border-default)] transition-colors cursor-pointer">
          <Search className="w-4 h-4" />
          <span className="flex-1">Search or jump to...</span>
          <div className="flex items-center gap-1 text-xs font-semibold bg-[var(--bg-hover)] px-1.5 py-0.5 rounded">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>

        <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-md hover:bg-[var(--bg-hover)]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-[var(--accent-primary)] rounded-full border border-[var(--bg-base)]"></span>
        </button>

        {/* Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-[var(--bg-hover)] border border-[var(--border-default)] flex items-center justify-center overflow-hidden cursor-pointer">
          <img 
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" 
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}

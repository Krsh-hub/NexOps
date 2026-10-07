"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bot,
  Package,
  CircleDollarSign,
  Users,
  FileText,
  Settings,
  LayoutDashboard,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Clock,
  PlusCircle,
  X,
  Loader2,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setAiResult(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) onClose();
        else onClose(); // trigger toggle from parent
      }
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

  const handleRunAi = async (prompt: string) => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, history: [] }),
      });
      const data = await res.json();
      setAiResult(data.error ? `Error: ${data.error}` : data.message);
    } catch {
      setAiResult("Failed to execute agent prompt.");
    } finally {
      setAiLoading(false);
    }
  };

  const navItems = [
    { title: "Dashboard", href: "/", icon: LayoutDashboard, category: "Navigation" },
    { title: "Inventory Management", href: "/inventory", icon: Package, category: "Navigation" },
    { title: "Finance & Invoicing", href: "/finance", icon: CircleDollarSign, category: "Navigation" },
    { title: "AI Operations Cockpit", href: "/ai", icon: Bot, category: "Navigation" },
    { title: "Vendor Directory", href: "/vendors", icon: Users, category: "Navigation" },
    { title: "Operational Reports", href: "/reports", icon: FileText, category: "Navigation" },
    { title: "Settings & Preferences", href: "/settings", icon: Settings, category: "Navigation" },
  ];

  const quickActions = [
    {
      title: "Run Low Stock Scan",
      desc: "Check items below reorder threshold",
      icon: AlertTriangle,
      color: "text-amber-400",
      action: () => handleRunAi("Scan all inventory items and detect which ones are critically low or out of stock."),
    },
    {
      title: "Audit Overdue Invoices",
      desc: "Calculate pending balances and overdue accounts",
      icon: Clock,
      color: "text-rose-400",
      action: () => handleRunAi("Find all overdue invoices, calculate unpaid totals, and list clients."),
    },
    {
      title: "Add New Product",
      desc: "Navigate to inventory creation",
      icon: PlusCircle,
      color: "text-blue-400",
      action: () => handleNavigate("/inventory"),
    },
    {
      title: "Add New Supplier",
      desc: "Register a new vendor partner",
      icon: Users,
      color: "text-purple-400",
      action: () => handleNavigate("/vendors"),
    },
  ];

  const filteredNav = navItems.filter((i) =>
    i.title.toLowerCase().includes(query.toLowerCase())
  );

  const isCustomPrompt = query.trim().length > 0;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[620px] rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-[var(--border-primary)]/80 gap-3 bg-[var(--bg-tertiary)]/50">
          <Search className="w-5 h-5 text-[var(--text-tertiary)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim() && !aiLoading) {
                handleRunAi(query.trim());
              }
            }}
            placeholder="Type a command, page name, or AI instruction..."
            className="flex-1 bg-transparent border-none text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setAiResult(null);
              }}
              className="text-[var(--text-tertiary)] hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 rounded text-[11px] font-mono bg-[var(--bg-hover)] border border-[var(--border-secondary)] text-[var(--text-tertiary)]">
            ESC
          </kbd>
        </div>

        {/* AI Result Box if loaded */}
        {aiLoading && (
          <div className="p-4 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] flex items-center gap-3 text-[13px] text-[var(--accent)]">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>Agent is executing instructions in background...</span>
          </div>
        )}

        {aiResult && !aiLoading && (
          <div className="p-4 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] text-[13px] space-y-2">
            <div className="flex items-center justify-between text-[11px] uppercase font-bold text-[var(--accent)] font-mono">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Agent Result
              </span>
              <button
                onClick={() => setAiResult(null)}
                className="text-[var(--text-tertiary)] hover:text-white"
              >
                Clear
              </button>
            </div>
            <div className="text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto pr-2">
              {aiResult}
            </div>
            <button
              onClick={() => handleNavigate("/ai")}
              className="text-[12px] text-[var(--accent)] hover:underline inline-flex items-center gap-1 font-semibold"
            >
              Continue in Cockpit <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Action Lists */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 max-h-[460px]">
          {/* Ask AI Option if user typed query */}
          {isCustomPrompt && !aiResult && (
            <div
              onClick={() => handleRunAi(query)}
              className="p-3 rounded-xl bg-gradient-to-r from-[rgba(59,130,246,0.15)] to-[rgba(147,51,234,0.15)] border border-[var(--accent)]/30 hover:border-[var(--accent)] cursor-pointer flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white shrink-0 shadow-md shadow-[var(--accent)]/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-white flex items-center gap-1.5">
                    Ask NexOps AI: <span className="font-normal italic truncate max-w-[320px]">&ldquo;{query}&rdquo;</span>
                  </div>
                  <div className="text-[11px] text-blue-200/70">
                    Press Enter to run autonomous agent workflow
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </div>
          )}

          {/* Quick Actions */}
          {!query && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                Autonomous Actions
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {quickActions.map((act) => {
                  const Icon = act.icon;
                  return (
                    <div
                      key={act.title}
                      onClick={act.action}
                      className="p-2.5 rounded-xl bg-[var(--bg-tertiary)]/50 hover:bg-[var(--bg-hover)] border border-[var(--border-primary)] hover:border-[var(--border-hover)] cursor-pointer transition-all flex items-start gap-2.5 group"
                    >
                      <Icon className={`w-4 h-4 ${act.color} mt-0.5 shrink-0`} />
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-[var(--text-primary)] group-hover:text-white">
                          {act.title}
                        </div>
                        <div className="text-[11px] text-[var(--text-tertiary)] truncate">
                          {act.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pages */}
          {filteredNav.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                Pages & Modules
              </div>
              <div className="space-y-1 mt-1">
                {filteredNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.href}
                      onClick={() => handleNavigate(item.href)}
                      className="px-3 py-2 rounded-xl hover:bg-[var(--bg-hover)] flex items-center justify-between cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" />
                        <span className="text-[14px] text-[var(--text-secondary)] group-hover:text-white font-medium">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[var(--text-quaternary)] group-hover:text-[var(--text-tertiary)]">
                        {item.href}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-[var(--border-primary)]/70 bg-[var(--bg-tertiary)]/40 flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-hover)] border border-[var(--border-secondary)] text-[10px]">
                Enter
              </kbd>{" "}
              to select / run
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-hover)] border border-[var(--border-secondary)] text-[10px]">
                ESC
              </kbd>{" "}
              to close
            </span>
          </div>
          <span className="font-mono text-[10px]">NexOps v0.2</span>
        </div>
      </div>
    </div>
  );
}

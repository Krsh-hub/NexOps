"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Loader2,
  CornerDownLeft,
  X,
  Zap,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

interface ToolExecuted {
  id: string;
  name: string;
  status: string;
}

export function AICommandBar() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [toolsRun, setToolsRun] = useState<ToolExecuted[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput("");
    setIsLoading(true);
    setResponse(null);
    setToolsRun([]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history: [] }),
      });
      const data = await res.json();
      if (data.error) {
        setResponse(`❌ ${data.error}`);
      } else {
        setResponse(data.message);
        if (data.toolCalls) {
          setToolsRun(data.toolCalls);
        }
      }
    } catch {
      setResponse("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--text-tertiary)]">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
          AI Autonomous Command Bar
        </div>
        <span className="text-[11px] text-[var(--text-quaternary)] hidden sm:inline">
          Tip: Ask to create invoices, check stockouts, or summarize ops
        </span>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] shadow-lg shadow-black/20 focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/20 transition-all duration-300">
          <div className="flex items-center px-4 py-1.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--purple)] flex items-center justify-center shrink-0 shadow-md shadow-[var(--accent)]/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask NexOps AI anything (e.g. 'Create invoice for 5 Cold Brews to XYZ Cafe', 'Check low stock')..."
              disabled={isLoading}
              className="w-full h-12 bg-transparent border-none pl-3.5 pr-4 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none disabled:opacity-50"
            />

            <div className="shrink-0 flex items-center gap-2">
              {isLoading ? (
                <div className="flex items-center gap-2 text-[12px] font-mono text-[var(--accent)] px-2 py-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Thinking...</span>
                </div>
              ) : (
                <kbd className="hidden sm:inline-flex items-center px-2 py-1 bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-lg text-[12px] font-bold text-[var(--text-tertiary)] shadow-sm">
                  <CornerDownLeft className="w-3 h-3 mr-1" /> Enter
                </kbd>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* AI Response Card */}
      {(response || isLoading) && (
        <div className="card-surface p-5 rounded-2xl border border-[var(--border-primary)] border-t-2 border-t-[var(--accent)] shadow-xl animate-fade-soft bg-[var(--bg-secondary)]">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--purple)] flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-[var(--accent)]/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              {/* Tool Execution tags if any */}
              {toolsRun.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-mono uppercase font-bold text-[var(--text-tertiary)] flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[var(--accent)]" /> Tools:
                  </span>
                  {toolsRun.map((t) => (
                    <span
                      key={t.id}
                      className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-300"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {t.name.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              )}

              {isLoading ? (
                <div className="space-y-2 py-1">
                  <div className="h-4 rounded bg-[var(--bg-hover)] animate-pulse w-3/4" />
                  <div className="h-4 rounded bg-[var(--bg-hover)] animate-pulse w-1/2" />
                </div>
              ) : (
                <div className="text-[14px] text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                  {response}
                </div>
              )}

              {response && !isLoading && (
                <div className="pt-2 flex items-center justify-between border-t border-[var(--border-primary)]/40 text-[12px]">
                  <Link
                    href="/ai"
                    className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline font-semibold"
                  >
                    Open in Full AI Cockpit <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => setResponse(null)}
                    className="text-[var(--text-tertiary)] hover:text-white transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>

            {response && !isLoading && (
              <button
                onClick={() => setResponse(null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-quaternary)] hover:text-white hover:bg-[var(--bg-hover)] transition-all shrink-0 cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

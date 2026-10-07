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
    <div className="card-surface p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-wider font-bold text-slate-500">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Autonomous Command Bar
        </div>
        <span className="text-[12px] text-slate-400 hidden sm:inline font-medium">
          Examples: &quot;Add 10 units of Coffee Beans&quot; · &quot;Create invoice for Client A&quot; · &quot;Summarize inventory&quot;
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative rounded-xl bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all duration-200">
          <div className="flex items-center px-4 py-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask or command NexOps AI (e.g. 'Log invoice for 5 items', 'Check out-of-stock items')..."
              disabled={isLoading}
              className="w-full h-12 bg-transparent border-none pl-3.5 pr-4 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
            />

            <div className="shrink-0 flex items-center gap-2">
              {isLoading ? (
                <div className="flex items-center gap-2 text-[12px] font-mono text-emerald-700 px-2 py-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Processing...</span>
                </div>
              ) : (
                <kbd className="hidden sm:inline-flex items-center px-2 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-bold text-slate-400 shadow-xs">
                  <CornerDownLeft className="w-3 h-3 mr-1" /> Enter
                </kbd>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* AI Response Card */}
      {(response || isLoading) && (
        <div className="p-5 sm:p-6 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-xs animate-fade-soft space-y-3">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              {/* Tool Execution tags if any */}
              {toolsRun.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-mono uppercase font-bold text-slate-500 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-600" /> Executed:
                  </span>
                  {toolsRun.map((t) => (
                    <span
                      key={t.id}
                      className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-white border border-emerald-200 text-emerald-800 shadow-xs"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {t.name.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              )}

              {isLoading ? (
                <div className="space-y-2 py-1">
                  <div className="h-4 rounded bg-slate-200 animate-pulse w-3/4" />
                  <div className="h-4 rounded bg-slate-200 animate-pulse w-1/2" />
                </div>
              ) : (
                <div className="text-[14px] text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {response}
                </div>
              )}

              {response && !isLoading && (
                <div className="pt-2 flex items-center justify-between border-t border-emerald-200/60 text-[12px]">
                  <Link
                    href="/ai"
                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold"
                  >
                    Open in Full AI Cockpit <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => setResponse(null)}
                    className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>

            {response && !isLoading && (
              <button
                onClick={() => setResponse(null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-all shrink-0 cursor-pointer"
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

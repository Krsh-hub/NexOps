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
  Plus,
  Search,
  FileText,
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

  const promptShortcuts = [
    { label: "Scan Low Stock", prompt: "Scan inventory for low stock items" },
    { label: "Create Invoice", prompt: "Create invoice for 5 Cold Brews to XYZ Cafe" },
    { label: "Restock Inventory", prompt: "Add 20 units of Colombian Roast to inventory" },
    { label: "Daily Summary", prompt: "Summarize today's business operations and status" },
  ];

  const handleExecutePrompt = async (textToRun: string) => {
    if (isLoading) return;
    setInput(textToRun);
    setIsLoading(true);
    setResponse(null);
    setToolsRun([]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToRun, history: [] }),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput("");
    await handleExecutePrompt(msg);
  };

  return (
    <div className="linear-card p-6 space-y-4">
      {/* Header with Title & Spotlight Icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/80 shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
              AI Operations Assistant
            </h3>
            <p className="text-[12.5px] text-slate-500 font-medium mt-0.5">
              Ask anything about your operations, draft invoices, or adjust inventory
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          Ready
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative rounded-2xl bg-slate-50/80 border border-slate-200 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all duration-200 shadow-2xs">
          <div className="flex items-center px-4 py-1.5">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or enter a command (e.g. 'Draft invoice for 5 items', 'Check low stock')..."
              disabled={isLoading}
              className="w-full h-11 bg-transparent border-none text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50 font-normal"
            />

            <div className="shrink-0 flex items-center gap-2">
              {isLoading ? (
                <div className="flex items-center gap-2 text-[12px] font-medium text-emerald-700 px-2 py-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Processing...</span>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-[12.5px] font-medium shadow-2xs transition-colors cursor-pointer"
                >
                  Send
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Quick Action Suggestion Chips */}
      <div className="flex items-center gap-2 flex-wrap pt-0.5">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">
          Suggestions:
        </span>
        {promptShortcuts.map((sc) => (
          <button
            key={sc.label}
            type="button"
            disabled={isLoading}
            onClick={() => handleExecutePrompt(sc.prompt)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-medium bg-white hover:bg-slate-50 hover:text-slate-900 border border-slate-200/90 text-slate-600 transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            <span>{sc.label}</span>
          </button>
        ))}
      </div>

      {/* AI Response Card */}
      {(response || isLoading) && (
        <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-xs animate-fade-soft space-y-3">
          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
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

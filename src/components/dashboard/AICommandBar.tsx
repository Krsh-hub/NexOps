"use client";

import { useState } from "react";
import { Sparkles, Loader2, CornerDownLeft, X } from "lucide-react";

export function AICommandBar() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput("");
    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history: [] }),
      });
      const data = await res.json();
      setResponse(data.error ? "Something went wrong. Try again." : data.message);
    } catch {
      setResponse("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-quaternary)]">
          <Sparkles className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask NexOps to manage operations…"
          disabled={isLoading}
          className="w-full h-11 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl pl-11 pr-14 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)]/45 focus:ring-2 focus:ring-[var(--accent)]/10 hover:border-[var(--border-secondary)] transition-all duration-300 disabled:opacity-50 shadow-sm"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-[var(--text-quaternary)] animate-spin" />
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 bg-[var(--bg-hover)] border border-[var(--border-primary)] rounded-md text-[10px] font-semibold text-[var(--text-quaternary)]">
              <CornerDownLeft className="w-3 h-3" />
            </kbd>
          )}
        </div>
      </form>

      {/* AI Response */}
      {(response || isLoading) && (
        <div className="card-surface p-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--purple)] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-3.5 rounded-md animate-shimmer w-2/3" />
                  <div className="h-3.5 rounded-md animate-shimmer w-1/2" />
                </div>
              ) : (
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                  {response}
                </p>
              )}
            </div>
            {response && !isLoading && (
              <button
                onClick={() => setResponse(null)}
                className="w-5 h-5 flex items-center justify-center rounded-md text-[var(--text-quaternary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-all shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

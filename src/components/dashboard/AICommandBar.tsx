"use client";

import { useState } from "react";
import { Sparkles, Loader2, ArrowRight, CornerDownLeft } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AICommandBar() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [insight, setInsight] = useState<Message | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    setInsight({ role: "user", content: userMessage });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: [] }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setInsight({ role: "assistant", content: data.message });
    } catch (error) {
      console.error("Chat error:", error);
      setInsight({ 
        role: "assistant", 
        content: "Error processing request. Please try again." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Command Input */}
      <form 
        onSubmit={handleSubmit} 
        className="relative flex items-center bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-sm transition-all focus-within:border-[var(--border-active)] focus-within:ring-1 focus-within:ring-[var(--border-active)]"
      >
        <div className="absolute left-4 text-[var(--text-muted)] flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-[var(--text-secondary)]" />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI to query operations, generate reports, or automate tasks..."
          className="w-full bg-transparent border-none py-4 pl-12 pr-16 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-0"
          disabled={isLoading}
        />
        <div className="absolute right-4 flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-[var(--text-muted)] animate-spin" />
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-[var(--bg-hover)] border border-[var(--border-subtle)] rounded text-[10px] font-semibold text-[var(--text-muted)] font-mono">
              <CornerDownLeft className="w-3 h-3" />
            </kbd>
          )}
        </div>
      </form>

      {/* Transient Insight Stream */}
      {insight && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 shadow-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded bg-[var(--bg-hover)] border border-[var(--border-default)] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3 h-3 text-[var(--text-primary)]" />
            </div>
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="space-y-2 py-1">
                  <div className="h-4 bg-[var(--bg-hover)] rounded animate-pulse w-1/3"></div>
                  <div className="h-4 bg-[var(--bg-hover)] rounded animate-pulse w-1/2"></div>
                </div>
              ) : (
                <div 
                  className="prose prose-invert prose-sm max-w-none text-[var(--text-primary)] leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: insight.content
                      .replace(/\n/g, "<br/>")
                      .replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold text-white'>$1</strong>")
                  }} 
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

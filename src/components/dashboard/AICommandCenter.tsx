"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, User, Sparkles, Loader2, ArrowRight } from "lucide-react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export function AICommandCenter() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hello! I'm NexOps AI. I've analyzed your operations for today. How can I assist you? You can ask me to check stock, create an invoice, or summarize finances." 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message immediately
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Filter out initial greeting and format for API
      const history = messages
        .filter((m, i) => i > 0 || m.role === "user") 
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
      
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "❌ Sorry, I encountered an error while processing that request. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Suggestion chips
  const suggestions = [
    "Create invoice for 5 cold coffees to XYZ Cafe",
    "Show overdue invoices",
    "Give me a daily summary",
    "Check for low stock"
  ];

  return (
    <div className="card flex flex-col h-full overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[var(--bg-hover)] flex items-center justify-center border border-[var(--border-default)]">
            <Sparkles className="text-[var(--text-secondary)] w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">AI Command Center</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span>
              <span className="text-[16px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[var(--bg-base)]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center mt-1
              ${msg.role === "user" 
                ? "bg-[var(--bg-hover)] text-[var(--text-secondary)] border border-[var(--border-subtle)]" 
                : "bg-[var(--info-bg)] text-[var(--info)] border border-[var(--info)]/20"
              }`}
            >
              {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
            </div>
            
            {/* Message bubble */}
            <div className={`max-w-[85%] rounded-lg p-3.5 text-[15px] leading-relaxed border
              ${msg.role === "user"
                ? "bg-[var(--bg-hover)] text-[var(--text-primary)] border-[var(--border-default)]"
                : "bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-subtle)] shadow-sm"
              }`}
            >
              <div 
                className="prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: msg.content
                    .replace(/\n/g, "<br/>")
                    .replace(/\*\*(.*?)\*\*/g, "<strong class='text-white font-semibold'>$1</strong>")
                    .replace(/\|(.*)\|/g, (match) => {
                      if (match.includes("---")) return ""; // Skip separator
                      return `<div class="flex justify-between border-b border-[var(--border-subtle)] py-1 font-mono text-[15px]">${match.replace(/\|/g, "").trim()}</div>`;
                    })
                }} 
              />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center mt-1 bg-[var(--info-bg)] text-[var(--info)] border border-[var(--info)]/20">
              <Loader2 size={14} className="animate-spin" />
            </div>
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-3.5 w-16 flex justify-center shadow-sm">
              <span className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length < 3 && (
        <div className="px-4 pb-3 bg-[var(--bg-base)] flex gap-2 overflow-x-auto scrollbar-hide flex-wrap">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => setInput(suggestion)}
              className="text-[15px] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-md px-3 py-1.5 whitespace-nowrap transition-colors font-medium"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] relative z-10">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Command your operations agent..."
            className="w-full bg-[var(--bg-base)] border border-[var(--border-default)] rounded-md py-2.5 pl-4 pr-12 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 w-7 h-7 flex items-center justify-center rounded bg-[var(--text-primary)] text-black hover:bg-white disabled:opacity-50 disabled:hover:bg-[var(--text-primary)] transition-colors"
          >
            <ArrowRight size={14} className="font-bold" />
          </button>
        </form>
      </div>
    </div>
  );
}

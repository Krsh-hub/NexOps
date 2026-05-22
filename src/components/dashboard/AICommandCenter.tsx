"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, ArrowRight } from "lucide-react";

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
    <div className="glass-card flex flex-col h-full border border-[var(--border-active)] shadow-[var(--shadow-glow)] overflow-hidden">
      {/* Header */}
      <div className="bg-[var(--bg-elevated)]/80 border-b border-[var(--border-subtle)] p-4 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--accent-primary-glow)] flex items-center justify-center border border-[var(--accent-primary)]/30">
            <Sparkles className="text-[var(--accent-primary)]" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight text-glow">AI Cockpit</h2>
            <div className="flex items-center gap-1.5">
              <span className="status-dot status-dot-success"></span>
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium">Autonomous Mode Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-noise">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1
              ${msg.role === "user" 
                ? "bg-white/10 text-white" 
                : "bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 shadow-[var(--shadow-glow)]"
              }`}
            >
              {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            {/* Message bubble */}
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed
              ${msg.role === "user"
                ? "bg-[var(--bg-hover)] text-white rounded-tr-sm"
                : "bg-[var(--bg-elevated)]/80 border border-[var(--border-default)] text-[var(--text-primary)] rounded-tl-sm backdrop-blur-md shadow-sm"
              }`}
            >
              {/* Parse markdown-like bold for demo purposes */}
              <div 
                className="prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: msg.content
                    .replace(/\n/g, "<br/>")
                    .replace(/\*\*(.*?)\*\*/g, "<strong class='text-white font-semibold'>$1</strong>")
                    .replace(/\|(.*)\|/g, (match) => {
                      // Very basic table formatting for markdown tables in mock responses
                      if (match.includes("---")) return ""; // Skip separator
                      return `<div class="flex justify-between border-b border-white/10 py-1 font-mono text-xs">${match.replace(/\|/g, "").trim()}</div>`;
                    })
                }} 
              />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30">
              <Loader2 size={16} className="animate-spin" />
            </div>
            <div className="bg-[var(--bg-elevated)]/80 border border-[var(--border-default)] rounded-2xl rounded-tl-sm p-4 w-16 flex justify-center backdrop-blur-md">
              <span className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length < 3 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide flex-wrap">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => setInput(suggestion)}
              className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-[var(--text-secondary)] rounded-full px-3 py-1.5 whitespace-nowrap transition-colors flex items-center gap-1"
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
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-full py-3 pl-5 pr-12 text-sm text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--accent-primary)] text-black hover:bg-[var(--accent-primary-dim)] disabled:opacity-50 disabled:hover:bg-[var(--accent-primary)] transition-colors shadow-[var(--shadow-glow)]"
          >
            <ArrowRight size={16} className="font-bold" />
          </button>
        </form>
      </div>
    </div>
  );
}

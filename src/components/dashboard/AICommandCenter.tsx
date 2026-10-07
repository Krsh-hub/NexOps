"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  User,
  Sparkles,
  Loader2,
  ArrowRight,
  Package,
  FileText,
  AlertTriangle,
  ShoppingBag,
  TrendingUp,
  Clock,
  BarChart3,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  RefreshCw,
  Zap,
} from "lucide-react";

interface ToolCallInfo {
  id: string;
  name: string;
  args: Record<string, any>;
  result: any;
  status: "completed" | "failed";
}

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  toolCalls?: ToolCallInfo[];
  timestamp: string;
}

const TOOL_METADATA: Record<string, { label: string; icon: any; color: string }> = {
  create_invoice: { label: "Create Invoice", icon: FileText, color: "text-emerald-400" },
  update_inventory: { label: "Update Inventory", icon: Package, color: "text-blue-400" },
  detect_low_stock: { label: "Scan Low Stock", icon: AlertTriangle, color: "text-amber-400" },
  get_inventory_status: { label: "Inventory Status", icon: Package, color: "text-cyan-400" },
  get_financial_overview: { label: "Financial Overview", icon: TrendingUp, color: "text-indigo-400" },
  get_overdue_invoices: { label: "Overdue Invoices", icon: Clock, color: "text-rose-400" },
  create_purchase_order: { label: "Create Purchase Order", icon: ShoppingBag, color: "text-purple-400" },
  generate_summary: { label: "Generate Ops Summary", icon: BarChart3, color: "text-teal-400" },
  send_payment_reminder: { label: "Send Payment Reminder", icon: Clock, color: "text-amber-400" },
  search_products: { label: "Search Catalog", icon: Package, color: "text-blue-400" },
};

function formatMessageText(text: string) {
  // Format lines
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={idx} className="h-2" />;
    }

    // Bullet points
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const bulletContent = trimmed.substring(2);
      return (
        <div key={idx} className="flex items-start gap-2.5 my-1 pl-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0" />
          <span className="flex-1 leading-relaxed">
            {renderInlineMarkdown(bulletContent)}
          </span>
        </div>
      );
    }

    // Numbered lists
    const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberMatch) {
      return (
        <div key={idx} className="flex items-start gap-2.5 my-1 pl-1">
          <span className="text-[12px] font-mono font-bold text-[var(--accent)] bg-[var(--accent-subtle)] px-1.5 py-0.5 rounded shrink-0">
            {numberMatch[1]}
          </span>
          <span className="flex-1 leading-relaxed">
            {renderInlineMarkdown(numberMatch[2])}
          </span>
        </div>
      );
    }

    // Standard line
    return (
      <p key={idx} className="leading-relaxed my-0.5">
        {renderInlineMarkdown(line)}
      </p>
    );
  });
}

function renderInlineMarkdown(text: string) {
  // Split tokens for bold (**), code (`), currency (₹), and tags (#INV-)
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|₹[\d,]+|#?[A-Z]{2,4}-\d{3,4}-\d{2,4})/g);

  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[13px] font-mono text-cyan-300"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("₹")) {
      return (
        <span
          key={i}
          className="font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-1 py-0.2 rounded font-mono text-[13px]"
        >
          {part}
        </span>
      );
    }
    if (part.match(/^#?[A-Z]{2,4}-\d{3,4}-\d{2,4}$/)) {
      return (
        <span
          key={i}
          className="font-mono text-[13px] text-indigo-300 bg-indigo-950/40 border border-indigo-800/50 px-1.5 py-0.5 rounded font-semibold"
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

function ToolExecutionCard({ tool }: { tool: ToolCallInfo }) {
  const [expanded, setExpanded] = useState(false);
  const meta = TOOL_METADATA[tool.name] || {
    label: tool.name.replace(/_/g, " "),
    icon: Zap,
    color: "text-purple-400",
  };
  const Icon = meta.icon;

  return (
    <div className="rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-tertiary)]/70 overflow-hidden text-[13px] transition-all">
      <div
        onClick={() => setExpanded(!expanded)}
        className="px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[var(--bg-hover)] select-none"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded flex items-center justify-center bg-[var(--bg-primary)] border border-[var(--border-primary)] shrink-0">
            <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
          </div>
          <span className="font-semibold text-[var(--text-primary)] font-mono text-[12px]">
            {meta.label}
          </span>
          <span className="text-[11px] text-[var(--text-tertiary)] font-mono truncate hidden sm:inline">
            ({Object.keys(tool.args || {}).length} args)
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {tool.status === "completed" ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
              <CheckCircle2 className="w-3 h-3" /> Executed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800/40">
              <XCircle className="w-3 h-3" /> Failed
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[var(--border-primary)] bg-[var(--bg-primary)]/80 p-3 space-y-2 font-mono text-[12px]">
          <div>
            <div className="text-[10px] uppercase font-bold text-[var(--text-tertiary)] tracking-wider mb-1">
              Arguments
            </div>
            <pre className="p-2 rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)] overflow-x-auto text-[11px] leading-relaxed">
              {JSON.stringify(tool.args, null, 2)}
            </pre>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[var(--text-tertiary)] tracking-wider mb-1">
              Result
            </div>
            <pre className="p-2 rounded bg-[var(--bg-secondary)] text-emerald-300/90 overflow-x-auto text-[11px] leading-relaxed">
              {typeof tool.result === "string"
                ? tool.result
                : JSON.stringify(tool.result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export function AICommandCenter() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-1",
      role: "assistant",
      content:
        "Hello! I'm **NexOps AI**, your autonomous operations manager.\n\nI can execute multi-step operational tasks directly:\n- **Create and send invoices** with automated stock deduction\n- **Check inventory stockouts** and detect low stock thresholds\n- **Generate purchase orders** for registered vendors\n- **Track overdue receivables** and send payment reminders\n\nWhat would you like me to tackle?",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (messageText: string) => {
    const text = messageText.trim();
    if (!text || isLoading) return;

    setInput("");
    const userMsgId = `user-${Date.now()}`;
    const nowTime = new Date().toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const newMessages: Message[] = [
      ...messages,
      {
        id: userMsgId,
        role: "user",
        content: text,
        timestamp: nowTime,
      },
    ];

    setMessages(newMessages);
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: "assistant",
          content: data.message || "Operation completed.",
          toolCalls: data.toolCalls || [],
          timestamp: new Date().toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `❌ **Operation Failed**: ${error.message || "An unexpected error occurred while processing the request."}`,
          timestamp: new Date().toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `fresh-${Date.now()}`,
        role: "assistant",
        content: "Conversation history cleared. Ready for your next operational instruction.",
        timestamp: "Just now",
      },
    ]);
  };

  const suggestions = [
    { label: "Check Low Stock", prompt: "Scan inventory and detect all products below reorder threshold." },
    { label: "Create Invoice (XYZ Cafe)", prompt: "Create invoice for 5 Gourmet Cold Brew to XYZ Cafe." },
    { label: "Overdue Invoices", prompt: "List all overdue invoices and calculate total pending receivables." },
    { label: "Daily Summary", prompt: "Generate a comprehensive daily operations summary." },
  ];

  return (
    <div className="card-surface flex flex-col h-full rounded-2xl overflow-hidden border border-[var(--border-primary)] shadow-2xl bg-[var(--bg-secondary)]">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[var(--border-primary)]/70 bg-[var(--bg-secondary)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-bold text-[var(--text-primary)] tracking-tight">
                AI Operations Agent
              </h2>
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/30">
                Llama 3.3 · Active
              </span>
            </div>
            <p className="text-[12px] text-[var(--text-tertiary)]">
              Autonomous operations cockpit with tool execution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            title="Reset conversation"
            className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors text-[12px] flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Messages stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-[var(--bg-primary)]/40 scrollbar-hide">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[92%] sm:max-w-[85%] ${
                isUser ? "ml-auto flex-row-reverse" : "mr-auto flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                  isUser
                    ? "bg-[var(--bg-elevated)] border border-[var(--border-secondary)] text-[var(--text-secondary)]"
                    : "bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-500/20"
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Content Container */}
              <div className="flex-1 space-y-2 min-w-0">
                {/* Tool calls execution timeline if any */}
                {!isUser && msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="space-y-1.5 mb-2.5">
                    <div className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-tertiary)] flex items-center gap-1 pl-1">
                      <Zap className="w-3 h-3 text-[var(--accent)]" />
                      Actions Executed ({msg.toolCalls.length})
                    </div>
                    {msg.toolCalls.map((tool) => (
                      <ToolExecutionCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-4 text-[14px] leading-relaxed border transition-all ${
                    isUser
                      ? "bg-[var(--accent)] text-white border-transparent shadow-md shadow-[var(--accent)]/15 rounded-tr-sm"
                      : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border-primary)] shadow-sm rounded-tl-sm"
                  }`}
                >
                  <div className="space-y-1">{formatMessageText(msg.content)}</div>

                  {/* Bubble footer with timestamp and copy */}
                  <div
                    className={`flex items-center justify-between gap-3 mt-3 pt-2 text-[11px] font-mono ${
                      isUser
                        ? "text-blue-100/70 border-t border-blue-400/20"
                        : "text-[var(--text-tertiary)] border-t border-[var(--border-primary)]/50"
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 mr-auto max-w-[80%]">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="card-surface p-3.5 rounded-2xl rounded-tl-sm border border-[var(--border-primary)] flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-[var(--accent)] animate-spin" />
              <div className="text-[13px] text-[var(--text-secondary)]">
                Agent reasoning & executing tools...
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Actions */}
      <div className="px-4 py-2 border-t border-[var(--border-primary)]/50 bg-[var(--bg-secondary)]/50 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <span className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[var(--accent)]" /> Quick:
        </span>
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => handleSend(s.prompt)}
            className="text-[12px] px-2.5 py-1 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-primary)] transition-all whitespace-nowrap cursor-pointer hover:border-[var(--border-hover)] disabled:opacity-50"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Instruct the agent (e.g. 'Create invoice for 5 Cold Brew to XYZ Cafe')..."
            disabled={isLoading}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl py-3 pl-4 pr-12 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)] transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 w-8 h-8 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent-hover)] disabled:opacity-30 disabled:hover:bg-[var(--accent)] transition-all cursor-pointer shadow-sm shadow-[var(--accent)]/30"
          >
            <ArrowRight className="w-4 h-4 font-bold" />
          </button>
        </form>
      </div>
    </div>
  );
}

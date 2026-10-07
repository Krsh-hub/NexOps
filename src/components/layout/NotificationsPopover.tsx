"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  X,
  Sparkles,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: "CRITICAL" | "WARNING" | "INFO" | "SUCCESS";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "CRITICAL",
    title: "Out of Stock: Avocado Toast Mix",
    message: "Stock has dropped to 0 kg. Reorder quantity recommended: 10 kg from Daily Fresh Dairy.",
    createdAt: "10m ago",
    read: false,
    actionUrl: "/inventory",
  },
  {
    id: "notif-2",
    type: "WARNING",
    title: "Critical Stock: Caramel Syrup",
    message: "2 bottles left (threshold is 10). Consider issuing a purchase order soon.",
    createdAt: "1h ago",
    read: false,
    actionUrl: "/inventory",
  },
  {
    id: "notif-3",
    type: "WARNING",
    title: "Overdue Invoice: INV-2026-002",
    message: "Greenwood Cafe owes ₹6,500. Invoice was due 3 days ago.",
    createdAt: "3h ago",
    read: false,
    actionUrl: "/finance",
  },
  {
    id: "notif-4",
    type: "INFO",
    title: "Automated Daily Scan Completed",
    message: "NexOps autonomous agent reviewed 10 products and 6 invoices.",
    createdAt: "Yesterday",
    read: true,
    actionUrl: "/ai",
  },
];

export function NotificationsPopover({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [items, setItems] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nexops_notifications");
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const save = (updated: NotificationItem[]) => {
    setItems(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("nexops_notifications", JSON.stringify(updated));
    }
  };

  const markAllAsRead = () => {
    const updated = items.map((i) => ({ ...i, read: true }));
    save(updated);
  };

  const removeItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    save(updated);
  };

  const runScanNow = async () => {
    setIsScanning(true);
    setScanMessage(null);
    try {
      const res = await fetch("/api/chat", { method: "GET" });
      const data = await res.json();
      setScanMessage(data.message || "Proactive scan executed.");
      // Add a scan notification
      const newNotif: NotificationItem = {
        id: `scan-${Date.now()}`,
        type: "SUCCESS",
        title: "Proactive Scan Complete",
        message: "Analyzed inventory thresholds and invoice payment schedules.",
        createdAt: "Just now",
        read: false,
        actionUrl: "/ai",
      };
      save([newNotif, ...items]);
    } catch {
      setScanMessage("Scan failed. System operational.");
    } finally {
      setIsScanning(false);
    }
  };

  if (!open) return null;

  const unreadCount = items.filter((i) => !i.read).length;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-end p-4 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fade-in mt-12"
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-primary)]/80 bg-[var(--bg-tertiary)]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-[14px] font-bold text-[var(--text-primary)]">
              Notifications & Alerts
            </h3>
            {unreadCount > 0 && (
              <span className="text-[11px] font-bold bg-[var(--red-subtle)] text-[var(--red)] px-2 py-0.5 rounded-full border border-[var(--red)]/20">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-[var(--accent)] hover:underline font-semibold cursor-pointer"
              >
                Mark read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[var(--text-tertiary)] hover:text-white hover:bg-[var(--bg-hover)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scan Banner */}
        <div className="px-4 py-2.5 bg-[var(--bg-tertiary)]/70 border-b border-[var(--border-primary)]/50 flex items-center justify-between text-[12px]">
          <span className="text-[var(--text-secondary)] flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" /> Autonomous Scanner
          </span>
          <button
            onClick={runScanNow}
            disabled={isScanning}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-[var(--accent-subtle)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all font-semibold disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isScanning ? "animate-spin" : ""}`} />
            {isScanning ? "Scanning..." : "Run Scan"}
          </button>
        </div>

        {scanMessage && (
          <div className="px-4 py-2 bg-emerald-950/40 border-b border-emerald-800/40 text-emerald-300 text-[11px] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            {scanMessage}
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-primary)]/50 p-1">
          {items.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-tertiary)] text-[13px]">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500/50" />
              All clear! No pending operational alerts.
            </div>
          ) : (
            items.map((item) => {
              const isCrit = item.type === "CRITICAL";
              const isWarn = item.type === "WARNING";
              const isSuccess = item.type === "SUCCESS";

              return (
                <div
                  key={item.id}
                  className={`p-3.5 hover:bg-[var(--bg-hover)] transition-all flex items-start gap-3 rounded-xl m-1 ${
                    !item.read ? "bg-[var(--bg-tertiary)]/40" : ""
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isCrit
                        ? "bg-rose-950/60 text-rose-400 border border-rose-800/40"
                        : isWarn
                        ? "bg-amber-950/60 text-amber-400 border border-amber-800/40"
                        : isSuccess
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                        : "bg-blue-950/60 text-blue-400 border border-blue-800/40"
                    }`}
                  >
                    {isCrit || isWarn ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : isSuccess ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[13px] font-semibold text-[var(--text-primary)] truncate">
                        {item.title}
                      </p>
                      <span className="text-[11px] text-[var(--text-tertiary)] shrink-0 font-mono">
                        {item.createdAt}
                      </span>
                    </div>

                    <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                      {item.message}
                    </p>

                    <div className="pt-1 flex items-center justify-between">
                      {item.actionUrl ? (
                        <Link
                          href={item.actionUrl}
                          onClick={onClose}
                          className="text-[11px] font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                        >
                          Review details <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span />
                      )}

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[11px] text-[var(--text-quaternary)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

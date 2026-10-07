"use client";

import { useState, useEffect } from "react";
import {
  User,
  Palette,
  Bot,
  Bell,
  Shield,
  CheckCircle2,
  Save,
  Key,
  Database,
  Sparkles,
  RotateCcw,
} from "lucide-react";

interface SettingsState {
  businessName: string;
  currency: string;
  taxRate: string;
  email: string;
  phone: string;
  address: string;
  aiAutonomyMode: "autonomous" | "confirmation";
  proactiveInterval: string;
  notifyLowStock: boolean;
  notifyOverdue: boolean;
  notifyDailyDigest: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  businessName: "Brew & Bite Café",
  currency: "INR (₹)",
  taxRate: "18",
  email: "operations@brewandbite.com",
  phone: "+91 98765 43210",
  address: "12th Main, Indiranagar, Bangalore, Karnataka",
  aiAutonomyMode: "autonomous",
  proactiveInterval: "1h",
  notifyLowStock: true,
  notifyOverdue: true,
  notifyDailyDigest: true,
};

export function SettingsManager() {
  const [activeTab, setActiveTab] = useState<"profile" | "ai" | "notifications" | "security">("profile");
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [toastText, setToastText] = useState("Preferences updated and saved successfully.");
  const [dbStats, setDbStats] = useState<any>(null);
  const [isResetting, setIsResetting] = useState(false);

  const fetchDbStats = async () => {
    try {
      const res = await fetch("/api/db");
      if (res.ok) {
        const data = await res.json();
        setDbStats(data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nexops_user_settings");
      if (stored) {
        try {
          setSettings(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    }
    fetchDbStats();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("nexops_user_settings", JSON.stringify(settings));
    }
    setToastText("Preferences updated and saved successfully.");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetDb = async () => {
    if (!confirm("Are you sure you want to reset the database to demo sample data?")) return;
    setIsResetting(true);
    try {
      const res = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      if (res.ok) {
        await fetchDbStats();
        setToastText("Database reset to original demo data successfully!");
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      alert("Failed to reset database");
    } finally {
      setIsResetting(false);
    }
  };

  const tabs = [
    { id: "profile" as const, label: "Business Profile", icon: User },
    { id: "ai" as const, label: "AI Operations & Autonomy", icon: Bot },
    { id: "notifications" as const, label: "Alert Triggers", icon: Bell },
    { id: "security" as const, label: "Integrations & API", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--bg-elevated)] border border-[var(--border-secondary)] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-fade-in text-[13px] font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastText}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-primary)]/70 pb-2 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-hover)]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <form onSubmit={handleSave} className="card-surface p-5 sm:p-6 rounded-2xl border border-[var(--border-primary)] space-y-6 max-w-[800px]">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-[16px] font-bold text-[var(--text-primary)]">
                Business & Organization Details
              </h3>
              <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">
                Configures headers for generated invoices, purchase orders, and financial reports.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5">
                  Business Entity Name
                </label>
                <input
                  type="text"
                  value={settings.businessName}
                  onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5">
                  Currency Symbol & Code
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                >
                  <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                  <option value="USD ($)">USD ($) - US Dollar</option>
                  <option value="EUR (€)">EUR (€) - Euro</option>
                  <option value="GBP (£)">GBP (£) - British Pound</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5">
                  Default Tax / GST Rate (%)
                </label>
                <input
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5">
                  Operations Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5">
                  Operating Address
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>
          </div>
        )}

        {/* AI Tab */}
        {activeTab === "ai" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-[16px] font-bold text-[var(--text-primary)]">
                Autonomous Agent Configuration
              </h3>
              <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">
                Tune the level of autonomy granted to the NexOps Llama 3.3 orchestrator.
              </p>
            </div>

            <div className="space-y-3">
              <div
                onClick={() => setSettings({ ...settings, aiAutonomyMode: "autonomous" })}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  settings.aiAutonomyMode === "autonomous"
                    ? "bg-[var(--accent-subtle)] border-[var(--accent)]"
                    : "bg-[var(--bg-tertiary)]/50 border-[var(--border-primary)] hover:border-[var(--border-hover)]"
                }`}
              >
                <input
                  type="radio"
                  name="autonomy"
                  checked={settings.aiAutonomyMode === "autonomous"}
                  onChange={() => {}}
                  className="mt-1"
                />
                <div>
                  <div className="text-[14px] font-bold text-white flex items-center gap-2">
                    Full Autonomous Mode (Recommended)
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Active
                    </span>
                  </div>
                  <div className="text-[12px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                    The agent automatically invokes inventory updates, drafts invoices, and dispatches reminder tools without waiting for manual confirmation.
                  </div>
                </div>
              </div>

              <div
                onClick={() => setSettings({ ...settings, aiAutonomyMode: "confirmation" })}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  settings.aiAutonomyMode === "confirmation"
                    ? "bg-[var(--accent-subtle)] border-[var(--accent)]"
                    : "bg-[var(--bg-tertiary)]/50 border-[var(--border-primary)] hover:border-[var(--border-hover)]"
                }`}
              >
                <input
                  type="radio"
                  name="autonomy"
                  checked={settings.aiAutonomyMode === "confirmation"}
                  onChange={() => {}}
                  className="mt-1"
                />
                <div>
                  <div className="text-[14px] font-bold text-white">
                    Supervised Co-pilot Mode
                  </div>
                  <div className="text-[12px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                    The agent proposes tool executions and asks for explicit operator approval before modifying data or placing purchase orders.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5">
                Proactive Background Scanner Frequency
              </label>
              <select
                value={settings.proactiveInterval}
                onChange={(e) => setSettings({ ...settings, proactiveInterval: e.target.value })}
                className="w-full sm:w-64 h-10 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="15m">Every 15 minutes</option>
                <option value="1h">Every 1 hour (Default)</option>
                <option value="6h">Every 6 hours</option>
                <option value="24h">Once daily at 08:00 AM</option>
              </select>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-[16px] font-bold text-[var(--text-primary)]">
                Autonomous Alert Channels
              </h3>
              <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">
                Decide when NexOps sounds alarm bells in the navigation notification center.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "notifyLowStock" as const,
                  label: "Critical & Low Stock Notifications",
                  desc: "Trigger urgent alerts when any product stock drops at or below reorder threshold.",
                },
                {
                  id: "notifyOverdue" as const,
                  label: "Overdue Invoice Escalations",
                  desc: "Generate warnings when client payment terms exceed invoice due dates.",
                },
                {
                  id: "notifyDailyDigest" as const,
                  label: "Daily Autonomous Digest",
                  desc: "Morning recap of yesterday's sales revenue, inventory changes, and upcoming tasks.",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-primary)] flex items-center justify-between"
                >
                  <div className="pr-4">
                    <div className="text-[13px] font-semibold text-white">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings[item.id]}
                    onChange={(e) => setSettings({ ...settings, [item.id]: e.target.checked })}
                    className="w-4 h-4 accent-[var(--accent)] rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security & API Tab */}
        {activeTab === "security" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-[16px] font-bold text-[var(--text-primary)]">
                Integrations & API Connections
              </h3>
              <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">
                Live status of external LLM engines and persistence databases.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-primary)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-950/60 border border-orange-800/50 flex items-center justify-center text-orange-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-white flex items-center gap-2">
                      Groq API Key (Llama 3.3 70B)
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        Connected
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
                      High-throughput LLM tool calling via OpenAI-compatible endpoint.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-primary)] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400 shrink-0">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-white flex items-center gap-2">
                        Persistent File Database
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          Active & Saved
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
                        Storage file: <code className="text-emerald-300 font-mono text-[10.5px]">data/nexops_db.json</code> (changes stay saved across restarts)
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetDb}
                    disabled={isResetting}
                    className="px-3 py-1.5 rounded-lg border border-red-900/60 bg-red-950/40 hover:bg-red-900/50 text-red-300 text-[11px] font-medium flex items-center gap-1.5 cursor-pointer transition-all self-start sm:self-auto shrink-0"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
                    <span>{isResetting ? "Resetting..." : "Reset to Demo Data"}</span>
                  </button>
                </div>

                {dbStats?.counts && (
                  <div className="pt-2 border-t border-[var(--border-primary)]/50 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="text-[var(--text-tertiary)]">Current Records:</span>
                    <span className="px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-primary)]">
                      {dbStats.counts.products} Products
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-primary)]">
                      {dbStats.counts.invoices} Invoices
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-primary)]">
                      {dbStats.counts.vendors} Vendors
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-primary)]">
                      {dbStats.counts.activities} AI Logs
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-4 border-t border-[var(--border-primary)]/70 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[13px] font-semibold shadow-md shadow-[var(--accent)]/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Bot,
  Bell,
  Shield,
  CheckCircle2,
  Save,
  Key,
  Database,
  RotateCcw,
  ChevronRight,
  Sparkles,
  Command,
  FileText,
  Sliders,
  Check,
  Zap,
  Cpu,
} from "lucide-react";

interface SettingsState {
  businessName: string;
  operatorName: string;
  businessCategory: string;
  taxId: string;
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
  notifyHighValue: boolean;
}

interface SettingsManagerProps {
  initialProfile?: {
    businessName?: string;
    operatorName?: string;
    currencySymbol?: string;
    currencyCode?: string;
    businessType?: string;
  } | null;
}

export function SettingsManager({ initialProfile }: SettingsManagerProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "ai" | "notifications" | "security">("profile");
  const [settings, setSettings] = useState<SettingsState>({
    businessName: initialProfile?.businessName || "Brew & Bite Café",
    operatorName: initialProfile?.operatorName || "Lead Operator",
    businessCategory: initialProfile?.businessType || "F&B / Specialty Café",
    taxId: "29AABCU9603R1ZM",
    currency: initialProfile?.currencyCode === "INR" ? "INR (₹)" : "INR (₹)",
    taxRate: "18",
    email: "operations@brewandbite.com",
    phone: "+91 98765 43210",
    address: "12th Main, Indiranagar, Bangalore, Karnataka",
    aiAutonomyMode: "autonomous",
    proactiveInterval: "1h",
    notifyLowStock: true,
    notifyOverdue: true,
    notifyDailyDigest: true,
    notifyHighValue: true,
  });

  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastText, setToastText] = useState("Preferences saved and synchronized successfully.");
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
          const parsed = JSON.parse(stored);
          setSettings((prev) => ({
            ...prev,
            ...parsed,
            ...(initialProfile?.businessName && { businessName: initialProfile.businessName }),
            ...(initialProfile?.operatorName && { operatorName: initialProfile.operatorName }),
            ...(initialProfile?.businessType && { businessCategory: initialProfile.businessType }),
          }));
        } catch {
          // ignore
        }
      } else if (initialProfile) {
        setSettings((prev) => ({
          ...prev,
          ...(initialProfile.businessName && { businessName: initialProfile.businessName }),
          ...(initialProfile.operatorName && { operatorName: initialProfile.operatorName }),
          ...(initialProfile.businessType && { businessCategory: initialProfile.businessType }),
        }));
      }
    }
    fetchDbStats();
  }, [initialProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("nexops_user_settings", JSON.stringify(settings));
      }

      let sym = "₹";
      let code = "INR";
      if (settings.currency.includes("$")) {
        sym = "$";
        code = "USD";
      } else if (settings.currency.includes("€")) {
        sym = "€";
        code = "EUR";
      } else if (settings.currency.includes("£")) {
        sym = "£";
        code = "GBP";
      }

      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          businessName: settings.businessName,
          operatorName: settings.operatorName,
          businessType: settings.businessCategory,
          currencySymbol: sym,
          currencyCode: code,
        }),
      });

      setToastText("Preferences updated and synchronized to database.");
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch {
      setToastText("Saved locally.");
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } finally {
      setIsSaving(false);
    }
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
        setToastText("Database reset to demo sample data successfully!");
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
      }
    } catch {
      alert("Failed to reset database");
    } finally {
      setIsResetting(false);
    }
  };

  const tabs = [
    {
      id: "profile" as const,
      label: "Business Profile",
      sub: "Entity headers, currency & GST",
      icon: Building2,
      badge: "IDENTITY",
    },
    {
      id: "ai" as const,
      label: "AI Operations & Autonomy",
      sub: "Llama 3.3 mode & scan intervals",
      icon: Bot,
      badge: "AGENT CORE",
    },
    {
      id: "notifications" as const,
      label: "Alert Triggers",
      sub: "Stock shortages & overdue alarms",
      icon: Bell,
      badge: "MONITORS",
    },
    {
      id: "security" as const,
      label: "Integrations & Database",
      sub: "API connections & JSON persistence",
      icon: Shield,
      badge: "SYSTEM",
    },
  ];

  return (
    <div className="w-full flex-1 flex flex-col space-y-6">
      {/* Toast Notification */}
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-fade-in text-[13px] font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastText}</span>
        </div>
      )}

      {/* Main 2-Column Full-Screen Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start flex-1 w-full">
        {/* Left Column: Vertical Section Navigation & System Diagnostics */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <div className="px-1 flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Configuration Sections
            </h3>
            <span className="text-[11px] font-mono text-slate-400 font-medium">4 areas</span>
          </div>

          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                    isActive
                      ? "bg-emerald-50/80 border-emerald-300 shadow-2xs text-slate-900 ring-1 ring-emerald-500/15"
                      : "bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700 hover:border-slate-300 shadow-2xs"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? "bg-emerald-700 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/70 group-hover:text-slate-800"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[13px] font-bold truncate ${isActive ? "text-emerald-950" : "text-slate-900"}`}>
                          {tab.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                        {tab.sub}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? "text-emerald-700 translate-x-0.5" : "text-slate-300 group-hover:text-slate-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* System Telemetry & Persistence Card */}
          <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
              <span>Persistence Status</span>
              <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                SYNCED
              </span>
            </div>
            <div className="text-[12px] space-y-2 pt-0.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Database:</span>
                <span className="font-mono text-[11px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/80">
                  nexops_db.json
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Orchestrator:</span>
                <span className="font-mono text-[11px] font-semibold text-slate-700">
                  Llama 3.3 (70B)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Autonomy:</span>
                <span className="font-mono text-[11px] font-semibold text-emerald-700">
                  {settings.aiAutonomyMode === "autonomous" ? "Autonomous" : "Supervised"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Latency:</span>
                <span className="font-mono text-[11px] font-semibold text-slate-700">
                  3ms (Edge Local)
                </span>
              </div>
            </div>
          </div>

          {/* Developer Keyboard Shortcuts Card */}
          <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
              <span>Fast Keys</span>
              <Command className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center justify-between">
                <span>Save Preferences</span>
                <kbd className="kbd-badge">⌘S</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>AI Command Dock</span>
                <kbd className="kbd-badge">⌘K</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Create Invoice</span>
                <kbd className="kbd-badge">N</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Add Product</span>
                <kbd className="kbd-badge">P</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Full-Height Configuration Details Panel */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col flex-1 h-full w-full">
          <form
            onSubmit={handleSave}
            className="linear-card p-6 sm:p-8 flex flex-col justify-between flex-1 space-y-7 w-full shadow-xs min-h-[620px]"
          >
            {/* 1. Business Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[18px] font-bold text-slate-900 tracking-tight">
                        Business & Organization Details
                      </h3>
                      <span className="hash-badge">SECTION: PROFILE</span>
                    </div>
                    <p className="text-[13px] text-slate-500 mt-1 font-medium">
                      Configures headers for generated invoices, purchase orders, financial reports, and workspace titles.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                      Business Entity Name
                    </label>
                    <input
                      type="text"
                      value={settings.businessName}
                      onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                      placeholder="e.g. Brew & Bite Café"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-[14px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                      Operator / Owner Name
                    </label>
                    <input
                      type="text"
                      value={settings.operatorName}
                      onChange={(e) => setSettings({ ...settings, operatorName: e.target.value })}
                      placeholder="e.g. Lead Operator"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-[14px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                      Business Category
                    </label>
                    <select
                      value={settings.businessCategory}
                      onChange={(e) => setSettings({ ...settings, businessCategory: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-[14px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all cursor-pointer"
                    >
                      <option value="F&B / Specialty Café">F&B / Specialty Café</option>
                      <option value="Retail & Inventory">Retail & Inventory</option>
                      <option value="E-Commerce Store">E-Commerce Store</option>
                      <option value="Professional Services">Professional Services</option>
                      <option value="Wholesale & Distribution">Wholesale & Distribution</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                      Currency Symbol & Code
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-[14px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all cursor-pointer"
                    >
                      <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                      <option value="USD ($)">USD ($) - US Dollar</option>
                      <option value="EUR (€)">EUR (€) - Euro</option>
                      <option value="GBP (£)">GBP (£) - British Pound</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                      Default Tax / GST Rate (%)
                    </label>
                    <input
                      type="number"
                      value={settings.taxRate}
                      onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-[14px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                      Tax Identifier / GSTIN
                    </label>
                    <input
                      type="text"
                      value={settings.taxId}
                      onChange={(e) => setSettings({ ...settings, taxId: e.target.value })}
                      placeholder="e.g. 29AABCU9603R1ZM"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-[14px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                      Operations Email
                    </label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      placeholder="e.g. operations@brewandbite.com"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-[14px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-[14px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    />
                  </div>

                  <div className="md:col-span-2 lg:col-span-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                      Operating Address
                    </label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      placeholder="e.g. 12th Main, Indiranagar, Bangalore"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-[14px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    />
                  </div>
                </div>

                {/* Live Invoice & Order Header Preview Card */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200/90 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-700" />
                      <span className="text-[12px] font-mono font-bold uppercase tracking-wider text-slate-700">
                        Live Invoice & PO Header Preview
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      FORMAT: AUTO-COMPOSED
                    </span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-white border border-slate-200/80 text-[12px] text-slate-700 font-mono space-y-1 shadow-2xs">
                    <div className="font-bold text-[13px] text-slate-900">{settings.businessName || "My Business"}</div>
                    <div className="text-slate-500">{settings.address} · Phone: {settings.phone}</div>
                    <div className="text-slate-500">GSTIN / Tax ID: <span className="text-slate-800 font-semibold">{settings.taxId}</span> · Standard GST: {settings.taxRate}%</div>
                    <div className="text-slate-400 pt-0.5">Authorized Signatory: {settings.operatorName}</div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. AI Autonomy Tab */}
            {activeTab === "ai" && (
              <div className="space-y-6">
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[18px] font-bold text-slate-900 tracking-tight">
                        Autonomous Agent Configuration
                      </h3>
                      <span className="hash-badge">SECTION: AI_ORCHESTRATOR</span>
                    </div>
                    <p className="text-[13px] text-slate-500 mt-1 font-medium">
                      Tune the level of autonomy granted to the NexOps Llama 3.3 operations engine.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onClick={() => setSettings({ ...settings, aiAutonomyMode: "autonomous" })}
                    className={`p-5 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                      settings.aiAutonomyMode === "autonomous"
                        ? "bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-500/20 shadow-2xs"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs"
                    }`}
                  >
                    <input
                      type="radio"
                      name="autonomy"
                      checked={settings.aiAutonomyMode === "autonomous"}
                      onChange={() => setSettings({ ...settings, aiAutonomyMode: "autonomous" })}
                      className="mt-1 accent-emerald-600"
                    />
                    <div className="space-y-1">
                      <div className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
                        <span>Full Autonomous Mode</span>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Active
                        </span>
                      </div>
                      <p className="text-[12.5px] text-slate-600 leading-relaxed font-normal">
                        The agent automatically invokes inventory adjustments, drafts customer invoices, and updates order statuses when commanded.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setSettings({ ...settings, aiAutonomyMode: "confirmation" })}
                    className={`p-5 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                      settings.aiAutonomyMode === "confirmation"
                        ? "bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-500/20 shadow-2xs"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs"
                    }`}
                  >
                    <input
                      type="radio"
                      name="autonomy"
                      checked={settings.aiAutonomyMode === "confirmation"}
                      onChange={() => setSettings({ ...settings, aiAutonomyMode: "confirmation" })}
                      className="mt-1 accent-emerald-600"
                    />
                    <div className="space-y-1">
                      <div className="text-[14px] font-bold text-slate-900">
                        Supervised Co-pilot Mode
                      </div>
                      <p className="text-[12.5px] text-slate-600 leading-relaxed font-normal">
                        The agent proposes tool parameters and queries explicit operator confirmation before making database modifications or placing purchase orders.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
                    Proactive Background Scanner Frequency
                  </label>
                  <select
                    value={settings.proactiveInterval}
                    onChange={(e) => setSettings({ ...settings, proactiveInterval: e.target.value })}
                    className="w-full sm:w-80 h-11 px-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-[14px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all cursor-pointer"
                  >
                    <option value="15m">Every 15 minutes</option>
                    <option value="1h">Every 1 hour (Default)</option>
                    <option value="6h">Every 6 hours</option>
                    <option value="24h">Once daily at 08:00 AM</option>
                  </select>
                </div>
              </div>
            )}

            {/* 3. Alert Triggers Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[18px] font-bold text-slate-900 tracking-tight">
                        Autonomous Alert Channels & Alarms
                      </h3>
                      <span className="hash-badge">SECTION: ALERTS</span>
                    </div>
                    <p className="text-[13px] text-slate-500 mt-1 font-medium">
                      Configure when NexOps displays notification badges and triggers urgency cards.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      id: "notifyLowStock" as const,
                      label: "Critical & Low Stock Notifications",
                      desc: "Trigger urgent alerts when any product stock drops at or below minimum threshold.",
                    },
                    {
                      id: "notifyOverdue" as const,
                      label: "Overdue Invoice Escalations",
                      desc: "Generate warnings when client payment terms exceed assigned invoice due dates.",
                    },
                    {
                      id: "notifyDailyDigest" as const,
                      label: "Daily Autonomous Digest Recaps",
                      desc: "Summary recap of revenue trends, inventory movements, and pending actions.",
                    },
                    {
                      id: "notifyHighValue" as const,
                      label: "High-Value Transaction Monitor",
                      desc: "Flag orders and invoices exceeding ₹50,000 for secondary verification.",
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs hover:border-slate-300 transition-all"
                    >
                      <div className="pr-4 space-y-0.5">
                        <div className="text-[13.5px] font-bold text-slate-900">
                          {item.label}
                        </div>
                        <div className="text-[12px] text-slate-500">
                          {item.desc}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings[item.id]}
                        onChange={(e) => setSettings({ ...settings, [item.id]: e.target.checked })}
                        className="w-4 h-4 accent-emerald-600 rounded cursor-pointer shrink-0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Integrations & Database Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[18px] font-bold text-slate-900 tracking-tight">
                        Integrations & Database Connections
                      </h3>
                      <span className="hash-badge">SECTION: INTEGRATIONS</span>
                    </div>
                    <p className="text-[13px] text-slate-500 mt-1 font-medium">
                      Review live connectivity to AI orchestrator endpoints and reset demo fixtures.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
                          <span>Groq Llama 3.3 (70B) Orchestrator</span>
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Connected
                          </span>
                        </div>
                        <div className="text-[12px] text-slate-500 mt-0.5 font-medium">
                          High-speed tool execution endpoint with function-calling capabilities.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 space-y-4 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                          <Database className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
                            <span>Persistent Local File Database</span>
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Active & Saved
                            </span>
                          </div>
                          <div className="text-[12px] text-slate-500 mt-0.5 font-medium">
                            Storage target: <code className="text-emerald-700 font-mono text-[11px] font-semibold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">data/nexops_db.json</code>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetDb}
                        disabled={isResetting}
                        className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer transition-all self-start sm:self-auto shrink-0 shadow-2xs"
                      >
                        <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
                        <span>{isResetting ? "Resetting..." : "Reset to Demo Sample Data"}</span>
                      </button>
                    </div>

                    {dbStats?.counts && (
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="text-slate-400 font-mono uppercase font-semibold">Active Records:</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200 font-mono">
                          {dbStats.counts.products} Products
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200 font-mono">
                          {dbStats.counts.invoices} Invoices
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200 font-mono">
                          {dbStats.counts.vendors} Vendors
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200 font-mono">
                          {dbStats.counts.activities} AI Logs
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Form Actions Bar */}
            <div className="pt-6 border-t border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
              <div className="text-[12px] text-slate-500 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Changes persist automatically across all workspace views and invoices.</span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-[13px] font-semibold shadow-2xs flex items-center gap-2 cursor-pointer transition-all shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Saving..." : "Save Preferences"}</span>
                  <kbd className="kbd-badge bg-emerald-800/80 border-emerald-600/60 text-white ml-0.5">⌘S</kbd>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

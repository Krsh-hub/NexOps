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
  FileText,
  Info,
  CreditCard,
  Lock,
  Download,
  Sliders,
  Receipt,
  Globe,
  Wallet,
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
  // Banking & settlements
  bankName: string;
  bankAccount: string;
  bankIfsc: string;
  upiId: string;
  paymentTerms: string;
  invoicePrefix: string;
  invoiceNotes: string;
  // AI Autonomy
  aiAutonomyMode: "autonomous" | "confirmation";
  proactiveInterval: string;
  maxAutoReorderAmount: string;
  aiTone: string;
  // Alerts
  notifyLowStock: boolean;
  notifyOverdue: boolean;
  notifyDailyDigest: boolean;
  notifyHighValue: boolean;
  webhookUrl: string;
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
    bankName: "HDFC Bank - Commercial Current",
    bankAccount: "50200084920194",
    bankIfsc: "HDFC0001234",
    upiId: "cafelatte@hdfcbank",
    paymentTerms: "Due on Receipt",
    invoicePrefix: "INV-2026-",
    invoiceNotes: "Thank you for your business! Please settle payments as per assigned terms. All goods delivered in verified condition.",
    aiAutonomyMode: "autonomous",
    proactiveInterval: "1h",
    maxAutoReorderAmount: "25000",
    aiTone: "Professional & Concise",
    notifyLowStock: true,
    notifyOverdue: true,
    notifyDailyDigest: true,
    notifyHighValue: true,
    webhookUrl: "https://hooks.slack.com/services/T00/B00/XXXXX",
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

  const handleExportData = () => {
    if (!dbStats) return;
    const blob = new Blob([JSON.stringify(dbStats, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexops_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
      sub: "Identity, banking & invoice terms",
      icon: Building2,
      iconColor: "text-blue-600 bg-blue-50 border-blue-200/80",
    },
    {
      id: "ai" as const,
      label: "AI Autonomy & Operations",
      sub: "Llama 3.3 mode, guardrails & triggers",
      icon: Bot,
      iconColor: "text-purple-600 bg-purple-50 border-purple-200/80",
    },
    {
      id: "notifications" as const,
      label: "Alerts & Escalations",
      sub: "Stock shortages, webhooks & notices",
      icon: Bell,
      iconColor: "text-amber-600 bg-amber-50 border-amber-200/80",
    },
    {
      id: "security" as const,
      label: "Integrations & Database",
      sub: "AI endpoints, backups & persistence",
      icon: Shield,
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200/80",
    },
  ];

  return (
    <div className="w-full flex-1 flex flex-col space-y-6">
      {/* Toast Notification */}
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-fade-in text-[13px] font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastText}</span>
        </div>
      )}

      {/* Main 2-Column Full-Screen Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start flex-1 w-full">
        {/* Left Column: Vertical Section Navigation & System Tools */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <div className="px-1 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-slate-400">
              Settings Navigation
            </span>
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
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                    isActive
                      ? "bg-white border-slate-300/90 shadow-sm ring-1 ring-slate-900/5"
                      : "bg-white/80 hover:bg-white border-slate-200/80 text-slate-700 hover:border-slate-300 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${tab.iconColor}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-semibold text-slate-900 truncate">
                        {tab.label}
                      </div>
                      <p className="text-[11.5px] text-slate-500 truncate mt-0.5 font-normal">
                        {tab.sub}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? "text-slate-900 translate-x-0.5" : "text-slate-300 group-hover:text-slate-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* System Information Card */}
          <div className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-500">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Workspace Details</span>
            </div>
            <div className="text-[12.5px] space-y-2 pt-0.5">
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-400">Environment</span>
                <span className="font-medium text-slate-800">Production</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-400">AI Engine</span>
                <span className="font-medium text-slate-800">Llama 3.3 (70B)</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-400">Database Engine</span>
                <span className="font-medium text-slate-800">JSON DB (Local)</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-400">Status</span>
                <span className="font-medium text-emerald-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Active & Synced
                </span>
              </div>
            </div>
          </div>

          {/* Security & Compliance Widget */}
          <div className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-500">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Security & Reliability</span>
            </div>
            <div className="text-[12px] space-y-2 text-slate-600">
              <div className="flex items-center justify-between">
                <span>TLS 1.3 Transport</span>
                <span className="text-emerald-700 font-medium">Encrypted</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Database Backup</span>
                <span className="text-slate-700 font-medium">Hourly Snapshots</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Operator Role</span>
                <span className="text-slate-700 font-medium">Super Administrator</span>
              </div>
            </div>
          </div>

          {/* Quick Data Export Card */}
          <div className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-[12px] font-semibold text-slate-600">
              <span>Quick Snapshot Export</span>
              <Download className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-[11.5px] text-slate-500 leading-relaxed">
              Export an immediate JSON snapshot of all products, invoices, vendors, and audit events.
            </p>
            <button
              type="button"
              onClick={handleExportData}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[12px] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download Backup (.JSON)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Comprehensive Enterprise Configuration Panel */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col flex-1 h-full w-full">
          <form
            onSubmit={handleSave}
            className="apple-card p-7 sm:p-9 flex flex-col justify-between flex-1 space-y-8 w-full shadow-xs"
          >
            {/* 1. Business Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-8">
                {/* Section Header */}
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-[20px] font-bold text-slate-900 tracking-tight">
                    Business Profile & Commercial Headers
                  </h3>
                  <p className="text-[13px] text-slate-500 mt-1 font-normal">
                    Configures entity information, tax identifiers, banking details, and payment terms across all documents.
                  </p>
                </div>

                {/* Group 1: General Business Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-slate-800">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>General Organization Identity</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                        Business Entity Name
                      </label>
                      <input
                        type="text"
                        value={settings.businessName}
                        onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                        placeholder="e.g. Brew & Bite Café"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                        Operator / Owner Name
                      </label>
                      <input
                        type="text"
                        value={settings.operatorName}
                        onChange={(e) => setSettings({ ...settings, operatorName: e.target.value })}
                        placeholder="e.g. Lead Operator"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                        Business Category
                      </label>
                      <select
                        value={settings.businessCategory}
                        onChange={(e) => setSettings({ ...settings, businessCategory: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all cursor-pointer"
                      >
                        <option value="F&B / Specialty Café">F&B / Specialty Café</option>
                        <option value="Retail & Inventory">Retail & Inventory</option>
                        <option value="E-Commerce Store">E-Commerce Store</option>
                        <option value="Professional Services">Professional Services</option>
                        <option value="Wholesale & Distribution">Wholesale & Distribution</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                        Currency Symbol & Code
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all cursor-pointer"
                      >
                        <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                        <option value="USD ($)">USD ($) - US Dollar</option>
                        <option value="EUR (€)">EUR (€) - Euro</option>
                        <option value="GBP (£)">GBP (£) - British Pound</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                        Default Tax / GST Rate (%)
                      </label>
                      <input
                        type="number"
                        value={settings.taxRate}
                        onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                        Tax Identifier / GSTIN
                      </label>
                      <input
                        type="text"
                        value={settings.taxId}
                        onChange={(e) => setSettings({ ...settings, taxId: e.target.value })}
                        placeholder="e.g. 29AABCU9603R1ZM"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                        Operations Email
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        placeholder="e.g. operations@brewandbite.com"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all"
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-1">
                      <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                        Operating Address
                      </label>
                      <input
                        type="text"
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        placeholder="e.g. 12th Main, Indiranagar, Bangalore"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Group 2: Banking & Settlement Credentials */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-slate-800">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Banking & Payment Remittance Details</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                        Remittance Bank Name
                      </label>
                      <input
                        type="text"
                        value={settings.bankName}
                        onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                        placeholder="e.g. HDFC Bank - Commercial"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={settings.bankAccount}
                        onChange={(e) => setSettings({ ...settings, bankAccount: e.target.value })}
                        placeholder="e.g. 50200084920194"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                        IFSC / Routing Code
                      </label>
                      <input
                        type="text"
                        value={settings.bankIfsc}
                        onChange={(e) => setSettings({ ...settings, bankIfsc: e.target.value })}
                        placeholder="e.g. HDFC0001234"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                        UPI ID / Virtual Payment Address
                      </label>
                      <input
                        type="text"
                        value={settings.upiId}
                        onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                        placeholder="e.g. cafelatte@hdfcbank"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                        Default Payment Terms
                      </label>
                      <select
                        value={settings.paymentTerms}
                        onChange={(e) => setSettings({ ...settings, paymentTerms: e.target.value })}
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all cursor-pointer"
                      >
                        <option value="Due on Receipt">Due on Receipt (Immediate)</option>
                        <option value="Net 7">Net 7 Days</option>
                        <option value="Net 15">Net 15 Days</option>
                        <option value="Net 30">Net 30 Days</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                        Invoice Serial Prefix
                      </label>
                      <input
                        type="text"
                        value={settings.invoicePrefix}
                        onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                        placeholder="e.g. INV-2026-"
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Group 3: Invoice Terms & Notes */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <label className="block text-[12px] font-semibold text-slate-600">
                    Default Invoice Footer & Payment Notes
                  </label>
                  <textarea
                    rows={2}
                    value={settings.invoiceNotes}
                    onChange={(e) => setSettings({ ...settings, invoiceNotes: e.target.value })}
                    placeholder="Enter standard payment terms, notes, and warranty disclosures..."
                    className="w-full p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13px] text-slate-900 font-normal focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all resize-none"
                  />
                </div>

                {/* Group 4: Live Branded Invoice Voucher Preview */}
                <div className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-slate-700" />
                      <span className="text-[13px] font-semibold text-slate-800">
                        Live Branded Invoice & Receipt Preview
                      </span>
                    </div>
                    <span className="text-[11.5px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                      Auto-Composed Voucher
                    </span>
                  </div>

                  <div className="p-5 rounded-xl bg-white border border-slate-200/80 text-[12.5px] text-slate-700 space-y-3 shadow-2xs">
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="font-bold text-[15px] text-slate-900">{settings.businessName || "My Business"}</div>
                        <div className="text-slate-500 text-[12px] mt-0.5">{settings.address} · {settings.phone}</div>
                        <div className="text-slate-500 text-[12px]">GSTIN / Tax ID: <span className="text-slate-800 font-medium">{settings.taxId}</span></div>
                      </div>
                      <div className="text-right">
                        <div className="text-[14px] font-bold text-slate-900">{settings.invoicePrefix}0042</div>
                        <div className="text-[11.5px] text-slate-400">Terms: {settings.paymentTerms}</div>
                      </div>
                    </div>

                    {/* Bank Remittance Box */}
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[12px]">
                      <div>
                        <span className="text-slate-400">Bank: </span>
                        <span className="font-medium text-slate-800">{settings.bankName}</span> · A/C: <span className="font-medium text-slate-800">{settings.bankAccount}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">IFSC: </span>
                        <span className="font-medium text-slate-800">{settings.bankIfsc}</span> · UPI: <span className="font-medium text-slate-800">{settings.upiId}</span>
                      </div>
                    </div>

                    <div className="text-slate-500 text-[11.5px] italic">
                      "{settings.invoiceNotes}"
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. AI Autonomy Tab */}
            {activeTab === "ai" && (
              <div className="space-y-8">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-[20px] font-bold text-slate-900 tracking-tight">
                    Autonomous AI Operations & Guardrails
                  </h3>
                  <p className="text-[13px] text-slate-500 mt-1 font-normal">
                    Tune how proactively the Llama 3.3 agent executes inventory and invoice operations with safety limits.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div
                    onClick={() => setSettings({ ...settings, aiAutonomyMode: "autonomous" })}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                      settings.aiAutonomyMode === "autonomous"
                        ? "bg-slate-50/80 border-slate-300 ring-1 ring-slate-900/5 shadow-2xs"
                        : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs"
                    }`}
                  >
                    <input
                      type="radio"
                      name="autonomy"
                      checked={settings.aiAutonomyMode === "autonomous"}
                      onChange={() => setSettings({ ...settings, aiAutonomyMode: "autonomous" })}
                      className="mt-1 accent-slate-900"
                    />
                    <div className="space-y-1.5">
                      <div className="text-[14.5px] font-bold text-slate-900 flex items-center gap-2">
                        <span>Autonomous Execution (Recommended)</span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
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
                    className={`p-6 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                      settings.aiAutonomyMode === "confirmation"
                        ? "bg-slate-50/80 border-slate-300 ring-1 ring-slate-900/5 shadow-2xs"
                        : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs"
                    }`}
                  >
                    <input
                      type="radio"
                      name="autonomy"
                      checked={settings.aiAutonomyMode === "confirmation"}
                      onChange={() => setSettings({ ...settings, aiAutonomyMode: "confirmation" })}
                      className="mt-1 accent-slate-900"
                    />
                    <div className="space-y-1.5">
                      <div className="text-[14.5px] font-bold text-slate-900">
                        Supervised Co-pilot Mode
                      </div>
                      <p className="text-[12.5px] text-slate-600 leading-relaxed font-normal">
                        The agent proposes tool parameters and queries explicit operator confirmation before making database modifications or placing purchase orders.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                      Proactive Scanner Frequency
                    </label>
                    <select
                      value={settings.proactiveInterval}
                      onChange={(e) => setSettings({ ...settings, proactiveInterval: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all cursor-pointer"
                    >
                      <option value="15m">Every 15 minutes</option>
                      <option value="1h">Every 1 hour (Default)</option>
                      <option value="6h">Every 6 hours</option>
                      <option value="24h">Once daily at 08:00 AM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                      Max Auto-Purchase Order Limit (₹)
                    </label>
                    <input
                      type="number"
                      value={settings.maxAutoReorderAmount}
                      onChange={(e) => setSettings({ ...settings, maxAutoReorderAmount: e.target.value })}
                      placeholder="e.g. 25000"
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                      Assistant Personality / Response Tone
                    </label>
                    <select
                      value={settings.aiTone}
                      onChange={(e) => setSettings({ ...settings, aiTone: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all cursor-pointer"
                    >
                      <option value="Professional & Concise">Professional & Concise (Default)</option>
                      <option value="Executive Summary">Executive Summary (High-level)</option>
                      <option value="Operational Detailed">Operational Detailed (Full Audit)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Alert Triggers Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-8">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-[20px] font-bold text-slate-900 tracking-tight">
                    Alert Channels, Alarms & Integrations
                  </h3>
                  <p className="text-[13px] text-slate-500 mt-1 font-normal">
                    Decide when NexOps triggers alerts, emails, and urgent dashboard highlights.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    {
                      id: "notifyLowStock" as const,
                      label: "Low Stock Notifications",
                      desc: "Trigger urgent alerts when any product stock drops at or below minimum threshold.",
                    },
                    {
                      id: "notifyOverdue" as const,
                      label: "Overdue Invoice Escalations",
                      desc: "Generate warnings when client payment terms exceed assigned invoice due dates.",
                    },
                    {
                      id: "notifyDailyDigest" as const,
                      label: "Daily Morning Digest",
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
                      className="p-5 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between shadow-2xs hover:border-slate-300 transition-all"
                    >
                      <div className="pr-4 space-y-1">
                        <div className="text-[14px] font-semibold text-slate-900">
                          {item.label}
                        </div>
                        <div className="text-[12px] text-slate-500 leading-relaxed">
                          {item.desc}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings[item.id]}
                        onChange={(e) => setSettings({ ...settings, [item.id]: e.target.checked })}
                        className="w-5 h-5 accent-slate-900 rounded cursor-pointer shrink-0"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">
                    Outgoing Alert Webhook URL (Slack / Discord / Teams)
                  </label>
                  <input
                    type="url"
                    value={settings.webhookUrl}
                    onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                    placeholder="https://hooks.slack.com/services/..."
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-[13.5px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all"
                  />
                  <p className="text-[11.5px] text-slate-400 mt-1">
                    NexOps dispatches JSON payloads to this endpoint on stockouts or critical payment escalations.
                  </p>
                </div>
              </div>
            )}

            {/* 4. Integrations & Database Tab */}
            {activeTab === "security" && (
              <div className="space-y-8">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-[20px] font-bold text-slate-900 tracking-tight">
                    Integrations, Database & Fixtures
                  </h3>
                  <p className="text-[13px] text-slate-500 mt-1 font-normal">
                    Review status of external models, backup persistent local storage, and reset fixtures.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-700">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[14.5px] font-bold text-slate-900 flex items-center gap-2">
                          <span>Groq Llama 3.3 (70B) Orchestrator</span>
                          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Connected
                          </span>
                        </div>
                        <div className="text-[12.5px] text-slate-500 mt-0.5 font-normal">
                          High-speed tool execution endpoint with function-calling capabilities.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-4 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shrink-0">
                          <Database className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[14.5px] font-bold text-slate-900 flex items-center gap-2">
                            <span>Persistent Local File Database</span>
                            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              Active
                            </span>
                          </div>
                          <div className="text-[12.5px] text-slate-500 mt-0.5 font-normal">
                            Storage target: <span className="text-slate-800 font-medium">data/nexops_db.json</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleExportData}
                          className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[12.5px] font-medium flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-500" />
                          <span>Export JSON</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleResetDb}
                          disabled={isResetting}
                          className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[12.5px] font-medium flex items-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-2xs"
                        >
                          <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
                          <span>{isResetting ? "Resetting..." : "Reset to Demo Data"}</span>
                        </button>
                      </div>
                    </div>

                    {dbStats?.counts && (
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2.5 text-[12px]">
                        <span className="text-slate-400 font-medium">Active Database Records:</span>
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                          {dbStats.counts.products} Products
                        </span>
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                          {dbStats.counts.invoices} Invoices
                        </span>
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                          {dbStats.counts.vendors} Vendors
                        </span>
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                          {dbStats.counts.activities} Activities
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Form Actions Bar */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
              <div className="text-[12.5px] text-slate-500 font-medium flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Changes will synchronize immediately across your workspace.</span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-[13px] font-medium shadow-xs flex items-center gap-2 cursor-pointer transition-all shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Saving..." : "Save Preferences"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

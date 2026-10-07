"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Sparkles,
  CheckCircle2,
  Check,
  Layers,
  Store,
  GraduationCap,
  Briefcase,
  Laptop,
} from "lucide-react";

interface WorkspaceProfile {
  isConfigured: boolean;
  businessName: string;
  businessType: string;
  operatorName: string;
  currencySymbol: string;
  currencyCode: string;
  mode?: "clean" | "sample" | "unconfigured";
}

interface WorkspaceOnboardingProps {
  initialProfile: WorkspaceProfile;
}

export function WorkspaceOnboarding({ initialProfile }: WorkspaceOnboardingProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<WorkspaceProfile>(initialProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states (pure blank inputs, no placeholder suggestions)
  const [businessName, setBusinessName] = useState(profile.businessName || "");
  const [operatorName, setOperatorName] = useState(profile.operatorName || "");
  const [businessType, setBusinessType] = useState(profile.businessType || "Business");
  const [currencySymbol, setCurrencySymbol] = useState(profile.currencySymbol || "₹");
  const [currencyCode, setCurrencyCode] = useState(profile.currencyCode || "INR");
  const [dataMode, setDataMode] = useState<"clean" | "sample">(
    profile.mode === "clean" ? "clean" : "clean"
  );
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const currencyOptions = [
    { symbol: "₹", code: "INR", label: "INR (₹)" },
    { symbol: "$", code: "USD", label: "USD ($)" },
    { symbol: "€", code: "EUR", label: "EUR (€)" },
    { symbol: "£", code: "GBP", label: "GBP (£)" },
    { symbol: "¥", code: "JPY", label: "JPY (¥)" },
  ];

  const typeOptions = [
    { id: "Business", icon: Store, label: "Commerce" },
    { id: "Study", icon: GraduationCap, label: "Study" },
    { id: "Agency", icon: Briefcase, label: "Agency" },
    { id: "Startup", icon: Laptop, label: "Tech" },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: dataMode === "clean" ? "initialize_clean" : "initialize_sample",
          businessName: businessName.trim(),
          businessType,
          operatorName: operatorName.trim() || "Operator",
          currencySymbol,
          currencyCode,
          mode: dataMode,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
        router.refresh();
      }
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-surface p-5 sm:p-6 rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      {/* Box Title */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200 shadow-xs">
            <Building2 className="w-4 h-4 text-emerald-700" />
          </div>
          <span className="text-[14px] font-bold text-slate-800">
            Workspace Details
          </span>
        </div>

        {profile.businessName && (
          <span className="text-[12px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Active: {profile.businessName}
          </span>
        )}
      </div>

      {/* Form (Completely Blank Inputs, No Placeholders, No Helper Text, Compact) */}
      <form onSubmit={handleSave} className="space-y-3.5">
        {/* Row 1: Business Name, Operator Name, Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[12px] font-bold text-slate-700 block mb-1">
              Business Name *
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-[13px] text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[12px] font-bold text-slate-700 block mb-1">
              Operator Name
            </label>
            <input
              type="text"
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-[13px] text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-[12px] font-bold text-slate-700 block mb-1">
              Currency
            </label>
            <select
              value={currencyCode}
              onChange={(e) => {
                const sel = currencyOptions.find((c) => c.code === e.target.value);
                if (sel) {
                  setCurrencyCode(sel.code);
                  setCurrencySymbol(sel.symbol);
                }
              }}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-[13px] text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all cursor-pointer"
            >
              {currencyOptions.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Category, Data Mode, and Save Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Category & Mode Options */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
              {typeOptions.map((t) => {
                const Icon = t.icon;
                const isSelected = businessType === t.id;

                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setBusinessType(t.id)}
                    className={`h-7 px-2 rounded-md flex items-center gap-1 text-[12px] transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white text-emerald-800 font-bold shadow-xs border border-slate-200"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="w-3 h-3 shrink-0" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mode Pills */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setDataMode("clean")}
                className={`h-7 px-2.5 rounded-md flex items-center gap-1 text-[12px] transition-all cursor-pointer ${
                  dataMode === "clean"
                    ? "bg-white text-emerald-800 font-bold shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Clean Slate</span>
              </button>

              <button
                type="button"
                onClick={() => setDataMode("sample")}
                className={`h-7 px-2.5 rounded-md flex items-center gap-1 text-[12px] transition-all cursor-pointer ${
                  dataMode === "sample"
                    ? "bg-white text-emerald-800 font-bold shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers className="w-3 h-3 text-slate-500" />
                <span>Sample Data</span>
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-8 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[13px] shadow-xs transition-all duration-200 shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Details"}
          </button>
        </div>
      </form>

      {/* Success Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in text-[13px] font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Workspace updated!</span>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  X,
  Layers,
  RotateCcw,
  Briefcase,
  GraduationCap,
  Store,
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
  const [isOpen, setIsOpen] = useState(!initialProfile.isConfigured);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states (no default dummy strings)
  const [businessName, setBusinessName] = useState(profile.businessName || "");
  const [businessType, setBusinessType] = useState(profile.businessType || "Business");
  const [operatorName, setOperatorName] = useState(profile.operatorName || "");
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
        setIsOpen(false);
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

  const handleResetToClean = async () => {
    if (!confirm("Are you sure you want to clear placeholder records and start completely fresh?")) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "initialize_clean",
          businessName: businessName || profile.businessName || "My Business",
          businessType,
          operatorName: operatorName || profile.operatorName || "Operator",
          currencySymbol,
          currencyCode,
          mode: "clean",
        }),
      });
      if (res.ok) {
        setIsOpen(false);
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Top Banner if unconfigured */}
      {!profile.isConfigured && !isOpen && (
        <div className="card-surface p-6 sm:p-7 rounded-2xl border-2 border-emerald-500/25 bg-emerald-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-5 animate-fade-in shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 leading-snug">
                Workspace Setup
              </h2>
              <p className="text-[13px] text-slate-600">
                Configure your business or study workspace details.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[13px] shadow-sm transition-all duration-200 shrink-0 cursor-pointer"
          >
            Configure Details <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Button to customize workspace details anytime */}
      {profile.isConfigured && !isOpen && (
        <div className="flex justify-end -mt-4">
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-[13px] font-medium transition-all shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Customize Details</span>
          </button>
        </div>
      )}

      {/* Compact Dialog (No Scrolling Required) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-soft">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200/80 shadow-xs">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                </div>
                <h3 className="text-[17px] font-bold text-slate-900 leading-tight">
                  {profile.isConfigured ? "Workspace Settings" : "Set Up Workspace"}
                </h3>
              </div>

              {profile.isConfigured && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Form Fields (No Placeholders, No Bottom Text, Compact) */}
            <form onSubmit={handleSave} className="p-6 space-y-4.5">
              {/* Workspace Name */}
              <div>
                <label className="text-[13px] font-bold text-slate-800 block mb-1.5">
                  Workspace / Business Name <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg border border-slate-200 bg-white text-[14px] text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all"
                />
              </div>

              {/* 2-Column: Your Name & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[13px] font-bold text-slate-800 block mb-1.5">
                    Your Name / Role
                  </label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-lg border border-slate-200 bg-white text-[14px] text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[13px] font-bold text-slate-800 block mb-1.5">
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
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-[14px] text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all cursor-pointer"
                  >
                    {currencyOptions.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category Pills */}
              <div>
                <label className="text-[13px] font-bold text-slate-800 block mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {typeOptions.map((t) => {
                    const Icon = t.icon;
                    const isSelected = businessType === t.id;

                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setBusinessType(t.id)}
                        className={`h-9 px-2.5 rounded-lg border text-left flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-xs"
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSelected ? "text-emerald-700" : "text-slate-400"
                          }`}
                        />
                        <span className="text-[12px] truncate">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Data Mode Buttons */}
              <div>
                <label className="text-[13px] font-bold text-slate-800 block mb-1.5">
                  Data Mode
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDataMode("clean")}
                    className={`h-9 px-3 rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      dataMode === "clean"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-xs"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[13px]">Clean Slate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDataMode("sample")}
                    className={`h-9 px-3 rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      dataMode === "sample"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-xs"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[13px]">Sample Preview</span>
                  </button>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
                {profile.isConfigured ? (
                  <button
                    type="button"
                    onClick={handleResetToClean}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-rose-600 hover:text-rose-700 hover:underline transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Data
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2.5">
                  {profile.isConfigured && (
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 rounded-lg border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[13px] font-bold shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save Workspace"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 animate-fade-in text-[13px] font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Workspace updated!</span>
        </div>
      )}
    </>
  );
}

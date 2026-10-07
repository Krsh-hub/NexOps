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
  Package,
  Layers,
  FileText,
  RotateCcw,
  Check,
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

  // Form states
  const [businessName, setBusinessName] = useState(profile.businessName || "");
  const [businessType, setBusinessType] = useState(profile.businessType || "Business");
  const [operatorName, setOperatorName] = useState(profile.operatorName || "Operator");
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
    { id: "Business", label: "Business & Commerce", desc: "For retail, sales, inventory, and operations" },
    { id: "Study", label: "Study & Academic", desc: "For learning tracks, projects, and milestone metrics" },
    { id: "Agency", label: "Agency & Freelance", desc: "For client services, billables, and tasks" },
    { id: "Startup", label: "Tech / Modern Venture", desc: "For SaaS, workflows, and automated feeds" },
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
        setTimeout(() => setShowSuccessToast(false), 4000);
        router.refresh();
      }
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetToClean = async () => {
    if (!confirm("Are you sure you want to clear dummy records and start with a clean slate?")) return;
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
        <div className="card-surface p-6 sm:p-7 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-5 animate-fade-in shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-slate-900">
                Welcome to NexOps · Set Up Your Real Workspace
              </h2>
              <p className="text-[14px] text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Enter your actual business or project details so your dashboard displays your real data rather than placeholder examples.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[14px] shadow-sm transition-all duration-200 shrink-0 cursor-pointer"
          >
            Configure Workspace <ArrowRight className="w-4 h-4" />
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
            <span>Customize Workspace Details</span>
          </button>
        </div>
      )}

      {/* Floating Modal / Setup Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-soft">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto scrollbar-hide flex flex-col">
            {/* Modal Header */}
            <div className="px-7 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 rounded-t-3xl">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200 shadow-xs">
                  <Building2 className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-slate-900 leading-tight">
                    {profile.isConfigured ? "Workspace Settings" : "Set Up Your Workspace"}
                  </h3>
                  <p className="text-[13px] text-slate-500 font-medium mt-0.5">
                    Personalize your dashboard with your actual details
                  </p>
                </div>
              </div>

              {profile.isConfigured && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSave} className="p-7 space-y-6">
              {/* Business Name */}
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-slate-800 flex items-center justify-between">
                  <span>Workspace / Business Name <span className="text-emerald-600">*</span></span>
                  <span className="text-[12px] font-normal text-slate-500">e.g. Apex Studio, LearnOps</span>
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business or project name..."
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-[15px] text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all"
                />
              </div>

              {/* Grid: Operator Name & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-slate-800">
                    Your Name / Role Title
                  </label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    placeholder="e.g. Alex, Lead Operator"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-[15px] text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-slate-800">
                    Primary Currency
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
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-[15px] text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all cursor-pointer"
                  >
                    {currencyOptions.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Purpose / Domain */}
              <div className="space-y-2.5">
                <label className="text-[14px] font-bold text-slate-800">
                  Select Focus or Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {typeOptions.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setBusinessType(t.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        businessType === t.id
                          ? "border-emerald-600 bg-emerald-50/70 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[14px] font-bold ${businessType === t.id ? "text-emerald-900" : "text-slate-800"}`}>
                          {t.label}
                        </span>
                        {businessType === t.id && (
                          <Check className="w-4 h-4 text-emerald-700" />
                        )}
                      </div>
                      <p className="text-[12px] text-slate-500 mt-1 leading-snug">
                        {t.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Preference */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <label className="text-[14px] font-bold text-slate-800">
                  Dashboard Data Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setDataMode("clean")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      dataMode === "clean"
                        ? "border-emerald-600 bg-emerald-50/80 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[14px] font-bold text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" /> Start Clean
                      </span>
                      {dataMode === "clean" && <Check className="w-4 h-4 text-emerald-700" />}
                    </div>
                    <p className="text-[12px] text-slate-600 leading-relaxed">
                      Zero placeholder dummy data. Counters start at 0, ready for your real inventory & invoices.
                    </p>
                  </div>

                  <div
                    onClick={() => setDataMode("sample")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      dataMode === "sample"
                        ? "border-emerald-600 bg-emerald-50/80 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[14px] font-bold text-slate-900 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-slate-600" /> Sample Preview
                      </span>
                      {dataMode === "sample" && <Check className="w-4 h-4 text-emerald-700" />}
                    </div>
                    <p className="text-[12px] text-slate-600 leading-relaxed">
                      Populate demonstration products and records to test-drive features immediately.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
                {profile.isConfigured ? (
                  <button
                    type="button"
                    onClick={handleResetToClean}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Clear to Clean Slate
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  {profile.isConfigured && (
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[14px] font-bold shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save & Launch Dashboard"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in text-[14px] font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Workspace updated with your real details!</span>
        </div>
      )}
    </>
  );
}

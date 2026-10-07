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
    { symbol: "₹", code: "INR", label: "INR — Indian Rupee (₹)" },
    { symbol: "$", code: "USD", label: "USD — US Dollar ($)" },
    { symbol: "€", code: "EUR", label: "EUR — Euro (€)" },
    { symbol: "£", code: "GBP", label: "GBP — British Pound (£)" },
    { symbol: "¥", code: "JPY", label: "JPY — Japanese Yen (¥)" },
  ];

  const typeOptions = [
    {
      id: "Business",
      icon: Store,
      label: "Business & Commerce",
      desc: "For retail stores, physical or online sales, inventory stock, and everyday operations.",
    },
    {
      id: "Study",
      icon: GraduationCap,
      label: "Study & Academic",
      desc: "For research projects, study goals, learning progress, and personal academic tracking.",
    },
    {
      id: "Agency",
      icon: Briefcase,
      label: "Agency & Freelance",
      desc: "For client services, billable hours, project milestones, and independent contracts.",
    },
    {
      id: "Startup",
      icon: Laptop,
      label: "Tech / Modern Venture",
      desc: "For software workflows, autonomous task feeds, modern SaaS, and tech initiatives.",
    },
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
        <div className="card-surface p-7 sm:p-8 rounded-2xl border-2 border-emerald-500/25 bg-emerald-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-6 animate-fade-in shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-[18px] font-bold text-slate-900 leading-snug">
                Welcome to NexOps · Let&apos;s Set Up Your Workspace
              </h2>
              <p className="text-[14px] text-slate-600 max-w-2xl leading-relaxed">
                Enter your actual business or project details so your dashboard displays your real data rather than placeholder examples.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[14px] shadow-sm transition-all duration-200 shrink-0 cursor-pointer"
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-[13px] font-medium transition-all shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Customize Workspace Details</span>
          </button>
        </div>
      )}

      {/* Floating Modal / Setup Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-900/40 backdrop-blur-md animate-fade-soft">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide flex flex-col">
            {/* Modal Header */}
            <div className="px-8 py-6 sm:py-7 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 rounded-t-3xl sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200/80 shadow-xs">
                  <Building2 className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-[20px] font-bold text-slate-900 leading-tight">
                    {profile.isConfigured ? "Workspace Settings" : "Set Up Your Workspace"}
                  </h3>
                  <p className="text-[14px] text-slate-500 font-medium">
                    Personalize your dashboard with your actual details
                  </p>
                </div>
              </div>

              {profile.isConfigured && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSave} className="p-8 sm:p-10 space-y-9">
              {/* ─── Part 1: Identity & General Information ─── */}
              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="text-[12px] uppercase tracking-wider font-bold text-emerald-700">
                    Step 1 of 3
                  </span>
                  <h4 className="text-[16px] font-bold text-slate-900">
                    Workspace Identity
                  </h4>
                </div>

                {/* Workspace Name Input */}
                <div className="space-y-2.5">
                  <label className="text-[14px] font-bold text-slate-800 block">
                    Workspace / Business Name <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Studio, LearnOps, BioTech Lab..."
                    className="w-full h-12 px-4.5 rounded-xl border border-slate-200 bg-slate-50/70 text-[15px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-3 focus:ring-emerald-500/10 focus:outline-none transition-all"
                  />
                  <p className="text-[13px] text-slate-500 leading-relaxed">
                    This name will appear on all your invoices, reports, and top navigation header.
                  </p>
                </div>

                {/* Operator Name & Currency in Roomy 2-Column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pt-1">
                  <div className="space-y-2.5">
                    <label className="text-[14px] font-bold text-slate-800 block">
                      Your Name / Role Title
                    </label>
                    <input
                      type="text"
                      value={operatorName}
                      onChange={(e) => setOperatorName(e.target.value)}
                      placeholder="e.g. Alex, Lead Operator"
                      className="w-full h-12 px-4.5 rounded-xl border border-slate-200 bg-slate-50/70 text-[15px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:ring-3 focus:ring-emerald-500/10 focus:outline-none transition-all"
                    />
                    <p className="text-[12px] text-slate-500 leading-relaxed">
                      Used for your operator greeting and avatar initials.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[14px] font-bold text-slate-800 block">
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
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/70 text-[15px] text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-3 focus:ring-emerald-500/10 focus:outline-none transition-all cursor-pointer"
                    >
                      {currencyOptions.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-[12px] text-slate-500 leading-relaxed">
                      All revenue cards and invoice metrics will format with this currency.
                    </p>
                  </div>
                </div>
              </div>

              {/* ─── Part 2: Focus & Category ─── */}
              <div className="space-y-5 pt-3 border-t border-slate-100">
                <div className="space-y-1">
                  <span className="text-[12px] uppercase tracking-wider font-bold text-emerald-700">
                    Step 2 of 3
                  </span>
                  <h4 className="text-[16px] font-bold text-slate-900">
                    Select Your Purpose & Category
                  </h4>
                  <p className="text-[13px] text-slate-500 leading-relaxed">
                    Tailors the autonomous AI tools and analytics for your specific workflow.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {typeOptions.map((t) => {
                    const Icon = t.icon;
                    const isSelected = businessType === t.id;

                    return (
                      <div
                        key={t.id}
                        onClick={() => setBusinessType(t.id)}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 space-y-2 ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50/70 shadow-xs"
                            : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                isSelected
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <span
                              className={`text-[15px] font-bold ${
                                isSelected ? "text-emerald-950" : "text-slate-800"
                              }`}
                            >
                              {t.label}
                            </span>
                          </div>

                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                            </div>
                          )}
                        </div>

                        <p className="text-[13px] text-slate-600 leading-relaxed pl-1">
                          {t.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ─── Part 3: Data Preference ─── */}
              <div className="space-y-5 pt-3 border-t border-slate-100">
                <div className="space-y-1">
                  <span className="text-[12px] uppercase tracking-wider font-bold text-emerald-700">
                    Step 3 of 3
                  </span>
                  <h4 className="text-[16px] font-bold text-slate-900">
                    Dashboard Data Preference
                  </h4>
                  <p className="text-[13px] text-slate-500 leading-relaxed">
                    Choose whether to start with your actual clean records or test-drive features with demonstration data.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Clean Mode */}
                  <div
                    onClick={() => setDataMode("clean")}
                    className={`p-5 sm:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 space-y-2.5 ${
                      dataMode === "clean"
                        ? "border-emerald-600 bg-emerald-50/80 shadow-xs"
                        : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" /> Start Clean Slate
                      </span>
                      {dataMode === "clean" && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </div>
                      )}
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed">
                      Completely zero dummy data. All metrics start at 0, ready for you to add your real products, sales, and tasks.
                    </p>
                  </div>

                  {/* Sample Mode */}
                  <div
                    onClick={() => setDataMode("sample")}
                    className={`p-5 sm:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 space-y-2.5 ${
                      dataMode === "sample"
                        ? "border-emerald-600 bg-emerald-50/80 shadow-xs"
                        : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-slate-600" /> Explore with Samples
                      </span>
                      {dataMode === "sample" && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </div>
                      )}
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed">
                      Pre-populates sample transactions so you can tour the charts, invoices, and stock alerts immediately.
                    </p>
                  </div>
                </div>
              </div>

              {/* ─── Modal Actions Footer ─── */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                {profile.isConfigured ? (
                  <button
                    type="button"
                    onClick={handleResetToClean}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset to Clean Slate
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {profile.isConfigured && (
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-5 py-3 rounded-xl border border-slate-200 text-[14px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[15px] font-bold shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
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

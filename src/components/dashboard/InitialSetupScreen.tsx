"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Store,
  GraduationCap,
  Briefcase,
  Laptop,
  Layers,
  ArrowRight,
} from "lucide-react";

interface InitialSetupScreenProps {
  initialProfile?: {
    businessName?: string;
    operatorName?: string;
    businessType?: string;
    currencySymbol?: string;
    currencyCode?: string;
  };
}

export function InitialSetupScreen({ initialProfile }: InitialSetupScreenProps) {
  const router = useRouter();
  const [businessName, setBusinessName] = useState(initialProfile?.businessName || "");
  const [operatorName, setOperatorName] = useState(initialProfile?.operatorName || "");
  const [businessType, setBusinessType] = useState(initialProfile?.businessType || "Business");
  const [currencySymbol, setCurrencySymbol] = useState(initialProfile?.currencySymbol || "₹");
  const [currencyCode, setCurrencyCode] = useState(initialProfile?.currencyCode || "INR");
  const [dataMode, setDataMode] = useState<"clean" | "sample">("clean");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
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
        router.refresh();
      }
    } catch (err) {
      console.error("Setup error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">
              Welcome to NexOps
            </h1>
          </div>
          <p className="text-[13px] text-slate-500 font-medium">
            Set up your workspace to get started.
          </p>
        </div>

        {/* Form Body - Compact, No Placeholders, No Bottom Text */}
        <form onSubmit={handleSubmit} className="p-7 space-y-4">
          {/* Business Name */}
          <div>
            <label className="text-[13px] font-bold text-slate-800 block mb-1.5">
              Business Name *
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all"
            />
          </div>

          {/* Operator Name & Currency in 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[13px] font-bold text-slate-800 block mb-1.5">
                Operator Name
              </label>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all"
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
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all cursor-pointer"
              >
                {currencyOptions.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
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
                    className={`h-9 px-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-[13px]"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-emerald-700" : "text-slate-400"}`} />
                    <span className="text-[12px] truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Data Mode */}
          <div>
            <label className="text-[13px] font-bold text-slate-800 block mb-1.5">
              Data Mode
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setDataMode("clean")}
                className={`h-9 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  dataMode === "clean"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-[13px]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[13px]">Clean Slate</span>
              </button>

              <button
                type="button"
                onClick={() => setDataMode("sample")}
                className={`h-9 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  dataMode === "sample"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-[13px]"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[13px]">Sample Preview</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[14px] shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? "Launching..." : "Launch Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

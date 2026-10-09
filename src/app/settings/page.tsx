import { SettingsManager } from "@/components/dashboard/SettingsManager";
import { getBusinessProfile } from "@/lib/supabase";
import { Terminal, GitBranch, Cpu, Sliders } from "lucide-react";

export const revalidate = 0;

export default function SettingsPage() {
  const profile = getBusinessProfile();
  const businessDisplay = profile?.businessName || "My Workspace";
  const workspaceSlug = businessDisplay.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-6 space-y-6 animate-fade-in min-h-[calc(100vh-4rem)] flex flex-col">
      {/* 1. Developer Breadcrumb & Telemetry Header */}
      <div className="space-y-3 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2 text-[12px] font-mono text-slate-500 flex-wrap">
          <span className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Terminal className="w-3.5 h-3.5 text-emerald-600" />
            <span>nexops</span>
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">workspaces</span>
          <span className="text-slate-300">/</span>
          <span className="px-1.5 py-0.5 rounded-md bg-white text-slate-800 font-semibold border border-slate-200 shadow-2xs">
            ~/{workspaceSlug}
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-semibold">settings</span>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
            <GitBranch className="w-3 h-3 text-emerald-600" />
            <span>production</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-slate-400 pl-1">
            <Cpu className="w-3 h-3 text-slate-400" />
            <span>edge-in-south</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h1 className="text-[24px] sm:text-[28px] font-extrabold tracking-tight text-slate-900 leading-tight">
              System & AI Configuration
            </h1>
            <p className="text-[13px] text-slate-500 font-medium">
              Tune business entity details, AI autonomy orchestrator, alert triggers, and persistent database.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white border border-slate-200/90 text-slate-700 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              CONFIG SYNCED
            </span>
          </div>
        </div>
      </div>

      <SettingsManager initialProfile={profile} />
    </div>
  );
}

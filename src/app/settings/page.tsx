import { SettingsManager } from "@/components/dashboard/SettingsManager";
import { getBusinessProfile } from "@/lib/supabase";

export const revalidate = 0;

export default function SettingsPage() {
  const profile = getBusinessProfile();
  const businessDisplay = profile?.businessName || "My Workspace";

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-7 space-y-7 animate-fade-in min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Executive Apple Settings Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/70">
        <div className="space-y-1">
          <div className="text-[13px] text-slate-500 font-medium">
            <span>Workspace Settings</span> · <span className="text-slate-800 font-semibold">{businessDisplay}</span>
          </div>
          <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-slate-900 leading-tight">
            Preferences & System
          </h1>
          <p className="text-[13.5px] text-slate-500 font-medium">
            Manage organization identity, autonomous AI behaviors, alert thresholds, and system data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Synced & Active
          </span>
        </div>
      </div>

      <SettingsManager initialProfile={profile} />
    </div>
  );
}

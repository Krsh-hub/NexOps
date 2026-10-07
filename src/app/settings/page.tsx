import { SettingsManager } from "@/components/dashboard/SettingsManager";

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto animate-fade-soft">
      <div>
        <h1 className="text-[22px] font-bold text-[var(--text-primary)] tracking-tight">
          System & AI Configuration
        </h1>
        <p className="text-[14px] text-[var(--text-tertiary)] mt-1 font-medium">
          Tune business entity details, AI autonomy behavior, alert frequencies, and integration endpoints
        </p>
      </div>

      <SettingsManager />
    </div>
  );
}

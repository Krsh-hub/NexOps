import { ReportsManager } from "@/components/dashboard/ReportsManager";

export default function ReportsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto animate-fade-soft">
      <div>
        <h1 className="text-[22px] font-bold text-[var(--text-primary)] tracking-tight">
          Operational Intelligence & Reports
        </h1>
        <p className="text-[14px] text-[var(--text-tertiary)] mt-1 font-medium">
          Auto-generated financial, stockout, and AI audit reports with one-click CSV export
        </p>
      </div>

      <ReportsManager />
    </div>
  );
}

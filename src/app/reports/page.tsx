import { ReportsManager } from "@/components/dashboard/ReportsManager";

export default function ReportsPage() {
  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-7 space-y-7 animate-fade-in flex-1 flex flex-col">
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

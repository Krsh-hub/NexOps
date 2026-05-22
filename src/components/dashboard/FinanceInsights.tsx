import { BarChart3, TrendingUp } from "lucide-react";

export function FinanceInsights() {
  const data = [
    { label: "Mon", value: 65 },
    { label: "Tue", value: 45 },
    { label: "Wed", value: 85 },
    { label: "Thu", value: 55 },
    { label: "Fri", value: 95 },
    { label: "Sat", value: 75 },
    { label: "Sun", value: 80 },
  ];
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="card-surface flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3.5 flex items-center justify-between border-b border-[var(--border-primary)]">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[var(--text-quaternary)]" strokeWidth={1.8} />
          <span className="text-[13px] font-semibold text-[var(--text-primary)]">Revenue</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-[var(--green)] bg-[var(--green-subtle)] px-1.5 py-0.5 rounded-md">
          <TrendingUp className="w-3 h-3" />
          12.5%
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col justify-end">
        <div className="flex items-end gap-[6px] h-full">
          {data.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full relative rounded-t-sm overflow-hidden bg-[var(--bg-hover)]" style={{ height: "100%" }}>
                <div
                  className="absolute bottom-0 w-full rounded-t-sm bg-[var(--border-secondary)] hover:bg-[var(--accent)] transition-colors duration-300"
                  style={{ height: `${(item.value / max) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-[var(--text-quaternary)] font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

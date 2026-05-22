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

  return (
    <div className="card flex flex-col border border-[var(--border-subtle)] shadow-sm overflow-hidden h-full">
      <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[var(--text-secondary)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Finance Overview</h3>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-[var(--success)] bg-[var(--success-bg)] px-1.5 py-0.5 rounded">
          <TrendingUp size={12} />
          <span>+12.5%</span>
        </div>
      </div>
      
      <div className="flex-1 p-5 bg-[var(--bg-base)] flex flex-col justify-end">
        <div className="flex items-end justify-between gap-2 h-32 mt-auto">
          {data.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
              <div className="w-full relative bg-[var(--bg-hover)] rounded-sm overflow-hidden h-full flex items-end">
                <div 
                  className="w-full bg-[var(--border-default)] group-hover:bg-[var(--text-primary)] transition-colors rounded-sm"
                  style={{ height: `${item.value}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { BarChart3, TrendingUp } from "lucide-react";

export function FinanceInsights() {
  const data = [
    { label: "Mon", value: 65, amount: "₹6,500" },
    { label: "Tue", value: 45, amount: "₹4,500" },
    { label: "Wed", value: 85, amount: "₹8,500" },
    { label: "Thu", value: 55, amount: "₹5,500" },
    { label: "Fri", value: 95, amount: "₹9,500" },
    { label: "Sat", value: 75, amount: "₹7,500" },
    { label: "Sun", value: 80, amount: "₹8,000" },
  ];
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="card-surface flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="px-4 py-3.5 flex items-center justify-between border-b border-[var(--border-primary)]/50 bg-[var(--bg-secondary)]/30">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <BarChart3 className="w-3.5 h-3.5" strokeWidth={2.2} />
          </div>
          <span className="text-[16px] font-bold text-[var(--text-primary)] tracking-wide uppercase">Revenue Trend</span>
        </div>
        <div className="flex items-center gap-1 text-[16px] font-bold text-[var(--green)] bg-[var(--green-subtle)] px-2 py-0.5 rounded-md">
          <TrendingUp className="w-3 h-3 animate-bounce" />
          12.5%
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 p-5 flex flex-col justify-between relative min-h-[220px]">
        {/* Horizontal grid lines */}
        <div className="absolute inset-x-5 inset-y-8 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-t border-dashed border-[var(--border-secondary)] w-full h-0" />
          <div className="border-t border-dashed border-[var(--border-secondary)] w-full h-0" />
          <div className="border-t border-dashed border-[var(--border-secondary)] w-full h-0" />
          <div className="border-t border-dashed border-[var(--border-secondary)] w-full h-0" />
        </div>

        {/* Bars Container */}
        <div className="flex items-end gap-3 h-full z-10 pt-4">
          {data.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2.5 h-full group">
              <div className="w-full relative rounded-t-lg overflow-hidden bg-[var(--bg-primary)]/50 h-full flex flex-col justify-end">
                {/* Custom tooltip hover flag */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[var(--bg-elevated)] border border-[var(--border-primary)] text-[15px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 text-[var(--text-primary)] shadow-md">
                  {item.amount}
                </div>

                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-[rgba(59,130,246,0.2)] to-[var(--accent)] hover:from-[rgba(59,130,246,0.3)] hover:to-[var(--accent-hover)] transition-all duration-500 origin-bottom group-hover:scale-y-105 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.25)]"
                  style={{ height: `${(item.value / max) * 100}%` }}
                />
              </div>
              <span className="text-[16px] text-[var(--text-secondary)] font-bold tracking-wider group-hover:text-white transition-colors uppercase">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
  // Total sum
  const total = data.reduce((acc, d) => acc + parseInt(d.amount.replace(/\D/g, '')), 0);
  
  // Get active day index (0 for Mon, 6 for Sun)
  const currentDayIndex = (new Date().getDay() + 6) % 7;

  return (
    <div className="card-surface flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-t-2 border-t-[var(--accent)] group">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--border-primary)]/50 bg-[var(--bg-secondary)]/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] group-hover:scale-110 transition-transform">
            <BarChart3 className="w-4 h-4" strokeWidth={2.2} />
          </div>
          <div>
            <span className="text-[13px] font-bold text-[var(--text-tertiary)] tracking-widest uppercase">Revenue Trend</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[24px] font-bold text-[var(--text-primary)] leading-none">₹{total.toLocaleString('en-IN')}</span>
              <span className="text-[13px] font-medium text-[var(--text-secondary)]">This week</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[14px] font-bold text-[var(--green)] bg-[var(--green-subtle)] px-2.5 py-1 rounded-md border border-[var(--green)]/20 shadow-sm">
          <TrendingUp className="w-3.5 h-3.5" />
          12.5%
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 p-6 flex flex-col justify-between relative min-h-[260px]">
        {/* Horizontal grid lines */}
        <div className="absolute inset-x-6 inset-y-10 flex flex-col justify-between pointer-events-none opacity-10">
          <div className="border-t border-dashed border-[var(--text-primary)] w-full h-0" />
          <div className="border-t border-dashed border-[var(--text-primary)] w-full h-0" />
          <div className="border-t border-dashed border-[var(--text-primary)] w-full h-0" />
          <div className="border-t border-dashed border-[var(--text-primary)] w-full h-0" />
        </div>

        {/* Bars Container */}
        <div className="flex items-end gap-3 sm:gap-4 h-full z-10 pt-6">
          {data.map((item, i) => {
            const isHighest = item.value === max;
            const isActive = i === currentDayIndex;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full group/bar relative">
                <div className="w-full relative rounded-lg overflow-hidden bg-[var(--bg-primary)]/40 h-full flex flex-col justify-end">
                  {/* Custom tooltip hover flag */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 glass px-2.5 py-1 rounded-md opacity-0 group-hover/bar:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-20 text-[13px] font-bold text-white shadow-lg shadow-black/20 border border-[var(--border-secondary)] translate-y-2 group-hover/bar:translate-y-0">
                    {item.amount}
                  </div>

                  <div
                    className={`w-full rounded-lg transition-all duration-500 origin-bottom group-hover/bar:scale-y-[1.02] ${
                      isHighest 
                        ? "bg-gradient-to-t from-[var(--accent-subtle)] to-[var(--accent)] shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                        : "bg-gradient-to-t from-[var(--bg-hover)] to-[var(--border-hover)] hover:to-[var(--accent)]/70"
                    }`}
                    style={{ height: `${(item.value / max) * 100}%` }}
                  />
                </div>
                
                <div className="flex flex-col items-center gap-1.5">
                  <span className={`text-[13px] font-bold tracking-wider uppercase transition-colors ${
                    isActive ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)] group-hover/bar:text-[var(--text-secondary)]"
                  }`}>
                    {item.label}
                  </span>
                  {/* Active day indicator */}
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

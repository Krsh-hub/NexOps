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
      <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--border-primary)] bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center group-hover:scale-110 transition-transform">
            <BarChart3 className="w-4 h-4" strokeWidth={2.2} />
          </div>
          <div>
            <span className="text-[12px] font-bold text-[var(--text-tertiary)] tracking-widest uppercase">Revenue Trend</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[24px] font-bold text-[var(--text-primary)] leading-none">₹{total.toLocaleString('en-IN')}</span>
              <span className="text-[13px] font-medium text-[var(--text-secondary)]">This week</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[14px] font-bold text-[var(--green)] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shadow-xs">
          <TrendingUp className="w-3.5 h-3.5" />
          12.5%
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 p-6 flex flex-col justify-between relative min-h-[260px]">
        {/* Horizontal grid lines */}
        <div className="absolute inset-x-6 inset-y-10 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-t border-dashed border-slate-300 w-full h-0" />
          <div className="border-t border-dashed border-slate-300 w-full h-0" />
          <div className="border-t border-dashed border-slate-300 w-full h-0" />
          <div className="border-t border-dashed border-slate-300 w-full h-0" />
        </div>

        {/* Bars Container */}
        <div className="flex items-end gap-3 sm:gap-4 h-full z-10 pt-6">
          {data.map((item, i) => {
            const isHighest = item.value === max;
            const isActive = i === currentDayIndex;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full group/bar relative">
                <div className="w-full relative rounded-lg overflow-hidden bg-slate-100 h-full flex flex-col justify-end">
                  {/* Custom tooltip hover flag */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-2.5 py-1 rounded-md opacity-0 group-hover/bar:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-20 text-[12px] font-bold text-slate-900 shadow-md border border-slate-200 translate-y-2 group-hover/bar:translate-y-0">
                    {item.amount}
                  </div>

                  <div
                    className={`w-full rounded-lg transition-all duration-500 origin-bottom group-hover/bar:scale-y-[1.02] ${
                      isHighest 
                        ? "bg-gradient-to-t from-emerald-500 to-teal-400 shadow-sm" 
                        : "bg-gradient-to-t from-slate-200 to-slate-300 hover:to-emerald-300"
                    }`}
                    style={{ height: `${(item.value / max) * 100}%` }}
                  />
                </div>
                
                <div className="flex flex-col items-center gap-1.5">
                  <span className={`text-[12px] font-bold tracking-wider uppercase transition-colors ${
                    isActive ? "text-emerald-700 font-extrabold" : "text-slate-400 group-hover/bar:text-slate-600"
                  }`}>
                    {item.label}
                  </span>
                  {/* Active day indicator */}
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
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

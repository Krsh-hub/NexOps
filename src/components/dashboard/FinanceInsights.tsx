import { BarChart3, TrendingUp, PlusCircle } from "lucide-react";

interface FinanceInsightsProps {
  invoices?: any[];
  currencySymbol?: string;
}

export function FinanceInsights({ invoices = [], currencySymbol = "₹" }: FinanceInsightsProps) {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDayIndex = (new Date().getDay() + 6) % 7; // Mon is 0, Sun is 6

  // Group real paid invoices by day of the week
  const dailyTotals = [0, 0, 0, 0, 0, 0, 0];
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - currentDayIndex);
  startOfWeek.setHours(0, 0, 0, 0);

  invoices.forEach((inv) => {
    if (inv.status === "PAID" && inv.paidAt) {
      const paidDate = new Date(inv.paidAt);
      if (paidDate >= startOfWeek) {
        const dayIdx = (paidDate.getDay() + 6) % 7;
        dailyTotals[dayIdx] += inv.total || 0;
      }
    }
  });

  const total = dailyTotals.reduce((a, b) => a + b, 0);
  const maxVal = Math.max(...dailyTotals, 100);

  const chartData = daysOfWeek.map((day, idx) => ({
    label: day,
    amount: dailyTotals[idx],
    display: `${currencySymbol}${dailyTotals[idx].toLocaleString("en-IN")}`,
    percentage: total > 0 ? (dailyTotals[idx] / maxVal) * 100 : 0,
  }));

  const hasData = total > 0;

  return (
    <div className="card-surface flex flex-col h-full rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md group">
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/40">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shadow-xs">
            <BarChart3 className="w-4 h-4" strokeWidth={2.2} />
          </div>
          <div>
            <span className="text-[12px] font-bold text-slate-400 tracking-wider uppercase">
              Revenue Trend
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[22px] font-bold text-slate-900 leading-tight">
                {currencySymbol}{total.toLocaleString("en-IN")}
              </span>
              <span className="text-[13px] font-medium text-slate-500">This week</span>
            </div>
          </div>
        </div>

        {hasData && (
          <div className="flex items-center gap-1.5 text-[13px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-xs">
            <TrendingUp className="w-3.5 h-3.5" />
            Live
          </div>
        )}
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between relative min-h-[280px]">
        {/* Horizontal grid guide lines */}
        <div className="absolute inset-x-6 inset-y-10 flex flex-col justify-between pointer-events-none opacity-25">
          <div className="border-t border-dashed border-slate-300 w-full" />
          <div className="border-t border-dashed border-slate-300 w-full" />
          <div className="border-t border-dashed border-slate-300 w-full" />
          <div className="border-t border-dashed border-slate-300 w-full" />
        </div>

        {/* Empty State Banner if no revenue yet */}
        {!hasData && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 pointer-events-none">
            <p className="text-[14px] font-semibold text-slate-700">
              No revenue transactions recorded yet this week
            </p>
            <p className="text-[13px] text-slate-400 max-w-xs mt-1">
              Paid invoices and sales will plot automatically across the days above.
            </p>
          </div>
        )}

        {/* Bars Container */}
        <div className={`flex items-end gap-3 sm:gap-4 h-full z-10 pt-4 ${!hasData ? "opacity-25" : ""}`}>
          {chartData.map((item, i) => {
            const isActive = i === currentDayIndex;
            return (
              <div key={item.label} className="flex-1 flex flex-col items-center gap-3 h-full group/bar relative">
                <div className="w-full relative rounded-xl overflow-hidden bg-slate-100/80 h-full flex flex-col justify-end">
                  {/* Tooltip on hover */}
                  {hasData && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2.5 py-1 rounded-md opacity-0 group-hover/bar:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-30 text-[12px] font-medium shadow-md">
                      {item.display}
                    </div>
                  )}

                  <div
                    className={`w-full rounded-xl transition-all duration-500 origin-bottom ${
                      item.amount > 0
                        ? "bg-gradient-to-t from-emerald-600 to-teal-500 shadow-xs"
                        : "bg-slate-200/60"
                    }`}
                    style={{ height: `${Math.max(item.amount > 0 ? 15 : 6, item.percentage)}%` }}
                  />
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span
                    className={`text-[12px] font-semibold tracking-wider uppercase transition-colors ${
                      isActive ? "text-emerald-700 font-bold" : "text-slate-400 group-hover/bar:text-slate-600"
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

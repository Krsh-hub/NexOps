import Link from "next/link";
import { BarChart3, TrendingUp, Plus, ArrowUpRight } from "lucide-react";

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
  const avgDaily = Math.round(total / 7);

  const chartData = daysOfWeek.map((day, idx) => ({
    label: day,
    amount: dailyTotals[idx],
    display: `${currencySymbol}${dailyTotals[idx].toLocaleString("en-IN")}`,
    percentage: total > 0 ? (dailyTotals[idx] / maxVal) * 100 : 0,
  }));

  const hasData = total > 0;

  return (
    <div className="linear-card flex flex-col overflow-hidden group">
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-xs">
            <BarChart3 className="w-4 h-4" strokeWidth={2.2} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              Financial Health
            </span>
            <div className="flex items-baseline gap-2.5 mt-0.5">
              <span className="mono-num text-[22px] font-bold text-slate-900 leading-tight">
                {currencySymbol}{total.toLocaleString("en-IN")}
              </span>
              <span className="text-[12px] font-medium text-slate-500">This week</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasData && (
            <span className="flex items-center gap-1 text-[12px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <TrendingUp className="w-3.5 h-3.5" />
              Live
            </span>
          )}
          <Link
            href="/finance"
            className="text-[12px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
          >
            <span>Finance View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="p-6 relative min-h-[260px] flex flex-col justify-between">
        {/* Horizontal guide lines */}
        <div className="absolute inset-x-6 inset-y-10 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-t border-dashed border-slate-300 w-full" />
          <div className="border-t border-dashed border-slate-300 w-full" />
          <div className="border-t border-dashed border-slate-300 w-full" />
          <div className="border-t border-dashed border-slate-300 w-full" />
        </div>

        {/* Empty state banner if no revenue */}
        {!hasData && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 space-y-2 pointer-events-none">
            <p className="text-[14px] font-bold text-slate-800">
              No revenue recorded yet this week
            </p>
            <p className="text-[12px] text-slate-500 max-w-xs">
              Paid invoices and recorded transactions will automatically graph across the days.
            </p>
          </div>
        )}

        {/* Bars Container */}
        <div className={`flex items-end gap-3 sm:gap-4 h-48 z-10 pt-4 ${!hasData ? "opacity-20" : ""}`}>
          {chartData.map((item, i) => {
            const isActive = i === currentDayIndex;
            return (
              <div key={item.label} className="flex-1 flex flex-col items-center gap-2.5 h-full group/bar relative">
                <div className="w-full relative rounded-xl overflow-hidden bg-slate-100 h-full flex flex-col justify-end">
                  {/* Tooltip on hover */}
                  {hasData && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-0.5 rounded text-[11px] font-medium opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none whitespace-nowrap z-30 shadow-md">
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
                    className={`text-[11px] font-semibold tracking-wider uppercase transition-colors ${
                      isActive ? "text-emerald-800 font-extrabold" : "text-slate-400 group-hover/bar:text-slate-600"
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

        {/* Bottom stats summary */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 text-[12px] text-slate-500">
          <div>
            <span>Daily Average: </span>
            <span className="font-bold text-slate-800">{currencySymbol}{avgDaily.toLocaleString("en-IN")}</span>
          </div>
          <div>
            <span>Weekly Cashflow: </span>
            <span className="font-bold text-emerald-700">{currencySymbol}{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

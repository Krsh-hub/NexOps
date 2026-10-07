import { TrendingUp, TrendingDown, AlertTriangle, FileText, ClipboardList, IndianRupee, DollarSign, Euro, PoundSterling } from "lucide-react";

interface StatCardsProps {
  revenue: { amount: number; change: number };
  lowStockCount: number;
  overdueInvoices: { count: number; total: number };
  activeOrders: number;
  currencySymbol?: string;
}

export function StatCards({
  revenue,
  lowStockCount,
  overdueInvoices,
  activeOrders,
  currencySymbol = "₹",
}: StatCardsProps) {
  const cards = [
    {
      label: "Revenue",
      value: `${currencySymbol}${revenue.amount.toLocaleString("en-IN")}`,
      change: revenue.change,
      positive: revenue.change >= 0,
      icon: IndianRupee,
      borderAccent: "border-b-emerald-600",
      accentBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeText: revenue.amount > 0 ? `${revenue.change >= 0 ? "+" : ""}${revenue.change}%` : "No sales yet",
      isPositive: revenue.change >= 0,
    },
    {
      label: "Low Stock",
      value: lowStockCount.toString(),
      suffix: lowStockCount === 1 ? "item" : "items",
      icon: AlertTriangle,
      borderAccent: lowStockCount > 0 ? "border-b-amber-500" : "border-b-emerald-600",
      accentBg: lowStockCount > 0 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeText: lowStockCount > 0 ? "Needs restock" : "All healthy",
      isPositive: lowStockCount === 0,
    },
    {
      label: "Overdue Invoices",
      value: overdueInvoices.count.toString(),
      sub: overdueInvoices.total > 0 ? `${currencySymbol}${overdueInvoices.total.toLocaleString("en-IN")}` : undefined,
      icon: FileText,
      borderAccent: overdueInvoices.count > 0 ? "border-b-rose-500" : "border-b-emerald-600",
      accentBg: overdueInvoices.count > 0 ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeText: overdueInvoices.count > 0 ? "Pending collection" : "Zero overdue",
      isPositive: overdueInvoices.count === 0,
    },
    {
      label: "Active POs",
      value: activeOrders.toString(),
      suffix: activeOrders === 1 ? "order" : "orders",
      icon: ClipboardList,
      borderAccent: "border-b-teal-600",
      accentBg: "bg-teal-50 text-teal-700 border-teal-200",
      badgeText: activeOrders > 0 ? "In progress" : "No pending POs",
      isPositive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`card-surface p-6 sm:p-7 rounded-2xl flex flex-col justify-between gap-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-slate-200/90 border-b-4 ${card.borderAccent} group`}
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-slate-500 tracking-wider uppercase">
                {card.label}
              </span>
              <div
                className={`w-11 h-11 rounded-xl ${card.accentBg} border flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className="w-5 h-5" strokeWidth={2.2} />
              </div>
            </div>

            {/* Metric Value & Badges */}
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-[30px] sm:text-[34px] font-extrabold text-slate-900 tracking-tight leading-none">
                  {card.value}
                </span>
                {card.suffix && (
                  <span className="text-[14px] font-medium text-slate-500">
                    {card.suffix}
                  </span>
                )}
                {card.sub && (
                  <span className="text-[13px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 ml-1">
                    {card.sub}
                  </span>
                )}
              </div>

              {/* Status pill */}
              <div className="flex items-center gap-1.5 text-[12px] font-semibold">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md ${
                    card.isPositive
                      ? "text-emerald-800 bg-emerald-50 border border-emerald-200"
                      : "text-amber-800 bg-amber-50 border border-amber-200"
                  }`}
                >
                  {card.badgeText}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

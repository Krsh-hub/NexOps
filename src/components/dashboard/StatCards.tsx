import { TrendingUp, AlertTriangle, FileText, ClipboardList, IndianRupee } from "lucide-react";

interface StatCardsProps {
  revenue: { amount: number; change: number };
  lowStockCount: number;
  overdueInvoices: { count: number; total: number };
  activeOrders: number;
  currencySymbol?: string;
  compact?: boolean;
}

export function StatCards({
  revenue,
  lowStockCount,
  overdueInvoices,
  activeOrders,
  currencySymbol = "₹",
  compact = false,
}: StatCardsProps) {
  const cards = [
    {
      label: "Today's Revenue",
      value: `${currencySymbol}${revenue.amount.toLocaleString("en-IN")}`,
      change: revenue.change,
      icon: IndianRupee,
      borderTop: "border-t-emerald-600",
      iconBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeText: revenue.amount > 0 ? `${revenue.change >= 0 ? "+" : ""}${revenue.change}%` : "Zero sales",
      isPositive: revenue.change >= 0,
    },
    {
      label: "Stock Alerts",
      value: lowStockCount.toString(),
      suffix: lowStockCount === 1 ? "item" : "items",
      icon: AlertTriangle,
      borderTop: lowStockCount > 0 ? "border-t-amber-500" : "border-t-emerald-600",
      iconBg: lowStockCount > 0 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeText: lowStockCount > 0 ? "Action needed" : "All healthy",
      isPositive: lowStockCount === 0,
    },
    {
      label: "Overdue Invoices",
      value: overdueInvoices.count.toString(),
      sub: overdueInvoices.total > 0 ? `${currencySymbol}${overdueInvoices.total.toLocaleString("en-IN")}` : undefined,
      icon: FileText,
      borderTop: overdueInvoices.count > 0 ? "border-t-rose-500" : "border-t-emerald-600",
      iconBg: overdueInvoices.count > 0 ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeText: overdueInvoices.count > 0 ? "Pending collection" : "Zero overdue",
      isPositive: overdueInvoices.count === 0,
    },
    {
      label: "Active Orders",
      value: activeOrders.toString(),
      suffix: activeOrders === 1 ? "order" : "orders",
      icon: ClipboardList,
      borderTop: "border-t-teal-600",
      iconBg: "bg-teal-50 text-teal-700 border-teal-200",
      badgeText: activeOrders > 0 ? "In transit" : "No active POs",
      isPositive: true,
    },
  ];

  return (
    <div className={`grid ${compact ? "grid-cols-2 gap-3.5" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"}`}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`card-surface p-5 rounded-2xl flex flex-col justify-between gap-4 border border-slate-200/90 bg-white shadow-xs hover:shadow-md transition-all duration-200 border-t-3 ${card.borderTop} group`}
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-slate-500 tracking-wider uppercase">
                {card.label}
              </span>
              <div
                className={`w-8 h-8 rounded-lg ${card.iconBg} border flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105`}
              >
                <Icon className="w-4 h-4" strokeWidth={2.2} />
              </div>
            </div>

            {/* Metric Value & Badges */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-[24px] sm:text-[28px] font-extrabold text-slate-900 tracking-tight leading-none">
                  {card.value}
                </span>
                {card.suffix && (
                  <span className="text-[13px] font-medium text-slate-500">
                    {card.suffix}
                  </span>
                )}
                {card.sub && (
                  <span className="text-[12px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 ml-1">
                    {card.sub}
                  </span>
                )}
              </div>

              {/* Status pill */}
              <div className="flex items-center gap-1.5 text-[11px] font-semibold">
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

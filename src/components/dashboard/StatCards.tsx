import { TrendingUp, TrendingDown, IndianRupee, AlertTriangle, FileText, ClipboardList } from "lucide-react";

interface StatCardsProps {
  revenue: { amount: number; change: number };
  lowStockCount: number;
  overdueInvoices: { count: number; total: number };
  activeOrders: number;
}

export function StatCards({ revenue, lowStockCount, overdueInvoices, activeOrders }: StatCardsProps) {
  const cards = [
    {
      label: "Revenue",
      value: `₹${revenue.amount.toLocaleString("en-IN")}`,
      change: revenue.change,
      positive: revenue.change >= 0,
      icon: IndianRupee,
      glow: "rgba(16, 185, 129, 0.15)",
      accentClass: "text-[var(--green)] bg-[var(--green-subtle)]"
    },
    {
      label: "Low Stock",
      value: lowStockCount.toString(),
      suffix: "items",
      icon: AlertTriangle,
      glow: lowStockCount > 0 ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
      accentClass: lowStockCount > 0 ? "text-[var(--orange)] bg-[var(--orange-subtle)]" : "text-[var(--green)] bg-[var(--green-subtle)]"
    },
    {
      label: "Overdue",
      value: overdueInvoices.count.toString(),
      sub: `₹${overdueInvoices.total.toLocaleString("en-IN")}`,
      icon: FileText,
      glow: overdueInvoices.count > 0 ? "rgba(244, 63, 94, 0.15)" : "rgba(16, 185, 129, 0.15)",
      accentClass: overdueInvoices.count > 0 ? "text-[var(--red)] bg-[var(--red-subtle)]" : "text-[var(--green)] bg-[var(--green-subtle)]"
    },
    {
      label: "Active POs",
      value: activeOrders.toString(),
      suffix: "pending",
      icon: ClipboardList,
      glow: "rgba(99, 102, 241, 0.15)",
      accentClass: "text-[var(--accent)] bg-[var(--accent-subtle)]"
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="card-surface p-4 flex flex-col gap-3 group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
            style={{
              boxShadow: `0 4px 20px -2px rgba(0, 0, 0, 0.1), 0 0 1px 0 rgba(255, 255, 255, 0.05)`
            }}
          >
            {/* Soft background glow */}
            <div 
              className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: card.glow }}
            />

            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-[var(--text-secondary)] tracking-wider uppercase">
                {card.label}
              </span>
              <div className={`w-7 h-7 rounded-lg ${card.accentClass} flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]`}>
                <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight leading-none">
                  {card.value}
                </span>
                {card.suffix && (
                  <span className="text-[16px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">{card.suffix}</span>
                )}
                {card.sub && (
                  <span className="text-[15px] font-semibold text-[var(--text-tertiary)]">{card.sub}</span>
                )}
              </div>

              {"change" in card && (
                <div className={`flex items-center gap-0.5 text-[16px] font-bold px-1.5 py-0.5 rounded-md ${
                  card.positive ? "text-[var(--green)] bg-[var(--green-subtle)]" : "text-[var(--red)] bg-[var(--red-subtle)]"
                }`}>
                  {card.positive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {Math.abs(card.change!)}%
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

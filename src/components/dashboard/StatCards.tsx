import { TrendingUp, TrendingDown } from "lucide-react";

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
    },
    {
      label: "Low Stock",
      value: lowStockCount.toString(),
      suffix: "items",
      dot: lowStockCount > 0 ? "var(--orange)" : "var(--green)",
    },
    {
      label: "Overdue",
      value: overdueInvoices.count.toString(),
      sub: `₹${overdueInvoices.total.toLocaleString("en-IN")}`,
      dot: overdueInvoices.count > 0 ? "var(--red)" : "var(--green)",
    },
    {
      label: "Active POs",
      value: activeOrders.toString(),
      suffix: "pending",
      dot: "var(--accent)",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="card-surface p-4 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[var(--text-tertiary)] tracking-wide uppercase">
              {card.label}
            </span>
            {"change" in card ? (
              <div className={`flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
                card.positive ? "text-[var(--green)] bg-[var(--green-subtle)]" : "text-[var(--red)] bg-[var(--red-subtle)]"
              }`}>
                {card.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(card.change!)}%
              </div>
            ) : card.dot ? (
              <div className="w-[6px] h-[6px] rounded-full" style={{ background: card.dot }} />
            ) : null}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[22px] font-semibold text-[var(--text-primary)] tracking-tight leading-none">
              {card.value}
            </span>
            {card.suffix && (
              <span className="text-[11px] font-medium text-[var(--text-quaternary)]">{card.suffix}</span>
            )}
            {card.sub && (
              <span className="text-[12px] font-medium text-[var(--text-quaternary)]">{card.sub}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

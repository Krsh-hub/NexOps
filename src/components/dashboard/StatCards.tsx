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
      accentClass: "text-white bg-gradient-to-br from-[var(--green)] to-emerald-600",
      borderAccent: "border-b-[var(--green)]",
      hasSparkline: true
    },
    {
      label: "Low Stock",
      value: lowStockCount.toString(),
      suffix: "items",
      icon: AlertTriangle,
      glow: lowStockCount > 0 ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
      accentClass: lowStockCount > 0 ? "text-white bg-gradient-to-br from-[var(--orange)] to-amber-600" : "text-[var(--green)] bg-[var(--green-subtle)]",
      borderAccent: lowStockCount > 0 ? "border-b-[var(--orange)]" : "border-b-[var(--border-primary)]"
    },
    {
      label: "Overdue",
      value: overdueInvoices.count.toString(),
      sub: `₹${overdueInvoices.total.toLocaleString("en-IN")}`,
      icon: FileText,
      glow: overdueInvoices.count > 0 ? "rgba(244, 63, 94, 0.15)" : "rgba(16, 185, 129, 0.15)",
      accentClass: overdueInvoices.count > 0 ? "text-white bg-gradient-to-br from-[var(--red)] to-rose-600" : "text-[var(--green)] bg-[var(--green-subtle)]",
      borderAccent: overdueInvoices.count > 0 ? "border-b-[var(--red)]" : "border-b-[var(--border-primary)]"
    },
    {
      label: "Active POs",
      value: activeOrders.toString(),
      suffix: "pending",
      icon: ClipboardList,
      glow: "rgba(99, 102, 241, 0.15)",
      accentClass: "text-white bg-gradient-to-br from-[var(--accent)] to-[var(--purple)]",
      borderAccent: "border-b-[var(--accent)]"
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`card-surface p-5 flex flex-col gap-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group border-b-2 ${card.borderAccent}`}
          >
            {/* Background glow orb */}
            <div 
              className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-[40px] opacity-40 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none"
              style={{ background: card.glow }}
            />

            {/* Sparkline decoration */}
            {card.hasSparkline && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="absolute bottom-0 w-full h-16 text-[var(--green)] stroke-current fill-none" strokeWidth="2">
                  <path d="M0,30 Q10,15 20,25 T40,15 T60,20 T80,5 T100,10" className="opacity-50" />
                  <path d="M0,30 Q15,20 25,28 T50,15 T70,25 T90,10 T100,5" />
                </svg>
              </div>
            )}

            <div className="flex items-center justify-between relative z-10">
              <span className="text-[15px] font-bold text-[var(--text-secondary)] tracking-wider uppercase">
                {card.label}
              </span>
              <div className={`w-10 h-10 rounded-xl ${card.accentClass} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <Icon className="w-5 h-5" strokeWidth={2} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-2 relative z-10">
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] sm:text-[32px] font-bold text-[var(--text-primary)] tracking-tight leading-none">
                  {card.value}
                </span>
                {card.suffix && (
                  <span className="text-[15px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">{card.suffix}</span>
                )}
                {card.sub && (
                  <span className="text-[15px] font-medium text-[var(--text-tertiary)] bg-[var(--bg-primary)] px-2 py-0.5 rounded border border-[var(--border-primary)] shadow-sm">{card.sub}</span>
                )}
              </div>

              {"change" in card && (
                <div className={`flex items-center gap-1 text-[15px] font-bold px-2 py-1 rounded-md shadow-sm ${
                  card.positive ? "text-[var(--green)] bg-[var(--green-subtle)] border border-[var(--green)]/20" : "text-[var(--red)] bg-[var(--red-subtle)] border border-[var(--red)]/20"
                }`}>
                  {card.positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
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

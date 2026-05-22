import { TrendingUp, TrendingDown, IndianRupee, Package, AlertCircle, FileText } from "lucide-react";

interface StatCardsProps {
  revenue: { amount: number; change: number };
  lowStockCount: number;
  overdueInvoices: { count: number; total: number };
  activeOrders: number;
}

export function StatCards({ revenue, lowStockCount, overdueInvoices, activeOrders }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Revenue */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 flex flex-col justify-between h-[100px] hover:border-[var(--border-default)] transition-colors shadow-sm">
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Revenue</span>
          <div className={`flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded ${revenue.change >= 0 ? "bg-[var(--success-bg)] text-[var(--success)]" : "bg-[var(--danger-bg)] text-[var(--danger)]"}`}>
            {revenue.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(revenue.change)}%
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-sm text-[var(--text-muted)] font-medium">₹</span>
          <span className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            {revenue.amount.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Inventory Risk */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 flex flex-col justify-between h-[100px] hover:border-[var(--border-default)] transition-colors shadow-sm">
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Low Stock</span>
          {lowStockCount > 0 ? (
            <div className="w-2 h-2 rounded-full bg-[var(--warning)]" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
          )}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            {lowStockCount}
          </span>
          <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Items</span>
        </div>
      </div>

      {/* Overdue Invoices */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 flex flex-col justify-between h-[100px] hover:border-[var(--border-default)] transition-colors shadow-sm">
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Overdue</span>
          {overdueInvoices.count > 0 && (
             <div className="w-2 h-2 rounded-full bg-[var(--danger)]" />
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            {overdueInvoices.count}
          </span>
          <span className="text-sm font-medium text-[var(--text-muted)]">
            (₹{overdueInvoices.total.toLocaleString("en-IN")})
          </span>
        </div>
      </div>

      {/* Active Orders */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 flex flex-col justify-between h-[100px] hover:border-[var(--border-default)] transition-colors shadow-sm">
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Active POs</span>
          <div className="w-2 h-2 rounded-full bg-[var(--info)]" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            {activeOrders}
          </span>
          <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Pending</span>
        </div>
      </div>
    </div>
  );
}

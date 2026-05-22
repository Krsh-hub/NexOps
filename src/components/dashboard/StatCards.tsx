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
<<<<<<< HEAD
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
=======
      {/* Revenue Card */}
      <div className="card p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-[var(--text-secondary)] font-medium text-sm">
            <IndianRupee className="w-4 h-4" />
            Today's Revenue
          </div>
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${revenue.change >= 0 ? "bg-[var(--success-bg)] text-[var(--success)]" : "bg-[var(--danger-bg)] text-[var(--danger)]"}`}>
            {revenue.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{Math.abs(revenue.change)}%</span>
          </div>
        </div>
        <div>
          <p className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            ₹{revenue.amount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Low Stock Card */}
      <div className="card p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-[var(--text-secondary)] font-medium text-sm">
            <Package className="w-4 h-4" />
            Low Stock Items
          </div>
          {lowStockCount > 0 && (
            <span className="badge badge-warning">Action Needed</span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            {lowStockCount}
          </p>
          <span className="text-sm font-medium text-[var(--text-muted)]">items</span>
>>>>>>> cc131e69d7b544ffbf288f7ac8c855fbdcb15055
        </div>
      </div>

      {/* Overdue Invoices */}
<<<<<<< HEAD
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
=======
      <div className="card p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-[var(--text-secondary)] font-medium text-sm">
            <AlertCircle className="w-4 h-4" />
            Overdue Invoices
          </div>
          <span className="text-[var(--danger)] text-xs font-medium bg-[var(--danger-bg)] px-2 py-1 rounded-md">
            Review
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            {overdueInvoices.count}
          </p>
>>>>>>> cc131e69d7b544ffbf288f7ac8c855fbdcb15055
          <span className="text-sm font-medium text-[var(--text-muted)]">
            (₹{overdueInvoices.total.toLocaleString("en-IN")})
          </span>
        </div>
      </div>

      {/* Active Orders */}
<<<<<<< HEAD
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
=======
      <div className="card p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-[var(--text-secondary)] font-medium text-sm">
            <FileText className="w-4 h-4" />
            Active Orders
          </div>
          <span className="badge badge-info">Processing</span>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            {activeOrders}
          </p>
          <span className="text-sm font-medium text-[var(--text-muted)]">pending POs</span>
>>>>>>> cc131e69d7b544ffbf288f7ac8c855fbdcb15055
        </div>
      </div>
    </div>
  );
}

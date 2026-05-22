import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  FileText, 
  AlertCircle,
  IndianRupee 
} from "lucide-react";

interface StatCardsProps {
  revenue: { amount: number; change: number };
  lowStockCount: number;
  overdueInvoices: { count: number; total: number };
  activeOrders: number;
}

export function StatCards({ revenue, lowStockCount, overdueInvoices, activeOrders }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        </div>
      </div>

      {/* Overdue Invoices */}
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
          <span className="text-sm font-medium text-[var(--text-muted)]">
            (₹{overdueInvoices.total.toLocaleString("en-IN")})
          </span>
        </div>
      </div>

      {/* Active Orders */}
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
        </div>
      </div>
    </div>
  );
}

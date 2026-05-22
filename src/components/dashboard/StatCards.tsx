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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Revenue Card */}
      <div className="kpi-card group">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-[var(--accent-primary-glow)] text-[var(--accent-primary)] group-hover:shadow-[var(--shadow-glow)] transition-all">
            <IndianRupee size={20} />
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${revenue.change >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
            {revenue.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{Math.abs(revenue.change)}%</span>
          </div>
        </div>
        <div>
          <h3 className="text-[var(--text-muted)] text-sm font-medium mb-1">Today's Revenue</h3>
          <p className="text-2xl font-semibold text-white tracking-tight">
            ₹{revenue.amount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Low Stock Card */}
      <div className="kpi-card group">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-[var(--warning-glow)] text-[var(--warning)] group-hover:shadow-[0_0_15px_var(--warning-glow)] transition-all">
            <Package size={20} />
          </div>
          {lowStockCount > 0 && (
            <span className="badge badge-warning animate-pulse">Critical</span>
          )}
        </div>
        <div>
          <h3 className="text-[var(--text-muted)] text-sm font-medium mb-1">Low Stock Items</h3>
          <p className="text-2xl font-semibold text-white tracking-tight">
            {lowStockCount} <span className="text-sm font-normal text-[var(--text-muted)]">items</span>
          </p>
        </div>
      </div>

      {/* Overdue Invoices */}
      <div className="kpi-card group">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-[var(--danger-glow)] text-[var(--danger)] group-hover:shadow-[0_0_15px_var(--danger-glow)] transition-all">
            <AlertCircle size={20} />
          </div>
          <span className="text-[var(--danger)] text-sm font-medium">Action Required</span>
        </div>
        <div>
          <h3 className="text-[var(--text-muted)] text-sm font-medium mb-1">Overdue Invoices</h3>
          <p className="text-2xl font-semibold text-white tracking-tight flex items-baseline gap-2">
            {overdueInvoices.count} 
            <span className="text-sm font-normal text-[var(--text-muted)]">
              (₹{overdueInvoices.total.toLocaleString("en-IN")})
            </span>
          </p>
        </div>
      </div>

      {/* Active Orders */}
      <div className="kpi-card group">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-[var(--accent-secondary-glow)] text-[var(--accent-secondary)] group-hover:shadow-[0_0_15px_var(--accent-secondary-glow)] transition-all">
            <FileText size={20} />
          </div>
          <span className="badge badge-info">Processing</span>
        </div>
        <div>
          <h3 className="text-[var(--text-muted)] text-sm font-medium mb-1">Active Purchase Orders</h3>
          <p className="text-2xl font-semibold text-white tracking-tight">
            {activeOrders} <span className="text-sm font-normal text-[var(--text-muted)]">pending</span>
          </p>
        </div>
      </div>
    </div>
  );
}

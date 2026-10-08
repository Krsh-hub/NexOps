import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, PackagePlus, Box, ShoppingCart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  reorderThreshold: number;
  unit: string;
  vendor?: { name: string } | null;
}

interface InventoryRiskProps {
  products: Product[];
  totalProductsCount?: number;
}

export function InventoryRisk({ products, totalProductsCount = 0 }: InventoryRiskProps) {
  const hasLowStock = products.length > 0;
  const hasAnyProducts = totalProductsCount > 0 || products.length > 0;

  return (
    <div className="linear-card flex flex-col overflow-hidden group">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shadow-xs">
            <AlertTriangle className="w-4 h-4" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-slate-900 leading-tight">
              Urgent Attention
            </h3>
            <span className="text-[11px] font-medium text-slate-500">
              Stock risks & shortages
            </span>
          </div>
        </div>

        <span
          className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs ${
            hasLowStock
              ? "text-amber-800 bg-amber-50 border-amber-200"
              : "text-emerald-800 bg-emerald-50 border-emerald-200"
          }`}
        >
          {products.length} {products.length === 1 ? "alert" : "alerts"}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {!hasAnyProducts ? (
          /* Empty Catalog Starter Card */
          <div className="p-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-[14px] font-bold text-slate-900">
                Track Real Inventory
              </h4>
              <p className="text-[12px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                Add your items to monitor stock shortages and automate reorder alerts.
              </p>
            </div>
            <Link
              href="/inventory"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[12px] shadow-xs transition-colors cursor-pointer"
            >
              <span>+ Add Product</span>
            </Link>
          </div>
        ) : !hasLowStock ? (
          /* All Healthy Card */
          <div className="p-5 rounded-xl border border-emerald-100 bg-emerald-50/40 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-[14px] font-bold text-slate-900">
              All Inventory Healthy
            </h4>
            <p className="text-[12px] text-slate-600 max-w-xs mx-auto">
              All tracked products are currently above minimum threshold levels.
            </p>
          </div>
        ) : (
          /* List of alerts */
          <div className="space-y-3">
            {products.map((p, index) => {
              const ratio = p.reorderThreshold > 0 ? p.currentStock / p.reorderThreshold : 0;
              const isOut = p.currentStock === 0;
              const isCritical = ratio <= 0.3;
              const barColor = isOut
                ? "from-rose-500 to-red-600"
                : isCritical
                ? "from-amber-500 to-rose-500"
                : "from-amber-400 to-amber-500";
              const percent = Math.min(100, Math.max(0, ratio * 100));

              return (
                <div
                  key={p.id}
                  className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 hover:border-slate-300 hover:bg-white transition-all flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="min-w-0">
                      <h4 className="text-[13px] font-bold text-slate-900 truncate">
                        {p.name}
                      </h4>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {p.sku} {p.vendor?.name ? `· ${p.vendor.name}` : ""}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-[14px] font-bold ${
                          isOut || isCritical ? "text-rose-600" : "text-amber-700"
                        }`}
                      >
                        {p.currentStock}
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        / {p.reorderThreshold} {p.unit}
                      </span>
                    </div>
                  </div>

                  <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                      style={{ width: `${Math.max(3, percent)}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <Link
              href="/inventory"
              className="flex items-center justify-center gap-1.5 pt-2 text-[12px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <span>View Full Inventory Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

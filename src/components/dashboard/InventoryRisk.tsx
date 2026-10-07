import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, PackagePlus, Box } from "lucide-react";

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
    <div className="card-surface flex flex-col h-full rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md group">
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/40">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 shadow-xs">
            <AlertTriangle className="w-4 h-4" strokeWidth={2.2} />
          </div>
          <div>
            <span className="text-[12px] font-bold text-slate-400 tracking-wider uppercase">
              Inventory Risk
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[17px] font-bold text-slate-900 leading-tight">
                {hasLowStock ? "Stock Alerts" : "Stock Status"}
              </span>
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-1.5 text-[13px] font-bold px-3 py-1 rounded-lg border shadow-xs ${
          hasLowStock 
            ? "text-amber-800 bg-amber-50 border-amber-200" 
            : "text-emerald-800 bg-emerald-50 border-emerald-200"
        }`}>
          {products.length} {products.length === 1 ? "alert" : "alerts"}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {!hasAnyProducts ? (
          /* Empty catalog state */
          <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shadow-xs">
              <Box className="w-7 h-7" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-slate-900">No Products in Catalog</h3>
              <p className="text-[13px] text-slate-500 max-w-[240px] mt-1 leading-relaxed">
                Add your real inventory or supply items to automatically monitor reorder levels.
              </p>
            </div>
            <Link
              href="/inventory"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[13px] transition-colors shadow-xs"
            >
              <PackagePlus className="w-4 h-4" /> Add First Product
            </Link>
          </div>
        ) : !hasLowStock ? (
          /* All items healthy */
          <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shadow-xs">
              <CheckCircle2 className="w-7 h-7" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-slate-900">All Inventory Healthy</h3>
              <p className="text-[13px] text-slate-500 max-w-[220px] mt-1 leading-relaxed">
                All tracked items are currently stocked above their minimum reorder thresholds.
              </p>
            </div>
          </div>
        ) : (
          /* List of low stock products */
          <div className="p-4 sm:p-5 flex flex-col gap-3">
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
                  className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 hover:border-slate-300 hover:bg-white transition-all duration-200 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-500 shrink-0 mt-0.5 shadow-xs">
                        #{index + 1}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[14px] font-bold text-slate-900 truncate">
                          {p.name}
                        </h4>
                        <div className="text-[12px] text-slate-500 font-medium mt-0.5">
                          {p.sku} {p.vendor?.name ? `· ${p.vendor.name}` : ""}
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/inventory"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors shrink-0"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-[13px] font-medium text-slate-600">Stock Level</span>
                      <div className="text-right">
                        <span
                          className={`text-[15px] font-bold ${
                            isOut || isCritical ? "text-rose-600" : "text-amber-700"
                          }`}
                        >
                          {p.currentStock}
                        </span>
                        <span className="text-[12px] font-medium text-slate-500 ml-1">
                          / {p.reorderThreshold} {p.unit}
                        </span>
                      </div>
                    </div>

                    <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
                        style={{ width: `${Math.max(3, percent)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

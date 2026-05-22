import { AlertTriangle, ArrowRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  reorderThreshold: number;
  unit: string;
  vendor?: { name: string } | null;
}

export function InventoryRisk({ products }: { products: Product[] }) {
  return (
    <div className="card-surface flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3.5 flex items-center gap-2 border-b border-[var(--border-primary)]">
        <AlertTriangle className="w-4 h-4 text-[var(--orange)]" strokeWidth={1.8} />
        <span className="text-[13px] font-semibold text-[var(--text-primary)]">Stock Alerts</span>
        <span className="ml-auto text-[11px] text-[var(--text-quaternary)] font-medium">{products.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {products.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[13px] text-[var(--text-quaternary)]">All stock levels healthy</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-primary)]">
            {products.map((p) => {
              const isOut = p.currentStock === 0;
              return (
                <div key={p.id} className="px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors duration-150 group flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-[var(--text-primary)] truncate">{p.name}</span>
                      {isOut && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[var(--red-subtle)] text-[var(--red)]">
                          Out
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[var(--text-quaternary)] font-mono mt-0.5">
                      {p.sku} · {p.vendor?.name || "No vendor"}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-[13px] font-semibold ${isOut ? "text-[var(--red)]" : "text-[var(--orange)]"}`}>
                      {p.currentStock} <span className="text-[10px] text-[var(--text-quaternary)] font-normal">{p.unit}</span>
                    </div>
                    <div className="text-[10px] text-[var(--text-quaternary)]">min {p.reorderThreshold}</div>
                  </div>
                  <button className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-quaternary)] opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-active)] hover:text-[var(--text-secondary)] transition-all duration-200 shrink-0">
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

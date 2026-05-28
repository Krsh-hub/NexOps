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
    <div className="card-surface flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="px-4 py-3.5 flex items-center justify-between border-b border-[var(--border-primary)]/50 bg-[var(--bg-secondary)]/30">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[var(--orange-subtle)] text-[var(--orange)] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2.2} />
          </div>
          <span className="text-[12px] font-bold text-[var(--text-primary)] tracking-wide uppercase">Critical Stock Alerts</span>
        </div>
        <span className="text-[10px] font-bold text-[var(--text-tertiary)] bg-[var(--border-primary)] border border-[var(--border-secondary)]/25 px-1.5 py-0.5 rounded-md">
          {products.length} items
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide divide-y divide-[var(--border-primary)]/45">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-[var(--text-tertiary)]">
            <p className="text-[12px] font-semibold text-[var(--green)]">✓ All stock levels healthy</p>
          </div>
        ) : (
          products.map((p) => {
            const isOut = p.currentStock === 0;
            const isCritical = p.currentStock <= p.reorderThreshold * 0.3;
            const statusClass = isOut 
              ? "bg-[var(--red-subtle)] text-[var(--red)]" 
              : isCritical 
                ? "bg-[var(--red-subtle)] text-[var(--red)] opacity-90" 
                : "bg-[var(--orange-subtle)] text-[var(--orange)]";

            return (
              <div key={p.id} className="px-4 py-3 hover:bg-[var(--bg-hover)] transition-all duration-150 group flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12.5px] font-semibold text-[var(--text-primary)] truncate">{p.name}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${statusClass}`}>
                      {isOut ? "Out" : isCritical ? "Critical" : "Low"}
                    </span>
                  </div>
                  <div className="text-[10.5px] text-[var(--text-tertiary)] font-bold font-mono mt-0.5">
                    {p.sku} · <span className="font-semibold text-[var(--text-secondary)]">{p.vendor?.name || "No vendor"}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <div className={`text-[12.5px] font-bold ${isOut || isCritical ? "text-[var(--red)]" : "text-[var(--orange)]"}`}>
                      {p.currentStock} <span className="text-[10px] text-[var(--text-tertiary)] font-semibold">{p.unit}</span>
                    </div>
                    <div className="text-[9.5px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">min {p.reorderThreshold}</div>
                  </div>
                  
                  <button className="w-6 h-6 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-active)] hover:text-white transition-all duration-200 cursor-pointer shadow-sm">
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

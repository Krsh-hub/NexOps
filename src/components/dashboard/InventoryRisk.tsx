import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";

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
    <div className="card-surface flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-t-2 border-t-[var(--orange)] group">
      <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--border-primary)]/50 bg-[var(--bg-secondary)]/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--orange)] to-amber-600 text-white flex items-center justify-center shadow-lg shadow-[var(--orange)]/20 animate-pulse-soft">
            <AlertTriangle className="w-4 h-4" strokeWidth={2.2} />
          </div>
          <div>
            <span className="text-[13px] font-bold text-[var(--text-tertiary)] tracking-widest uppercase">Inventory Risk</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[16px] font-bold text-[var(--text-primary)] leading-none">Critical Alerts</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[14px] font-bold text-[var(--orange)] bg-[var(--orange-subtle)] px-2.5 py-1 rounded-md border border-[var(--orange)]/20 shadow-sm">
          {products.length} items
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[var(--green-subtle)] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-[var(--green)]" strokeWidth={2} />
            </div>
            <h3 className="text-[18px] font-bold text-[var(--text-primary)] mb-1">All Inventory Healthy</h3>
            <p className="text-[15px] text-[var(--text-secondary)] max-w-[200px]">Stock levels are above minimum thresholds.</p>
          </div>
        ) : (
          <div className="p-3 flex flex-col gap-2">
            {products.map((p, index) => {
              const ratio = p.currentStock / p.reorderThreshold;
              const isOut = p.currentStock === 0;
              const isCritical = ratio <= 0.3;
              
              const barColor = isOut ? "from-[var(--red)] to-rose-500" : isCritical ? "from-[var(--orange)] to-red-500" : "from-amber-400 to-[var(--orange)]";
              const percent = Math.min(100, Math.max(0, ratio * 100));

              return (
                <div key={p.id} className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl p-3.5 hover:border-[var(--border-secondary)] transition-all duration-200 group/item flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-6 h-6 rounded bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center text-[12px] font-bold text-[var(--text-tertiary)] shrink-0 mt-0.5">
                        #{index + 1}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[15px] font-bold text-[var(--text-primary)] truncate">{p.name}</h4>
                        <div className="text-[13px] text-[var(--text-tertiary)] font-medium mt-0.5">
                          {p.sku} · {p.vendor?.name || "No vendor"}
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] bg-[var(--bg-secondary)] hover:bg-[var(--accent)] hover:text-white transition-all duration-200 shrink-0 border border-[var(--border-primary)] shadow-sm">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <div className="text-[14px] font-medium text-[var(--text-secondary)]">Stock Level</div>
                      <div className="text-right">
                        <span className={`text-[16px] font-bold ${isOut || isCritical ? 'text-[var(--red)]' : 'text-[var(--orange)]'}`}>
                          {p.currentStock}
                        </span>
                        <span className="text-[13px] font-medium text-[var(--text-tertiary)] ml-1">/ {p.reorderThreshold} {p.unit}</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${barColor} shadow-[0_0_8px_rgba(0,0,0,0.2)] transition-all duration-1000 ease-out`}
                        style={{ width: `${Math.max(2, percent)}%` }} // Minimum 2% so empty bar is still barely visible
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

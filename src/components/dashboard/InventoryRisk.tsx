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
  if (products.length === 0) {
    return (
      <div className="card p-5 h-full flex flex-col border border-[var(--border-subtle)] shadow-sm">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Inventory Risk</h3>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-sm text-[var(--text-muted)]">Inventory levels healthy.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card flex flex-col border border-[var(--border-subtle)] shadow-sm overflow-hidden h-full">
      <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Critical Stock</h3>
        </div>
        <span className="text-[10px] uppercase font-semibold tracking-wider text-[var(--text-muted)]">
          {products.length} Items
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-[var(--bg-base)]">
        <ul className="divide-y divide-[var(--border-subtle)]">
          {products.map((product) => {
            const isStockOut = product.currentStock === 0;
            return (
              <li key={product.id} className="p-4 hover:bg-[var(--bg-hover)] transition-colors group flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{product.name}</span>
                    {isStockOut && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider bg-[var(--danger-bg)] text-[var(--danger)]">
                        Out
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] font-mono">
                    {product.sku} <span className="mx-1">•</span> {product.vendor?.name || 'No Vendor'}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`text-sm font-bold ${isStockOut ? 'text-[var(--danger)]' : 'text-[var(--warning)]'}`}>
                      {product.currentStock} <span className="text-[10px] font-medium text-[var(--text-muted)]">{product.unit}</span>
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      Min: {product.reorderThreshold}
                    </div>
                  </div>
                  <button className="w-6 h-6 flex items-center justify-center rounded-md bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-all hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]">
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

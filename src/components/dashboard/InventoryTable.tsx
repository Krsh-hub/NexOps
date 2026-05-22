import { Package, AlertCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  reorderThreshold: number;
  unit: string;
  vendor?: { name: string } | null;
}

export function InventoryTable({ products }: { products: Product[] }) {
  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Package size={18} className="text-[var(--warning)]" />
          Low Stock Alerts
        </h2>
        <span className="badge badge-warning">{products.length} Items</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-default)]">
              <th className="pb-3 text-sm font-medium text-[var(--text-muted)]">Product</th>
              <th className="pb-3 text-sm font-medium text-[var(--text-muted)]">SKU</th>
              <th className="pb-3 text-sm font-medium text-[var(--text-muted)]">Stock Level</th>
              <th className="pb-3 text-sm font-medium text-[var(--text-muted)]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-[var(--text-muted)]">
                  All inventory levels are healthy.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isCritical = product.currentStock === 0;
                
                return (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3">
                      <div className="font-medium text-white">{product.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">{product.vendor?.name || 'Unknown Vendor'}</div>
                    </td>
                    <td className="py-3 text-sm text-[var(--text-secondary)]">{product.sku}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-black/50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isCritical ? 'bg-[var(--danger)]' : 'bg-[var(--warning)]'}`}
                            style={{ width: `${Math.min(100, (product.currentStock / product.reorderThreshold) * 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-white">
                          {product.currentStock} <span className="text-[var(--text-muted)] text-xs">{product.unit}</span>
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      {isCritical ? (
                        <span className="badge badge-danger">Out of Stock</span>
                      ) : (
                        <span className="badge badge-warning flex w-fit items-center gap-1">
                          <AlertCircle size={12} /> Low Stock
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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
    <div className="card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold flex items-center gap-2 text-[var(--text-primary)]">
          <Package className="w-5 h-5 text-[var(--text-secondary)]" />
          Low Stock Alerts
        </h2>
        <span className="badge badge-neutral">{products.length} Items</span>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-subtle)]">
              <th className="pb-3 text-base font-semibold text-[var(--text-muted)] uppercase tracking-wider">Product</th>
              <th className="pb-3 text-base font-semibold text-[var(--text-muted)] uppercase tracking-wider">SKU</th>
              <th className="pb-3 text-base font-semibold text-[var(--text-muted)] uppercase tracking-wider">Stock Level</th>
              <th className="pb-3 text-base font-semibold text-[var(--text-muted)] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-base text-[var(--text-muted)]">
                  All inventory levels are healthy.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const isCritical = product.currentStock === 0;
                
                return (
                  <tr key={product.id} className="hover:bg-[var(--bg-hover)] transition-colors group">
                    <td className="py-3">
                      <div className="font-medium text-[var(--text-primary)] text-base">{product.name}</div>
                      <div className="text-base text-[var(--text-muted)]">{product.vendor?.name || 'Unknown Vendor'}</div>
                    </td>
                    <td className="py-3 text-base text-[var(--text-secondary)]">{product.sku}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1.5 bg-[var(--bg-base)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                          <div 
                            className={`h-full rounded-full ${isCritical ? 'bg-[var(--danger)]' : 'bg-[var(--warning)]'}`}
                            style={{ width: `${Math.min(100, (product.currentStock / product.reorderThreshold) * 100)}%` }}
                          />
                        </div>
                        <span className="text-base font-medium text-[var(--text-primary)]">
                          {product.currentStock} <span className="text-[var(--text-muted)] text-base font-normal">{product.unit}</span>
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

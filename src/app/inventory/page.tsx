import { Package, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;
const BIZ = "biz_demo_001";

async function getProducts() {
  const { data } = await supabase.from("products").select("*, vendor:vendors(*)").eq("businessId", BIZ).eq("isActive", true).order("name");
  return data || [];
}

export default async function InventoryPage() {
  const products = await getProducts();

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[var(--text-primary)] tracking-tight">Inventory</h1>
          <p className="text-[13px] text-[var(--text-tertiary)] mt-1">{products.length} active products</p>
        </div>
        <button className="inline-flex items-center gap-2 h-9 px-4 rounded-[10px] text-[13px] font-medium bg-[var(--accent)] text-white hover:brightness-110 transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="card-surface overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-primary)]">
              {["Product", "SKU", "Vendor", "Stock", "Threshold", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[var(--text-quaternary)] uppercase tracking-wider first:rounded-tl-[var(--radius)] last:rounded-tr-[var(--radius)] last:text-center">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-primary)]">
            {products.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16 text-[13px] text-[var(--text-quaternary)]">
                <Package className="w-8 h-8 mx-auto mb-3 text-[var(--text-quaternary)]" strokeWidth={1.5} />
                No products found
              </td></tr>
            ) : products.map((p: any) => {
              const isLow = p.currentStock <= p.reorderThreshold;
              const isOut = p.currentStock === 0;
              return (
                <tr key={p.id} className="hover:bg-[var(--bg-hover)] transition-colors duration-150">
                  <td className="px-4 py-3.5 text-[13px] font-medium text-[var(--text-primary)]">{p.name}</td>
                  <td className="px-4 py-3.5 text-[13px] text-[var(--text-tertiary)] font-mono">{p.sku}</td>
                  <td className="px-4 py-3.5 text-[13px] text-[var(--text-secondary)]">{p.vendor?.name || "—"}</td>
                  <td className="px-4 py-3.5 text-[13px] font-semibold text-[var(--text-primary)]">{p.currentStock} {p.unit}</td>
                  <td className="px-4 py-3.5 text-[13px] text-[var(--text-tertiary)]">{p.reorderThreshold}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isOut ? "bg-[var(--red-subtle)] text-[var(--red)]"
                        : isLow ? "bg-[var(--orange-subtle)] text-[var(--orange)]"
                        : "bg-[var(--green-subtle)] text-[var(--green)]"
                    }`}>{isOut ? "Out" : isLow ? "Low" : "OK"}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

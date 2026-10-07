"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Loader2,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import AddProductButton from "./AddProductButton";

interface ProductItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  currentStock: number;
  reorderThreshold: number;
  reorderQuantity: number;
  costPrice: number;
  sellingPrice: number;
  vendor?: { id: string; name: string };
}

interface VendorOption {
  id: string;
  name: string;
}

interface InventoryManagerProps {
  initialProducts: ProductItem[];
  vendors: VendorOption[];
}

export function InventoryManager({
  initialProducts,
  vendors,
}: InventoryManagerProps) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "LOW" | "OUT" | "HEALTHY">("ALL");
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const categories = [
    "ALL",
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAdjustStock = async (product: ProductItem, delta: number) => {
    const newStock = Math.max(0, product.currentStock + delta);
    setAdjustingId(product.id);

    try {
      const res = await fetch("/api/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.name,
          quantity: delta,
          reason: delta > 0 ? "Manual stock receipt / restock" : "Manual usage / wastage adjustment",
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        showToast(data.error || "Adjustment failed");
      } else {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, currentStock: newStock } : p
          )
        );
        showToast(`Updated ${product.name} stock to ${newStock} ${product.unit}`);
        router.refresh();
      }
    } catch {
      showToast("Network error adjusting stock");
    } finally {
      setAdjustingId(null);
    }
  };

  const totalProducts = products.length;
  const outOfStock = products.filter((p) => p.currentStock === 0).length;
  const lowStock = products.filter(
    (p) => p.currentStock > 0 && p.currentStock <= p.reorderThreshold
  ).length;
  const healthyStock = totalProducts - outOfStock - lowStock;

  const filtered = products.filter((p) => {
    const matchesCat =
      selectedCategory === "ALL" || p.category === selectedCategory;

    const isOut = p.currentStock === 0;
    const isLow = p.currentStock > 0 && p.currentStock <= p.reorderThreshold;
    const isHealthy = p.currentStock > p.reorderThreshold;

    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "OUT"
        ? isOut
        : statusFilter === "LOW"
        ? isLow
        : isHealthy;

    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());

    return matchesCat && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--bg-elevated)] border border-[var(--border-secondary)] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-fade-in text-[13px] font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setStatusFilter("ALL")}
          className={`card-surface p-4 rounded-2xl cursor-pointer border transition-all ${
            statusFilter === "ALL" ? "border-[var(--accent)]" : "border-[var(--border-primary)]"
          }`}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
            Total Catalog
          </p>
          <p className="text-[22px] font-bold text-[var(--text-primary)] mt-0.5">
            {totalProducts}
          </p>
          <p className="text-[12px] text-[var(--text-secondary)]">Active inventory items</p>
        </div>

        <div
          onClick={() => setStatusFilter("HEALTHY")}
          className={`card-surface p-4 rounded-2xl cursor-pointer border transition-all ${
            statusFilter === "HEALTHY" ? "border-emerald-500" : "border-[var(--border-primary)]"
          }`}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Healthy Stock
          </p>
          <p className="text-[22px] font-bold text-emerald-400 mt-0.5">
            {healthyStock}
          </p>
          <p className="text-[12px] text-[var(--text-secondary)]">Above reorder limits</p>
        </div>

        <div
          onClick={() => setStatusFilter("LOW")}
          className={`card-surface p-4 rounded-2xl cursor-pointer border transition-all ${
            statusFilter === "LOW" ? "border-amber-500" : "border-[var(--border-primary)]"
          }`}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
            Low Stock Alerts
          </p>
          <p className="text-[22px] font-bold text-amber-400 mt-0.5">{lowStock}</p>
          <p className="text-[12px] text-[var(--text-secondary)]">Needs reordering</p>
        </div>

        <div
          onClick={() => setStatusFilter("OUT")}
          className={`card-surface p-4 rounded-2xl cursor-pointer border transition-all ${
            statusFilter === "OUT" ? "border-rose-500" : "border-[var(--border-primary)]"
          }`}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
            Out of Stock
          </p>
          <p className="text-[22px] font-bold text-rose-400 mt-0.5">{outOfStock}</p>
          <p className="text-[12px] text-rose-400 font-medium">Immediate stockout</p>
        </div>
      </div>

      {/* Control Bar: Category tabs + Search + Add Product */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-hover)]"
              }`}
            >
              {cat === "ALL" ? "All Categories" : cat}
            </button>
          ))}
        </div>

        {/* Search & Add button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or SKU..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <AddProductButton vendors={vendors} />
        </div>
      </div>

      {/* Product Catalog Table */}
      <div className="card-surface rounded-2xl overflow-hidden border border-[var(--border-primary)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-primary)]/80 bg-[var(--bg-tertiary)]/30 text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] font-bold">
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Margin (Cost / Sell)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-primary)]/40 text-[13px]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[var(--text-tertiary)]">
                    <Package className="w-8 h-8 mx-auto mb-2 text-[var(--text-quaternary)]" />
                    No products matching your search or filters.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => {
                  const isOut = prod.currentStock === 0;
                  const isLow = prod.currentStock > 0 && prod.currentStock <= prod.reorderThreshold;
                  const isUpdating = adjustingId === prod.id;

                  const statusBadge = isOut ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-950/60 text-rose-400 border border-rose-800/40">
                      <XCircle className="w-3 h-3" /> OUT OF STOCK
                    </span>
                  ) : isLow ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/60 text-amber-400 border border-amber-800/40">
                      <AlertTriangle className="w-3 h-3" /> LOW (≤ {prod.reorderThreshold})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      <CheckCircle2 className="w-3 h-3" /> HEALTHY
                    </span>
                  );

                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-[var(--bg-hover)] transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[var(--text-primary)]">
                          {prod.name}
                        </div>
                        <div className="text-[11px] text-[var(--text-tertiary)]">
                          Category: {prod.category}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[12px] text-cyan-300">
                        {prod.sku}
                      </td>

                      <td className="py-3.5 px-4 text-[var(--text-secondary)] text-[13px]">
                        {prod.vendor?.name || "—"}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-[var(--text-primary)]">
                          {prod.currentStock} {prod.unit}
                        </div>
                        <div className="text-[11px] text-[var(--text-tertiary)] font-mono">
                          Reorder at: {prod.reorderThreshold} {prod.unit}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[12px]">
                        <span className="text-[var(--text-tertiary)]">₹{prod.costPrice}</span>
                        <span className="mx-1 text-[var(--text-quaternary)]">/</span>
                        <span className="text-emerald-400 font-semibold">₹{prod.sellingPrice}</span>
                      </td>

                      <td className="py-3.5 px-4">{statusBadge}</td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleAdjustStock(prod, -1)}
                            disabled={isUpdating || prod.currentStock <= 0}
                            title="Decrement 1 unit"
                            className="w-7 h-7 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-white flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => handleAdjustStock(prod, 5)}
                            disabled={isUpdating}
                            title="Quick restock +5 units"
                            className="px-2 h-7 rounded-lg bg-[var(--accent-subtle)] hover:bg-[var(--accent)] border border-[var(--accent)]/40 text-[var(--accent)] hover:text-white flex items-center gap-1 font-mono text-[11px] font-bold transition-all disabled:opacity-30 cursor-pointer"
                          >
                            {isUpdating ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <Plus className="w-3 h-3" />
                                <span>5</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleAdjustStock(prod, prod.reorderQuantity || 10)}
                            disabled={isUpdating}
                            title={`Restock full reorder batch (+${prod.reorderQuantity || 10})`}
                            className="px-2 h-7 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 font-mono text-[11px] font-bold transition-all disabled:opacity-30 cursor-pointer"
                          >
                            +{prod.reorderQuantity || 10}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

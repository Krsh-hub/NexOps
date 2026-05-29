"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { X, Loader2, Package } from "lucide-react";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  vendors: Array<{ id: string; name: string }>;
}

const CATEGORIES = ["Coffee", "Dairy", "Bakery", "Ingredients", "Packaging"];
const UNITS = ["kg", "L", "units", "bottles"];

export default function AddProductModal({ open, onClose, vendors }: AddProductModalProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [reorderThreshold, setReorderThreshold] = useState("");
  const [reorderQuantity, setReorderQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [vendorId, setVendorId] = useState("");

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const resetForm = useCallback(() => {
    setName("");
    setSku("");
    setCategory("");
    setCurrentStock("");
    setReorderThreshold("");
    setReorderQuantity("");
    setUnit("");
    setCostPrice("");
    setSellingPrice("");
    setVendorId("");
    setErrors({});
  }, []);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Product name is required";
    if (!sku.trim()) newErrors.sku = "SKU is required";
    if (!category) newErrors.category = "Category is required";
    if (!unit) newErrors.unit = "Unit is required";
    if (currentStock === "" || Number(currentStock) < 0) newErrors.currentStock = "Valid stock quantity required";
    if (reorderThreshold === "" || Number(reorderThreshold) < 0) newErrors.reorderThreshold = "Valid threshold required";
    if (reorderQuantity === "" || Number(reorderQuantity) <= 0) newErrors.reorderQuantity = "Valid reorder quantity required";
    if (costPrice === "" || Number(costPrice) < 0) newErrors.costPrice = "Valid cost price required";
    if (sellingPrice === "" || Number(sellingPrice) < 0) newErrors.sellingPrice = "Valid selling price required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          sku: sku.trim(),
          category,
          currentStock: Number(currentStock),
          reorderThreshold: Number(reorderThreshold),
          reorderQuantity: Number(reorderQuantity),
          unit,
          costPrice: Number(costPrice),
          sellingPrice: Number(sellingPrice),
          vendorId: vendorId || null,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Failed to create product");
      }

      router.refresh();
      resetForm();
      onClose();
    } catch (err: any) {
      setErrors({ _form: err.message || "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  const inputClass =
    "w-full h-10 px-3 rounded-[8px] text-[14px] bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-quaternary)] outline-none transition-colors duration-150 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]";
  const labelClass = "block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5";
  const selectClass = `${inputClass} appearance-none cursor-pointer`;

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ animation: "fadeInOverlay 0.2s ease-out forwards" }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-[560px] max-h-[90vh] overflow-y-auto scrollbar-hide"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-primary)",
          borderRadius: "var(--radius)",
          boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.5)",
          animation: "scaleInModal 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--border-primary)]">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center"
              style={{ background: "var(--accent-subtle)" }}
            >
              <Package className="w-[18px] h-[18px]" style={{ color: "var(--accent)" }} />
            </div>
            <h2 className="text-[17px] font-semibold text-[var(--text-primary)] tracking-tight">
              Add Product
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {errors._form && (
            <div className="px-3 py-2.5 rounded-[8px] text-[13px] font-medium" style={{ background: "var(--red-subtle)", color: "var(--red)" }}>
              {errors._form}
            </div>
          )}

          {/* Name */}
          <div>
            <label className={labelClass}>Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Artisanal Espresso Blend"
              className={inputClass}
            />
            {errors.name && <p className="mt-1 text-[12px]" style={{ color: "var(--red)" }}>{errors.name}</p>}
          </div>

          {/* SKU + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>SKU</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. COF-ESP-01"
                className={inputClass}
              />
              {errors.sku && <p className="mt-1 text-[12px]" style={{ color: "var(--red)" }}>{errors.sku}</p>}
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-[12px]" style={{ color: "var(--red)" }}>{errors.category}</p>}
            </div>
          </div>

          {/* Stock fields — 2 column grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Current Stock</label>
              <input
                type="number"
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value)}
                placeholder="0"
                min="0"
                step="any"
                className={inputClass}
              />
              {errors.currentStock && <p className="mt-1 text-[12px]" style={{ color: "var(--red)" }}>{errors.currentStock}</p>}
            </div>
            <div>
              <label className={labelClass}>Reorder Threshold</label>
              <input
                type="number"
                value={reorderThreshold}
                onChange={(e) => setReorderThreshold(e.target.value)}
                placeholder="0"
                min="0"
                step="any"
                className={inputClass}
              />
              {errors.reorderThreshold && <p className="mt-1 text-[12px]" style={{ color: "var(--red)" }}>{errors.reorderThreshold}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Reorder Quantity</label>
              <input
                type="number"
                value={reorderQuantity}
                onChange={(e) => setReorderQuantity(e.target.value)}
                placeholder="0"
                min="1"
                step="any"
                className={inputClass}
              />
              {errors.reorderQuantity && <p className="mt-1 text-[12px]" style={{ color: "var(--red)" }}>{errors.reorderQuantity}</p>}
            </div>
            <div>
              <label className={labelClass}>Unit</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className={selectClass}>
                <option value="">Select unit</option>
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              {errors.unit && <p className="mt-1 text-[12px]" style={{ color: "var(--red)" }}>{errors.unit}</p>}
            </div>
          </div>

          {/* Price fields — 2 column grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Cost Price (₹)</label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="any"
                className={inputClass}
              />
              {errors.costPrice && <p className="mt-1 text-[12px]" style={{ color: "var(--red)" }}>{errors.costPrice}</p>}
            </div>
            <div>
              <label className={labelClass}>Selling Price (₹)</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="any"
                className={inputClass}
              />
              {errors.sellingPrice && <p className="mt-1 text-[12px]" style={{ color: "var(--red)" }}>{errors.sellingPrice}</p>}
            </div>
          </div>

          {/* Vendor */}
          <div>
            <label className={labelClass}>Vendor <span className="text-[var(--text-quaternary)] font-normal">(optional)</span></label>
            <select value={vendorId} onChange={(e) => setVendorId(e.target.value)} className={selectClass}>
              <option value="">No vendor</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 pb-1">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="h-9 px-4 rounded-[10px] text-[14px] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 h-9 px-5 rounded-[10px] text-[14px] font-medium bg-[var(--accent)] text-white hover:brightness-110 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding…
                </>
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleInModal {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );

  return createPortal(modal, document.body);
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Plus,
  Trash2,
  FileText,
  Loader2,
  CheckCircle2,
  DollarSign,
} from "lucide-react";

interface ProductOption {
  id: string;
  name: string;
  sellingPrice: number;
  unit: string;
}

interface AddInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  products: ProductOption[];
}

interface LineItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export function AddInvoiceModal({ open, onClose, products }: AddInvoiceModalProps) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [dueInDays, setDueInDays] = useState("7");
  const [items, setItems] = useState<LineItem[]>([
    { productName: products[0]?.name || "Gourmet Cold Brew", quantity: 2, unitPrice: products[0]?.sellingPrice || 240 },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      if (items.length === 0 && products.length > 0) {
        setItems([{ productName: products[0].name, quantity: 1, unitPrice: products[0].sellingPrice }]);
      }
    }
  }, [open, products]);

  if (!open) return null;

  const handleProductChange = (index: number, selectedName: string) => {
    const prod = products.find((p) => p.name === selectedName);
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      productName: selectedName,
      unitPrice: prod?.sellingPrice || updated[index].unitPrice,
    };
    setItems(updated);
  };

  const handleQuantityChange = (index: number, qty: number) => {
    const updated = [...items];
    updated[index].quantity = Math.max(1, qty);
    setItems(updated);
  };

  const addItemRow = () => {
    const firstProd = products[0];
    setItems([
      ...items,
      {
        productName: firstProd?.name || "Espresso",
        quantity: 1,
        unitPrice: firstProd?.sellingPrice || 120,
      },
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError("Please specify a customer name");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formattedItems = items.map((i) => ({
        productName: i.productName,
        quantity: i.quantity,
      }));

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          items: formattedItems,
          dueInDays: parseInt(dueInDays),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create invoice");
      }

      router.refresh();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[560px] rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-primary)]/80 bg-[var(--bg-tertiary)]/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[var(--text-primary)]">
                Create New Invoice
              </h3>
              <p className="text-[12px] text-[var(--text-tertiary)]">
                Auto-generates invoice number, calculates tax, and updates inventory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-tertiary)] hover:text-white hover:bg-[var(--bg-hover)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800/50 text-rose-300 text-[13px]">
              {error}
            </div>
          )}

          {/* Customer & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5">
                Customer / Client Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Green Meadow Bistro"
                className="w-full h-10 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5">
                Payment Due In
              </label>
              <select
                value={dueInDays}
                onChange={(e) => setDueInDays(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="0">Due on receipt (Today)</option>
                <option value="7">7 Days</option>
                <option value="15">15 Days</option>
                <option value="30">30 Days</option>
              </select>
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
              <span>Invoice Items</span>
              <button
                type="button"
                onClick={addItemRow}
                className="text-[var(--accent)] hover:underline flex items-center gap-1 font-semibold normal-case text-[12px] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--border-primary)] flex items-center gap-2 text-[13px]"
                >
                  {/* Product picker */}
                  <div className="flex-1 min-w-0">
                    <select
                      value={item.productName}
                      onChange={(e) => handleProductChange(idx, e.target.value)}
                      className="w-full h-8 px-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[13px] text-[var(--text-primary)] focus:outline-none"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} (₹{p.sellingPrice}/{p.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="w-20">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(idx, parseInt(e.target.value) || 1)}
                      className="w-full h-8 px-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] text-center text-[13px] text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>

                  {/* Line Total */}
                  <div className="w-24 text-right font-mono font-semibold text-emerald-400 text-[13px]">
                    ₹{(item.quantity * item.unitPrice).toLocaleString("en-IN")}
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeItemRow(idx)}
                    disabled={items.length <= 1}
                    className="p-1 rounded text-[var(--text-quaternary)] hover:text-rose-400 disabled:opacity-20 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="p-3 rounded-xl bg-[var(--bg-primary)]/70 border border-[var(--border-primary)] space-y-1.5 text-[13px] font-mono">
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>Subtotal:</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>Tax (GST 18%):</span>
              <span>₹{tax.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between font-bold text-white text-[15px] pt-1.5 border-t border-[var(--border-primary)]">
              <span>Total Payable:</span>
              <span className="text-emerald-400">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[13px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[13px] font-semibold shadow-md shadow-[var(--accent)]/20 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Invoice...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Generate Invoice
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

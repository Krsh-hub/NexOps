"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Bell,
  Check,
  Loader2,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { AddInvoiceModal } from "./AddInvoiceModal";

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  customerName?: string;
  customerId?: string;
  customer?: { name: string };
  total: number;
  subtotal: number;
  tax: number;
  status: "PAID" | "OVERDUE" | "PENDING" | "SENT" | "DRAFT" | "CANCELLED";
  dueDate: string;
  paidAt?: string | null;
  createdAt: string;
}

interface ProductData {
  id: string;
  name: string;
  sellingPrice: number;
  unit: string;
}

interface InvoicesManagerProps {
  initialInvoices: InvoiceData[];
  products: ProductData[];
}

export function InvoicesManager({
  initialInvoices,
  products,
}: InvoicesManagerProps) {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceData[]>(initialInvoices);
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMarkPaid = async (invoiceId: string) => {
    setUpdatingId(invoiceId);
    try {
      const res = await fetch("/api/invoices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: invoiceId, status: "PAID" }),
      });
      if (res.ok) {
        setInvoices((prev) =>
          prev.map((i) =>
            i.id === invoiceId
              ? { ...i, status: "PAID", paidAt: new Date().toISOString() }
              : i
          )
        );
        showToast("Invoice marked as PAID. Revenue updated.");
        router.refresh();
      } else {
        showToast("Failed to update status.");
      }
    } catch {
      showToast("Network error updating invoice.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSendReminder = async (inv: InvoiceData) => {
    setUpdatingId(inv.id);
    const clientName = inv.customer?.name || inv.customerName || "Client";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Send an urgent payment reminder for invoice ${inv.invoiceNumber} to ${clientName}. Total due is ₹${inv.total}.`,
          history: [],
        }),
      });
      const data = await res.json();
      showToast(
        data.message
          ? `Reminder sent to ${clientName}!`
          : "Payment reminder dispatched."
      );
    } catch {
      showToast("Failed to dispatch payment reminder.");
    } finally {
      setUpdatingId(null);
    }
  };

  const paidInvoices = invoices.filter((i) => i.status === "PAID");
  const overdueInvoices = invoices.filter((i) => i.status === "OVERDUE");
  const pendingInvoices = invoices.filter((i) =>
    ["PENDING", "SENT"].includes(i.status)
  );

  const totalRevenue = paidInvoices.reduce((s, i) => s + (i.total || 0), 0);
  const totalOverdue = overdueInvoices.reduce((s, i) => s + (i.total || 0), 0);
  const totalPending = pendingInvoices.reduce((s, i) => s + (i.total || 0), 0);

  const filtered = invoices.filter((i) => {
    const matchesFilter =
      filter === "ALL"
        ? true
        : filter === "PENDING"
        ? ["PENDING", "SENT"].includes(i.status)
        : i.status === filter;

    const name = (i.customer?.name || i.customerName || "").toLowerCase();
    const invNum = (i.invoiceNumber || "").toLowerCase();
    const matchesSearch =
      name.includes(search.toLowerCase()) ||
      invNum.includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--bg-elevated)] border border-[var(--border-secondary)] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-fade-in text-[13px] font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-surface p-4 sm:p-5 flex items-center gap-4 rounded-2xl border-b-2 border-b-emerald-500">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
              Collected Revenue
            </p>
            <p className="text-[20px] font-bold text-[var(--text-primary)] tracking-tight">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
            <p className="text-[12px] text-emerald-400 font-medium">
              {paidInvoices.length} paid invoices
            </p>
          </div>
        </div>

        <div className="card-surface p-4 sm:p-5 flex items-center gap-4 rounded-2xl border-b-2 border-b-rose-500">
          <div className="w-10 h-10 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/40 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
              Overdue Receivables
            </p>
            <p className="text-[20px] font-bold text-rose-400 tracking-tight">
              ₹{totalOverdue.toLocaleString("en-IN")}
            </p>
            <p className="text-[12px] text-rose-400 font-medium">
              {overdueInvoices.length} overdue accounts
            </p>
          </div>
        </div>

        <div className="card-surface p-4 sm:p-5 flex items-center gap-4 rounded-2xl border-b-2 border-b-amber-500">
          <div className="w-10 h-10 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
              Pending / Sent
            </p>
            <p className="text-[20px] font-bold text-amber-400 tracking-tight">
              ₹{totalPending.toLocaleString("en-IN")}
            </p>
            <p className="text-[12px] text-amber-400 font-medium">
              {pendingInvoices.length} pending settlement
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters + Search + Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl overflow-x-auto scrollbar-hide">
          {[
            { id: "ALL", label: "All Invoices", count: invoices.length },
            { id: "PAID", label: "Paid", count: paidInvoices.length },
            { id: "OVERDUE", label: "Overdue", count: overdueInvoices.length },
            { id: "PENDING", label: "Pending", count: pendingInvoices.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                filter === tab.id
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-hover)]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filter === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Action */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by client or invoice #..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="h-9 px-3.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[13px] font-semibold flex items-center gap-1.5 shadow-md shadow-[var(--accent)]/20 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoices Ledger Table */}
      <div className="card-surface rounded-2xl overflow-hidden border border-[var(--border-primary)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-primary)]/80 bg-[var(--bg-tertiary)]/30 text-[11px] uppercase tracking-wider text-[var(--text-tertiary)] font-bold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-primary)]/40 text-[13px]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[var(--text-tertiary)]">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-[var(--text-quaternary)]" />
                    No invoices matching the current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => {
                  const client = inv.customer?.name || inv.customerName || "Customer";
                  const isPaid = inv.status === "PAID";
                  const isOverdue = inv.status === "OVERDUE";
                  const isPending = ["PENDING", "SENT"].includes(inv.status);
                  const isUpdating = updatingId === inv.id;

                  const statusPill = isPaid ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      <CheckCircle2 className="w-3 h-3" /> PAID
                    </span>
                  ) : isOverdue ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-950/60 text-rose-400 border border-rose-800/40 animate-pulse">
                      <AlertCircle className="w-3 h-3" /> OVERDUE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/60 text-amber-400 border border-amber-800/40">
                      <Clock className="w-3 h-3" /> {inv.status}
                    </span>
                  );

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-[var(--bg-hover)] transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono font-semibold text-indigo-300">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[var(--text-primary)]">
                        {client}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[var(--text-primary)]">
                        ₹{inv.total.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4">{statusPill}</td>
                      <td className="py-3.5 px-4 text-[var(--text-secondary)] font-mono text-[12px]">
                        {inv.dueDate
                          ? new Date(inv.dueDate).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isPaid && (
                            <button
                              onClick={() => handleMarkPaid(inv.id)}
                              disabled={isUpdating}
                              title="Mark invoice as paid"
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-950/50 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/50 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              {isUpdating ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                              <span>Mark Paid</span>
                            </button>
                          )}

                          {isOverdue && (
                            <button
                              onClick={() => handleSendReminder(inv)}
                              disabled={isUpdating}
                              title="Dispatch autonomous payment reminder"
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-950/50 hover:bg-rose-900/80 text-rose-300 border border-rose-800/50 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              <Bell className="w-3 h-3" />
                              <span>Remind</span>
                            </button>
                          )}
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

      {/* Modal */}
      <AddInvoiceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        products={products}
      />
    </div>
  );
}

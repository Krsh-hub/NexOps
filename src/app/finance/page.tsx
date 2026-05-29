import { TrendingUp, AlertCircle, FileText, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;
const BIZ = "biz_demo_001";

async function getFinance() {
  const { data: inv } = await supabase.from("invoices").select("*").eq("businessId", BIZ);
  const all = inv || [];
  const paid = all.filter((i: any) => i.status === "PAID");
  const overdue = all.filter((i: any) => i.status === "OVERDUE");
  const pending = all.filter((i: any) => ["PENDING", "SENT"].includes(i.status));
  return {
    all, totalRevenue: paid.reduce((s: number, i: any) => s + i.total, 0),
    totalOverdue: overdue.reduce((s: number, i: any) => s + i.total, 0), overdueCount: overdue.length,
    totalPending: pending.reduce((s: number, i: any) => s + i.total, 0), pendingCount: pending.length,
  };
}

export default async function FinancePage() {
  const d = await getFinance();
  const stats = [
    { label: "Revenue", value: `₹${d.totalRevenue.toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-[var(--green)]", bg: "bg-[var(--green-subtle)]" },
    { label: "Overdue", value: `₹${d.totalOverdue.toLocaleString("en-IN")}`, sub: `${d.overdueCount} invoices`, icon: AlertCircle, color: "text-[var(--red)]", bg: "bg-[var(--red-subtle)]" },
    { label: "Pending", value: `₹${d.totalPending.toLocaleString("en-IN")}`, sub: `${d.pendingCount} invoices`, icon: Clock, color: "text-[var(--orange)]", bg: "bg-[var(--orange-subtle)]" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-[22px] font-semibold text-[var(--text-primary)] tracking-tight">Finance</h1>
        <p className="text-[15px] text-[var(--text-tertiary)] mt-1">Revenue, invoices & payment tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="card-surface p-4 flex items-center gap-4">
            <div className={`w-9 h-9 rounded-lg ${s.bg} ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-[var(--text-quaternary)] uppercase tracking-wider">{s.label}</p>
              <p className="text-[18px] font-semibold text-[var(--text-primary)] tracking-tight mt-0.5">{s.value}</p>
              {s.sub && <p className="text-[15px] text-[var(--text-quaternary)]">{s.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="card-surface overflow-hidden">
        <div className="px-4 py-3.5 border-b border-[var(--border-primary)] flex items-center gap-2">
          <FileText className="w-4 h-4 text-[var(--text-quaternary)]" strokeWidth={1.8} />
          <span className="text-[15px] font-semibold text-[var(--text-primary)]">Invoices</span>
          <span className="ml-auto text-[15px] text-[var(--text-quaternary)] font-medium">{d.all.length}</span>
        </div>
        <table className="w-full">
          <thead><tr className="border-b border-[var(--border-primary)]">
            {["Invoice", "Customer", "Amount", "Status", "Due"].map(h => (
              <th key={h} className="text-left px-4 py-3 text-[15px] font-semibold text-[var(--text-quaternary)] uppercase tracking-wider last:text-right">{h}</th>
            ))}
          </tr></thead>
          <tbody className="divide-y divide-[var(--border-primary)]">
            {d.all.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-16 text-[15px] text-[var(--text-quaternary)]">No invoices</td></tr>
            ) : d.all.slice(0, 15).map((inv: any) => {
              const sc: Record<string, string> = {
                PAID: "bg-[var(--green-subtle)] text-[var(--green)]",
                OVERDUE: "bg-[var(--red-subtle)] text-[var(--red)]",
                PENDING: "bg-[var(--orange-subtle)] text-[var(--orange)]",
                SENT: "bg-[var(--accent-subtle)] text-[var(--accent)]",
                DRAFT: "bg-[var(--bg-hover)] text-[var(--text-quaternary)]",
              };
              return (
                <tr key={inv.id} className="hover:bg-[var(--bg-hover)] transition-colors duration-150">
                  <td className="px-4 py-3.5 text-[15px] font-mono text-[var(--text-primary)]">{inv.invoiceNumber || inv.id?.slice(0, 8)}</td>
                  <td className="px-4 py-3.5 text-[15px] text-[var(--text-secondary)]">{inv.customerName || "—"}</td>
                  <td className="px-4 py-3.5 text-[15px] font-semibold text-[var(--text-primary)]">₹{inv.total?.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3.5"><span className={`text-[16px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${sc[inv.status] || sc.DRAFT}`}>{inv.status}</span></td>
                  <td className="px-4 py-3.5 text-[15px] text-right text-[var(--text-tertiary)]">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-IN") : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

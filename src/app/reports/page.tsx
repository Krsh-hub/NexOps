import { FileText, Download, BarChart3, Package, Bot, CircleDollarSign } from "lucide-react";

const reports = [
  { name: "Daily Operations Summary", desc: "Auto-generated overview of inventory, finance, and AI activity.", freq: "Daily", icon: BarChart3, type: "Operational" },
  { name: "Inventory Health Report", desc: "Stock levels, reorder status, and vendor performance.", freq: "Weekly", icon: Package, type: "Inventory" },
  { name: "Revenue & Collections", desc: "Invoice payments, overdue tracking, and cash flow.", freq: "Monthly", icon: CircleDollarSign, type: "Finance" },
  { name: "AI Agent Performance", desc: "Actions taken, success rates, and anomaly detection.", freq: "Weekly", icon: Bot, type: "AI" },
];

export default function ReportsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-[22px] font-semibold text-[var(--text-primary)] tracking-tight">Reports</h1>
        <p className="text-[13px] text-[var(--text-tertiary)] mt-1">Auto-generated operational reports</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {reports.map((r) => (
          <div key={r.name} className="card-elevated p-5 flex items-start gap-4 group">
            <div className="w-9 h-9 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shrink-0">
              <r.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">{r.name}</h3>
              <p className="text-[12px] text-[var(--text-tertiary)] mt-1">{r.desc}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-quaternary)] bg-[var(--bg-hover)] px-1.5 py-0.5 rounded-md">{r.type}</span>
                <span className="text-[10px] text-[var(--text-quaternary)]">{r.freq}</span>
              </div>
            </div>
            <button className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[var(--text-quaternary)] opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-active)] hover:text-[var(--text-secondary)] transition-all shrink-0">
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

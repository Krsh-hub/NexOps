"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  BarChart3,
  Package,
  Bot,
  CircleDollarSign,
  Printer,
  Sparkles,
  X,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";

interface ReportItem {
  id: string;
  name: string;
  desc: string;
  freq: string;
  icon: any;
  type: string;
  color: string;
  metrics: { label: string; value: string }[];
}

const REPORT_DEFINITIONS: ReportItem[] = [
  {
    id: "daily-ops",
    name: "Daily Operations Summary",
    desc: "Autonomous compilation of stock movements, daily sales volume, and system alerts.",
    freq: "Daily",
    icon: BarChart3,
    type: "Operational",
    color: "text-blue-400 bg-blue-950/60 border-blue-800/50",
    metrics: [
      { label: "Today's Revenue", value: "₹14,200" },
      { label: "Transactions Processed", value: "18" },
      { label: "Inventory Alerts Flagged", value: "2 critical" },
    ],
  },
  {
    id: "inventory-health",
    name: "Inventory Health & Stockout Audit",
    desc: "Stock valuations, turnover rates, items below reorder threshold, and supplier lead times.",
    freq: "Weekly",
    icon: Package,
    type: "Inventory",
    color: "text-amber-400 bg-amber-950/60 border-amber-800/50",
    metrics: [
      { label: "Active SKUs", value: "10 items" },
      { label: "Stockout Items", value: "1 item (Avocado Mix)" },
      { label: "Reorder Deficit", value: "₹4,850" },
    ],
  },
  {
    id: "finance-collections",
    name: "Revenue & Collections Ledger",
    desc: "Comprehensive receivables analysis, overdue debtor aging, and payment velocity.",
    freq: "Monthly",
    icon: CircleDollarSign,
    type: "Finance",
    color: "text-emerald-400 bg-emerald-950/60 border-emerald-800/50",
    metrics: [
      { label: "Paid Volume", value: "₹26,650" },
      { label: "Overdue Receivables", value: "₹16,300" },
      { label: "Recovery Rate", value: "62%" },
    ],
  },
  {
    id: "ai-performance",
    name: "AI Autonomous Agent Log & Audit",
    desc: "Actions taken, autonomous tool calls, proactive trigger accuracy, and system logs.",
    freq: "Weekly",
    icon: Bot,
    type: "AI Performance",
    color: "text-purple-400 bg-purple-950/60 border-purple-800/50",
    metrics: [
      { label: "Autonomous Workflows Run", value: "48 tasks" },
      { label: "Average Execution Time", value: "420ms" },
      { label: "Success Rate", value: "98.2%" },
    ],
  },
];

function downloadReportAsCSV(report: ReportItem, onSuccess: (name: string) => void) {
  let csvContent = `data:text/csv;charset=utf-8,`;
  csvContent += `Report Name,${report.name}\n`;
  csvContent += `Generated At,${new Date().toISOString()}\n`;
  csvContent += `Business,Brew & Bite Café (NexOps)\n\n`;
  csvContent += `Metric,Value\n`;

  report.metrics.forEach((m) => {
    csvContent += `"${m.label}","${m.value}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${report.id}-report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  onSuccess(report.name);
}

export function ReportsManager() {
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const exportCSV = (report: ReportItem) => {
    downloadReportAsCSV(report, (name) => {
      setDownloadSuccess(name);
      setTimeout(() => setDownloadSuccess(null), 3000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--bg-elevated)] border border-[var(--border-secondary)] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-fade-in text-[13px] font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Exported {downloadSuccess} to CSV successfully.</span>
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORT_DEFINITIONS.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.id}
              className="card-surface p-5 rounded-2xl border border-[var(--border-primary)] flex flex-col justify-between hover:border-[var(--border-hover)] transition-all group shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${r.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-[var(--text-primary)] group-hover:text-white transition-colors">
                        {r.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.2 rounded bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] border border-[var(--border-primary)]">
                          {r.type}
                        </span>
                        <span className="text-[12px] text-[var(--text-quaternary)]">
                          {r.freq}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => exportCSV(r)}
                    title="Export CSV"
                    className="p-2 rounded-xl text-[var(--text-tertiary)] hover:text-white hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-primary)] transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  {r.desc}
                </p>

                {/* Key Metrics Quick Preview */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border-primary)]/50">
                  {r.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-[var(--bg-tertiary)]/50 border border-[var(--border-primary)]/50"
                    >
                      <div className="text-[10px] text-[var(--text-tertiary)] truncate font-semibold uppercase">
                        {m.label}
                      </div>
                      <div className="text-[13px] font-mono font-bold text-[var(--text-primary)] mt-0.5 truncate">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* View & Analyze Button */}
              <div className="pt-4 mt-3 flex items-center justify-between border-t border-[var(--border-primary)]/40 text-[12px]">
                <button
                  onClick={() => setSelectedReport(r)}
                  className="text-[var(--accent)] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  Inspect Full Report <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => exportCSV(r)}
                  className="text-[var(--text-tertiary)] hover:text-white flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Download className="w-3.5 h-3.5" /> CSV
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <div
          onClick={() => setSelectedReport(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[600px] rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-[var(--border-primary)]/80 bg-[var(--bg-tertiary)]/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${selectedReport.color}`}
                >
                  <selectedReport.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-[var(--text-primary)]">
                    {selectedReport.name}
                  </h3>
                  <p className="text-[12px] text-[var(--text-tertiary)]">
                    Generated for Brew & Bite Café · {selectedReport.freq} Audit
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-[var(--text-tertiary)] hover:text-white hover:bg-[var(--bg-hover)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="p-3.5 rounded-xl bg-[var(--bg-tertiary)]/70 border border-[var(--border-primary)] text-[13px] text-[var(--text-secondary)] leading-relaxed">
                {selectedReport.desc}
              </div>

              <div>
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                  Executive KPI Metrics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {selectedReport.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)]"
                    >
                      <div className="text-[11px] text-[var(--text-tertiary)] uppercase font-semibold">
                        {m.label}
                      </div>
                      <div className="text-[16px] font-bold font-mono text-[var(--text-primary)] mt-1">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] space-y-2">
                <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--accent)] uppercase font-mono">
                  <Sparkles className="w-3.5 h-3.5" /> AI Operational Advice
                </div>
                <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                  Based on current numbers, restocking Avocado Toast Mix immediately will prevent weekend sales friction.
                  Issue automated payment reminders to Greenwood Cafe to collect overdue ₹6,500.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-primary)]/50">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] text-[13px] font-semibold text-[var(--text-secondary)] hover:text-white border border-[var(--border-primary)] flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Printer className="w-4 h-4" /> Print Report
                </button>

                <button
                  onClick={() => exportCSV(selectedReport)}
                  className="px-4 py-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[13px] font-semibold text-white shadow-md shadow-[var(--accent)]/20 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4" /> Download CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

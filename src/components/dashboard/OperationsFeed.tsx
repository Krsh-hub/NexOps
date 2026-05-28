import { Activity, FileText, Package, AlertTriangle, Zap, Clock } from "lucide-react";

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
}

export function OperationsFeed({ activities }: { activities: ActivityItem[] }) {
  const getIcon = (type: string) => {
    if (type.includes("INVOICE")) return FileText;
    if (type.includes("INVENTORY")) return Package;
    if (type.includes("ALERT") || type.includes("WARNING")) return AlertTriangle;
    if (type.includes("PROACTIVE")) return Zap;
    return Activity;
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED": return "text-[var(--green)] bg-[var(--green-subtle)]";
      case "FAILED": return "text-[var(--red)] bg-[var(--red-subtle)]";
      case "PENDING": return "text-[var(--orange)] bg-[var(--orange-subtle)]";
      default: return "text-[var(--accent)] bg-[var(--accent-subtle)]";
    }
  };

  return (
    <div className="card-surface flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="px-4 py-3.5 flex items-center justify-between border-b border-[var(--border-primary)]/50 bg-[var(--bg-secondary)]/30">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[var(--border-primary)] border border-[var(--border-secondary)]/25 text-[var(--text-secondary)] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <Clock className="w-3.5 h-3.5" strokeWidth={2.2} />
          </div>
          <span className="text-[12px] font-bold text-[var(--text-primary)] tracking-wide uppercase">Operational Feed</span>
        </div>
        <span className="text-[10px] font-bold text-[var(--text-tertiary)] bg-[var(--border-primary)] border border-[var(--border-secondary)]/25 px-1.5 py-0.5 rounded-md">
          {activities.length} logs
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide divide-y divide-[var(--border-primary)]/45">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-[var(--text-tertiary)]">
            <Activity className="w-8 h-8 mb-2 text-[var(--text-quaternary)]" strokeWidth={1.5} />
            <p className="text-[12px] font-semibold">No operational updates</p>
          </div>
        ) : (
          activities.map((a) => {
            const Icon = getIcon(a.type);
            return (
              <div key={a.id} className="px-4 py-3 hover:bg-[var(--bg-hover)] transition-all duration-150">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[var(--bg-primary)]/60 border border-[var(--border-primary)]/40 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Icon className="w-3.5 h-3.5 text-[var(--text-secondary)] animate-fade-in" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-[12.5px] font-semibold text-[var(--text-primary)] truncate">{a.title}</h4>
                      <span className="text-[10px] text-[var(--text-tertiary)] font-bold font-mono">
                        {new Date(a.createdAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "numeric", hour12: true })}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-[var(--text-secondary)] line-clamp-2 mt-0.5 leading-relaxed">{a.description}</p>
                    <span className={`inline-block mt-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${getStatusStyle(a.status)}`}>
                      {a.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

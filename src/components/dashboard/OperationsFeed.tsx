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
    <div className="card-surface flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3.5 flex items-center gap-2 border-b border-[var(--border-primary)]">
        <Clock className="w-4 h-4 text-[var(--text-quaternary)]" strokeWidth={1.8} />
        <span className="text-[13px] font-semibold text-[var(--text-primary)]">Activity</span>
        <span className="ml-auto text-[11px] text-[var(--text-quaternary)] font-medium">{activities.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {activities.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[13px] text-[var(--text-quaternary)]">No recent activity</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-primary)]">
            {activities.map((a) => {
              const Icon = getIcon(a.type);
              return (
                <div key={a.id} className="px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors duration-150">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[var(--bg-hover)] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-[var(--text-tertiary)]" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-[13px] font-medium text-[var(--text-primary)] truncate">{a.title}</h4>
                        <span className="text-[10px] text-[var(--text-quaternary)] font-mono whitespace-nowrap">
                          {new Date(a.createdAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "numeric", hour12: true })}
                        </span>
                      </div>
                      <p className="text-[12px] text-[var(--text-tertiary)] line-clamp-1 mt-0.5">{a.description}</p>
                      <span className={`inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${getStatusStyle(a.status)}`}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

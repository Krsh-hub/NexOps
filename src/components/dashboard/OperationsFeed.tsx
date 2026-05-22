import { Activity, FileText, Package, AlertTriangle, Zap, CheckCircle2 } from "lucide-react";

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
    if (type.includes("INVOICE")) return <FileText size={16} />;
    if (type.includes("INVENTORY")) return <Package size={16} />;
    if (type.includes("ALERT") || type.includes("WARNING")) return <AlertTriangle size={16} />;
    if (type.includes("PROACTIVE")) return <Zap size={16} className="text-[var(--accent-primary)]" />;
    return <Activity size={16} />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "text-[var(--success)]";
      case "FAILED": return "text-[var(--danger)]";
      case "PENDING": return "text-[var(--warning)]";
      default: return "text-[var(--accent-primary)]";
    }
  };

  return (
    <div className="card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold flex items-center gap-2 text-[var(--text-primary)]">
          <Activity className="w-5 h-5 text-[var(--text-secondary)]" />
          Live Operations Feed
        </h2>
        <span className="badge badge-neutral flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span>
          Live
        </span>
      </div>

      <div className="relative flex-1 overflow-y-auto pr-2">
        <div className="timeline-line"></div>
        
        <div className="space-y-6">
          {activities.length === 0 ? (
            <p className="text-[var(--text-muted)] text-sm text-center py-4">No recent activities.</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="relative pl-10 animate-fade-in group">
                {/* Timeline Dot */}
                <div className="absolute left-[8px] top-[4px] w-[9px] h-[9px] rounded-full bg-[var(--bg-base)] border-[2px] border-[var(--border-default)] group-hover:border-[var(--accent-primary)] transition-colors z-10"></div>
                
                <div className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg p-4 hover:border-[var(--border-default)] transition-colors shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--text-muted)]">{getIcon(activity.type)}</span>
                      <h4 className="text-sm font-medium text-[var(--text-primary)]">{activity.title}</h4>
                    </div>
                    <span className="text-xs text-[var(--text-muted)] whitespace-nowrap ml-2">
                      {new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(activity.createdAt))}
                    </span>
                  </div>
                  
                  <p className="text-sm text-[var(--text-secondary)] mt-1.5 line-clamp-2 leading-relaxed">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-3">
                    <div className={`flex items-center gap-1.5 text-[11px] uppercase tracking-wide font-semibold ${getStatusColor(activity.status)}`}>
                      {activity.status === "COMPLETED" && <CheckCircle2 size={12} />}
                      {activity.status}
                    </div>
                    <span className="w-1 h-1 rounded-full bg-[var(--border-default)]"></span>
                    <span className="text-[11px] uppercase tracking-wide font-medium text-[var(--text-muted)]">
                      {activity.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

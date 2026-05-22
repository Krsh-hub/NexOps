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
    if (type.includes("PROACTIVE")) return <Zap size={16} className="text-[var(--accent-secondary)]" />;
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
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Zap size={18} className="text-[var(--accent-primary)]" />
          Live Operations Feed
        </h2>
        <span className="badge badge-neutral animate-pulse-glow">Live</span>
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
                <div className="absolute left-[11px] top-1 w-2 h-2 rounded-full bg-[var(--bg-elevated)] border-2 border-[var(--accent-primary)] group-hover:bg-[var(--accent-primary)] group-hover:shadow-[var(--shadow-glow)] transition-all z-10"></div>
                
                <div className="bg-[var(--bg-elevated)]/50 border border-[var(--border-subtle)] rounded-lg p-3 hover:border-[var(--border-active)] transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--text-muted)]">{getIcon(activity.type)}</span>
                      <h4 className="text-sm font-medium text-white">{activity.title}</h4>
                    </div>
                    <span className="text-xs text-[var(--text-muted)] whitespace-nowrap ml-2">
                      {new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(activity.createdAt))}
                    </span>
                  </div>
                  
                  <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className={`flex items-center gap-1 text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status === "COMPLETED" && <CheckCircle2 size={12} />}
                      {activity.status}
                    </div>
                    <span className="text-xs text-[var(--text-muted)] bg-black/30 px-2 py-0.5 rounded-full border border-white/5">
                      {activity.type}
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

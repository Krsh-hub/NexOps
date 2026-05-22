import { Activity, FileText, Package, AlertTriangle, Zap, CheckCircle2, Clock } from "lucide-react";

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
<<<<<<< HEAD
    if (type.includes("INVOICE")) return <FileText size={14} />;
    if (type.includes("INVENTORY")) return <Package size={14} />;
    if (type.includes("ALERT") || type.includes("WARNING")) return <AlertTriangle size={14} />;
    if (type.includes("PROACTIVE")) return <Zap size={14} className="text-[var(--text-primary)]" />;
    return <Activity size={14} />;
=======
    if (type.includes("INVOICE")) return <FileText size={16} />;
    if (type.includes("INVENTORY")) return <Package size={16} />;
    if (type.includes("ALERT") || type.includes("WARNING")) return <AlertTriangle size={16} />;
    if (type.includes("PROACTIVE")) return <Zap size={16} className="text-[var(--accent-primary)]" />;
    return <Activity size={16} />;
>>>>>>> cc131e69d7b544ffbf288f7ac8c855fbdcb15055
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "text-[var(--success)]";
      case "FAILED": return "text-[var(--danger)]";
      case "PENDING": return "text-[var(--warning)]";
      default: return "text-[var(--text-primary)]";
    }
  };

  return (
<<<<<<< HEAD
    <div className="card p-5 h-full flex flex-col border border-[var(--border-subtle)] shadow-sm bg-[var(--bg-base)]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-[var(--text-primary)]">
          <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
          Activity Feed
        </h2>
=======
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
>>>>>>> cc131e69d7b544ffbf288f7ac8c855fbdcb15055
      </div>

      <div className="relative flex-1 overflow-y-auto pr-2 scrollbar-hide">
        <div className="absolute left-[15px] top-2 bottom-0 w-[1px] bg-[var(--border-subtle)]"></div>
        
        <div className="space-y-5">
          {activities.length === 0 ? (
            <p className="text-[var(--text-muted)] text-xs text-center py-4">No recent activities.</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="relative pl-10 group">
                {/* Timeline Dot */}
<<<<<<< HEAD
                <div className="absolute left-[11px] top-[6px] w-[9px] h-[9px] rounded-full bg-[var(--bg-base)] border-[2px] border-[var(--border-default)] group-hover:border-[var(--text-primary)] transition-colors z-10"></div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[13px] font-medium text-[var(--text-primary)]">{activity.title}</h4>
=======
                <div className="absolute left-[8px] top-[4px] w-[9px] h-[9px] rounded-full bg-[var(--bg-base)] border-[2px] border-[var(--border-default)] group-hover:border-[var(--accent-primary)] transition-colors z-10"></div>
                
                <div className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg p-4 hover:border-[var(--border-default)] transition-colors shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--text-muted)]">{getIcon(activity.type)}</span>
                      <h4 className="text-sm font-medium text-[var(--text-primary)]">{activity.title}</h4>
>>>>>>> cc131e69d7b544ffbf288f7ac8c855fbdcb15055
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap ml-2 font-mono mt-0.5">
                      {new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(activity.createdAt))}
                    </span>
                  </div>
                  
<<<<<<< HEAD
                  <p className="text-[12px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center justify-center text-[var(--text-muted)]">
                      {getIcon(activity.type)}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[var(--border-default)]"></span>
                    <span className="text-[10px] text-[var(--text-muted)]">
=======
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
>>>>>>> cc131e69d7b544ffbf288f7ac8c855fbdcb15055
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

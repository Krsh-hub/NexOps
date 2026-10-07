import { Activity, FileText, Package, AlertTriangle, Zap, Clock, Bot } from "lucide-react";

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
}

export function OperationsFeed({ activities }: { activities: ActivityItem[] }) {
  const getIconConfig = (type: string) => {
    if (type.includes("INVOICE")) return { icon: FileText, color: "text-[var(--blue)]", bg: "bg-blue-500/10 border-blue-500/20" };
    if (type.includes("INVENTORY")) return { icon: Package, color: "text-[var(--orange)]", bg: "bg-orange-500/10 border-orange-500/20" };
    if (type.includes("ALERT") || type.includes("WARNING")) return { icon: AlertTriangle, color: "text-[var(--red)]", bg: "bg-red-500/10 border-red-500/20" };
    if (type.includes("PROACTIVE")) return { icon: Zap, color: "text-[var(--accent)]", bg: "bg-[var(--accent)]/10 border-[var(--accent)]/20" };
    return { icon: Activity, color: "text-[var(--green)]", bg: "bg-green-500/10 border-green-500/20" };
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED": return "text-[var(--green)] bg-gradient-to-r from-[var(--green-subtle)] to-emerald-500/10 border-l-2 border-l-[var(--green)]";
      case "FAILED": return "text-[var(--red)] bg-gradient-to-r from-[var(--red-subtle)] to-rose-500/10 border-l-2 border-l-[var(--red)]";
      case "PENDING": return "text-[var(--orange)] bg-gradient-to-r from-[var(--orange-subtle)] to-amber-500/10 border-l-2 border-l-[var(--orange)]";
      default: return "text-[var(--accent)] bg-gradient-to-r from-[var(--accent-subtle)] to-blue-500/10 border-l-2 border-l-[var(--accent)]";
    }
  };

  const getRelativeTime = (date: Date) => {
    const diff = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="card-surface flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-t-2 border-t-[var(--purple)] group">
      <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--border-primary)]/50 bg-[var(--bg-secondary)]/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--purple)] to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-[var(--purple)]/20 group-hover:scale-110 transition-transform">
            <Clock className="w-4 h-4" strokeWidth={2.2} />
          </div>
          <div>
            <span className="text-[13px] font-bold text-[var(--text-tertiary)] tracking-widest uppercase">Agent Feed</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[16px] font-bold text-[var(--text-primary)] leading-none">Operations Log</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[14px] font-bold text-[var(--purple)] bg-[var(--purple-subtle)] px-2.5 py-1 rounded-md border border-[var(--purple)]/20 shadow-sm">
          {activities.length} events
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide relative">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-[var(--text-tertiary)] text-center animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[var(--accent)] opacity-20 blur-xl animate-pulse" />
              <Bot className="w-12 h-12 mb-4 text-[var(--text-quaternary)] relative z-10" strokeWidth={1.5} />
            </div>
            <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-1">Waiting for AI activity...</h3>
            <p className="text-[14px] text-[var(--text-secondary)]">The agent is monitoring operations in the background.</p>
          </div>
        ) : (
          <div className="p-4 relative">
            <div className="timeline-line" />
            
            <div className="flex flex-col gap-4 relative z-10">
              {activities.map((a) => {
                const config = getIconConfig(a.type);
                const Icon = config.icon;
                return (
                  <div key={a.id} className="relative pl-10 hover:-translate-y-0.5 transition-transform duration-200">
                    <div className={`absolute left-0 top-1 w-8 h-8 rounded-full ${config.bg} border flex items-center justify-center shadow-sm z-10`}>
                      <Icon className={`w-4 h-4 ${config.color}`} strokeWidth={2} />
                    </div>
                    
                    <div className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl p-3.5 hover:border-[var(--border-secondary)] hover:shadow-md transition-all duration-200 group/item">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h4 className="text-[14px] font-bold text-[var(--text-primary)]">{a.title}</h4>
                        <span className="text-[12px] font-semibold text-[var(--text-tertiary)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded-full border border-[var(--border-primary)]">
                          {getRelativeTime(a.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-3">
                        {a.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm ${getStatusStyle(a.status)}`}>
                          {a.status}
                        </span>
                        
                        <span className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                          {a.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

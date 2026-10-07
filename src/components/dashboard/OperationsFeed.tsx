import { Activity, FileText, Package, AlertTriangle, Zap, Clock, Bot } from "lucide-react";

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  createdAt: string | Date;
}

export function OperationsFeed({ activities }: { activities: ActivityItem[] }) {
  const getIconConfig = (type: string) => {
    if (type.includes("INVOICE")) {
      return { icon: FileText, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" };
    }
    if (type.includes("INVENTORY")) {
      return { icon: Package, color: "text-amber-700", bg: "bg-amber-50 border-amber-200" };
    }
    if (type.includes("ALERT") || type.includes("WARNING")) {
      return { icon: AlertTriangle, color: "text-rose-700", bg: "bg-rose-50 border-rose-200" };
    }
    if (type.includes("INITIALIZED") || type.includes("PROACTIVE")) {
      return { icon: Zap, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" };
    }
    return { icon: Activity, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" };
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-emerald-800 bg-emerald-50 border-emerald-200";
      case "FAILED":
        return "text-rose-800 bg-rose-50 border-rose-200";
      case "PENDING":
        return "text-amber-800 bg-amber-50 border-amber-200";
      default:
        return "text-slate-800 bg-slate-100 border-slate-200";
    }
  };

  const getRelativeTime = (date: string | Date) => {
    const d = new Date(date);
    const diff = Math.floor((new Date().getTime() - d.getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="card-surface flex flex-col h-full rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md group">
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/40">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shadow-xs">
            <Clock className="w-4 h-4" strokeWidth={2.2} />
          </div>
          <div>
            <span className="text-[12px] font-bold text-slate-400 tracking-wider uppercase">
              Agent Feed
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[17px] font-bold text-slate-900 leading-tight">
                Operations Log
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
          {activities.length} {activities.length === 1 ? "entry" : "entries"}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide relative">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200 shadow-xs">
              <Bot className="w-7 h-7" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-slate-900">Operations Feed Ready</h3>
              <p className="text-[13px] text-slate-500 max-w-[240px] mt-1 leading-relaxed">
                When you create invoices, add stock, or run AI tasks, actions will appear here in real-time.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-5 flex flex-col gap-3.5">
            {activities.map((a) => {
              const config = getIconConfig(a.type);
              const Icon = config.icon;

              return (
                <div
                  key={a.id}
                  className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 hover:border-slate-300 hover:bg-white transition-all duration-200 flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg ${config.bg} border flex items-center justify-center shrink-0 mt-0.5 shadow-xs`}>
                        <Icon className={`w-4 h-4 ${config.color}`} strokeWidth={2} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[14px] font-bold text-slate-900 leading-snug">
                          {a.title}
                        </h4>
                        <p className="text-[13px] text-slate-600 mt-1 leading-relaxed">
                          {a.description}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-medium text-slate-400 shrink-0 whitespace-nowrap">
                      {getRelativeTime(a.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-semibold border ${getStatusStyle(a.status)}`}>
                      {a.status}
                    </span>
                    <span className="font-semibold text-slate-400 uppercase tracking-wider">
                      {a.type.replace(/_/g, " ")}
                    </span>
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

import { AICommandBar } from "@/components/dashboard/AICommandBar";
import { Bot, Zap, Activity } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;
const BIZ = "biz_demo_001";

async function getActivity() {
  const { data } = await supabase.from("ai_activities").select("*").eq("businessId", BIZ).order("createdAt", { ascending: false }).limit(30);
  return data || [];
}

export default async function AIPage() {
  const activities = await getActivity();

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-[22px] font-semibold text-[var(--text-primary)] tracking-tight">AI Operations</h1>
        <p className="text-[13px] text-[var(--text-tertiary)] mt-1">Command NexOps AI and review autonomous agent activity</p>
      </div>

      {/* AI Command */}
      <div className="max-w-2xl">
        <AICommandBar />
      </div>

      {/* Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { icon: Zap, title: "Auto-Reorder", desc: "AI monitors stock and drafts purchase orders automatically." },
          { icon: Bot, title: "Anomaly Detection", desc: "Detects unusual patterns in revenue and operations." },
          { icon: Activity, title: "Workflow Automation", desc: "Runs recurring tasks like invoice reminders." },
        ].map((c) => (
          <div key={c.title} className="card-elevated p-5 flex flex-col gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center">
              <c.icon className="w-4 h-4" />
            </div>
            <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">{c.title}</h3>
            <p className="text-[12px] text-[var(--text-tertiary)] leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Activity Log */}
      <div className="card-surface overflow-hidden">
        <div className="px-4 py-3.5 border-b border-[var(--border-primary)] flex items-center gap-2">
          <Activity className="w-4 h-4 text-[var(--text-quaternary)]" strokeWidth={1.8} />
          <span className="text-[13px] font-semibold text-[var(--text-primary)]">Agent Log</span>
          <span className="ml-auto text-[11px] text-[var(--text-quaternary)] font-medium">{activities.length} events</span>
        </div>
        <div className="divide-y divide-[var(--border-primary)] max-h-[400px] overflow-y-auto scrollbar-hide">
          {activities.length === 0 ? (
            <div className="text-center py-16 text-[13px] text-[var(--text-quaternary)]">
              <Bot className="w-8 h-8 mx-auto mb-3" strokeWidth={1.5} />No AI activity yet
            </div>
          ) : activities.map((a: any) => {
            const sc = a.status === "COMPLETED" ? "bg-[var(--green-subtle)] text-[var(--green)]" : a.status === "FAILED" ? "bg-[var(--red-subtle)] text-[var(--red)]" : "bg-[var(--orange-subtle)] text-[var(--orange)]";
            return (
              <div key={a.id} className="px-4 py-3.5 hover:bg-[var(--bg-hover)] transition-colors duration-150 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">{a.title}</p>
                  <p className="text-[12px] text-[var(--text-quaternary)] line-clamp-1 mt-0.5">{a.description}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 ${sc}`}>{a.status}</span>
                <span className="text-[11px] text-[var(--text-quaternary)] font-mono shrink-0">
                  {new Date(a.createdAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "numeric", hour12: true })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

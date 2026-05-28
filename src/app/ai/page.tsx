import { AICommandCenter } from "@/components/dashboard/AICommandCenter";
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
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] animate-fade-soft">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-semibold text-[var(--text-primary)] tracking-tight flex items-center gap-2.5">
          <Bot className="w-5.5 h-5.5 text-[var(--accent)]" strokeWidth={2.2} />
          AI Operations Cockpit
        </h1>
        <p className="text-[15px] text-[var(--text-secondary)] mt-1">
          Command your operations agent and review background autonomous workflows.
        </p>
      </div>

      {/* Main Grid: Interactive Conversation & Real-Time Event Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Immersive Conversational Command Center */}
        <div className="lg:col-span-2 h-[560px]">
          <AICommandCenter />
        </div>

        {/* Live Background Agent Feed */}
        <div className="h-[560px] card-surface flex flex-col overflow-hidden transition-all duration-300">
          <div className="px-4 py-3.5 border-b border-[var(--border-primary)]/50 flex items-center gap-2 bg-[var(--bg-secondary)]/30 shrink-0">
            <Activity className="w-4 h-4 text-[var(--text-tertiary)]" strokeWidth={2} />
            <span className="text-[16px] font-bold text-[var(--text-primary)] tracking-wide uppercase">Agent Log Feed</span>
            <span className="ml-auto text-[16px] font-bold text-[var(--text-tertiary)] bg-[var(--border-primary)] border border-[var(--border-secondary)]/25 px-1.5 py-0.5 rounded-md shrink-0">
              {activities.length} events
            </span>
          </div>

          <div className="flex-1 divide-y divide-[var(--border-primary)]/40 overflow-y-auto scrollbar-hide bg-[var(--bg-primary)]/10">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-[var(--text-tertiary)]">
                <Bot className="w-9 h-9 mb-2 text-[var(--text-quaternary)]" strokeWidth={1.5} />
                <p className="text-[16px] font-semibold">No autonomous actions yet</p>
              </div>
            ) : (
              activities.map((a: any) => {
                const isCompleted = a.status === "COMPLETED";
                const isFailed = a.status === "FAILED";
                const pillClass = isCompleted 
                  ? "bg-[var(--green-subtle)] text-[var(--green)]" 
                  : isFailed 
                    ? "bg-[var(--red-subtle)] text-[var(--red)]" 
                    : "bg-[var(--orange-subtle)] text-[var(--orange)]";

                return (
                  <div key={a.id} className="px-4 py-3 hover:bg-[var(--bg-hover)] transition-all duration-150 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <p className="text-[15px] font-semibold text-[var(--text-primary)] truncate">{a.title}</p>
                        <span className="text-[16px] text-[var(--text-tertiary)] font-bold font-mono">
                          {new Date(a.createdAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "numeric", hour12: true })}
                        </span>
                      </div>
                      <p className="text-[15px] text-[var(--text-secondary)] line-clamp-2 mt-0.5 leading-relaxed">{a.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[15px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${pillClass}`}>
                          {a.status}
                        </span>
                        {a.toolUsed && (
                          <span className="text-[15px] text-[var(--text-tertiary)] font-semibold font-mono">
                            {a.toolUsed}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Autonomous Capabilities Grid */}
      <div className="space-y-3">
        <h3 className="text-[15px] font-bold text-[var(--text-secondary)] tracking-wider uppercase">Active Agent Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: Zap, title: "Auto-Reorder Operations", desc: "Monitors real-time café stocks against critical thresholds and automatically drafts supplier POs." },
            { icon: Bot, title: "Anomaly & Risk Scanning", desc: "Constantly observes daily sales revenue trends, collection velocity, and stock depletion rates." },
            { icon: Activity, title: "Payment Collection Reminders", desc: "Autonomously observes client invoice due states and sends gentle payment collections updates." },
          ].map((c) => (
            <div key={c.title} className="card-surface p-4 flex gap-3 transition-all duration-300 hover:shadow-md">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <c.icon className="w-4 h-4" strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-[var(--text-primary)]">{c.title}</h4>
                <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed mt-1">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

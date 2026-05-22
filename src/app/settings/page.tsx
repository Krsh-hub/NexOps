import { User, Palette, Bot, Bell, Shield } from "lucide-react";

const sections = [
  { icon: User, title: "Profile", desc: "Manage your account details and business information." },
  { icon: Palette, title: "Appearance", desc: "Theme preferences and display settings." },
  { icon: Bot, title: "AI Preferences", desc: "Configure AI automation rules and notification triggers." },
  { icon: Bell, title: "Notifications", desc: "Email and push notification settings." },
  { icon: Shield, title: "Security", desc: "Password, API keys, and access control." },
];

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[800px]">
      <div>
        <h1 className="text-[22px] font-semibold text-[var(--text-primary)] tracking-tight">Settings</h1>
        <p className="text-[13px] text-[var(--text-tertiary)] mt-1">Manage your workspace preferences</p>
      </div>
      <div className="space-y-2">
        {sections.map((s) => (
          <button key={s.title} className="w-full card-surface p-4 flex items-center gap-4 text-left hover:border-[var(--border-secondary)] transition-all">
            <div className="w-9 h-9 rounded-lg bg-[var(--bg-hover)] flex items-center justify-center shrink-0">
              <s.icon className="w-4 h-4 text-[var(--text-tertiary)]" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">{s.title}</h3>
              <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">{s.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

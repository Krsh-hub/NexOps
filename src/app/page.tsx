import { StatCards } from "@/components/dashboard/StatCards";
import { OperationsFeed } from "@/components/dashboard/OperationsFeed";
import { InventoryRisk } from "@/components/dashboard/InventoryRisk";
import { FinanceInsights } from "@/components/dashboard/FinanceInsights";
import { AICommandBar } from "@/components/dashboard/AICommandBar";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;
const BIZ = "biz_demo_001";

async function getData() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

  const { data: ti } = await supabase.from("invoices").select("*").eq("businessId", BIZ).eq("status", "PAID").gte("paidAt", today.toISOString());
  const tr = (ti || []).reduce((s: number, i: any) => s + i.total, 0);
  const { data: yi } = await supabase.from("invoices").select("*").eq("businessId", BIZ).eq("status", "PAID").gte("paidAt", yesterday.toISOString()).lt("paidAt", today.toISOString());
  const yr = (yi || []).reduce((s: number, i: any) => s + i.total, 0);
  let rc = 0;
  if (yr > 0) rc = Math.round(((tr - yr) / yr) * 100);
  else if (tr > 0) rc = 100;

  const { data: prods } = await supabase.from("products").select("*, vendor:vendors(*)").eq("businessId", BIZ).eq("isActive", true);
  const low = (prods || []).filter((p: any) => p.currentStock <= p.reorderThreshold).sort((a: any, b: any) => a.currentStock - b.currentStock);

  const { data: od } = await supabase.from("invoices").select("*").eq("businessId", BIZ).eq("status", "OVERDUE");
  const ot = (od || []).reduce((s: number, i: any) => s + i.total, 0);

  const { count: ao } = await supabase.from("purchase_orders").select("*", { count: "exact", head: true }).eq("businessId", BIZ).in("status", ["DRAFT", "SENT"]);

  const { data: acts } = await supabase.from("ai_activities").select("*").eq("businessId", BIZ).order("createdAt", { ascending: false }).limit(15);

  return {
    revenue: { amount: tr || 12450, change: rc || 12 },
    lowStockCount: low.length,
    overdueInvoices: { count: (od || []).length, total: ot },
    activeOrders: ao || 0,
    activities: acts || [],
    lowStockProducts: low,
  };
}

export default async function DashboardPage() {
  const d = await getData();
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const hour = today.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 w-full max-w-[1600px] mx-auto">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight">
            <span className="gradient-text">{greeting}</span>, Operator
          </h1>
          <p className="text-[15px] sm:text-[16px] text-[var(--text-tertiary)] mt-1.5 font-medium">
            {dateStr}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-full shadow-sm text-[14px] font-medium text-[var(--text-secondary)]">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--green)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--green)]"></span>
          </span>
          Brew & Bite Café · All systems operational
        </div>
      </div>

      {/* KPIs */}
      <StatCards revenue={d.revenue} lowStockCount={d.lowStockCount} overdueInvoices={d.overdueInvoices} activeOrders={d.activeOrders} />

      {/* AI Command */}
      <AICommandBar />

      {/* Grid */}
      <div className="space-y-4">
        <h2 className="text-[14px] font-bold text-[var(--text-quaternary)] uppercase tracking-wider pl-1">
          Operations Overview
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 min-h-[400px]">
          <InventoryRisk products={d.lowStockProducts.slice(0, 6)} />
          <FinanceInsights />
          <OperationsFeed activities={d.activities} />
        </div>
      </div>
    </div>
  );
}

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
  const tr = (ti || []).reduce((s, i) => s + i.total, 0);
  const { data: yi } = await supabase.from("invoices").select("*").eq("businessId", BIZ).eq("status", "PAID").gte("paidAt", yesterday.toISOString()).lt("paidAt", today.toISOString());
  const yr = (yi || []).reduce((s, i) => s + i.total, 0);
  let rc = 0;
  if (yr > 0) rc = Math.round(((tr - yr) / yr) * 100);
  else if (tr > 0) rc = 100;

  const { data: prods } = await supabase.from("products").select("*, vendor:vendors(*)").eq("businessId", BIZ).eq("isActive", true);
  const low = (prods || []).filter(p => p.currentStock <= p.reorderThreshold).sort((a, b) => a.currentStock - b.currentStock);

  const { data: od } = await supabase.from("invoices").select("*").eq("businessId", BIZ).eq("status", "OVERDUE");
  const ot = (od || []).reduce((s, i) => s + i.total, 0);

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

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-semibold text-[var(--text-primary)] tracking-tight">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}
        </h1>
        <p className="text-[13px] text-[var(--text-tertiary)] mt-1">
          Here&apos;s what&apos;s happening with your operations today.
        </p>
      </div>

      {/* KPIs */}
      <StatCards revenue={d.revenue} lowStockCount={d.lowStockCount} overdueInvoices={d.overdueInvoices} activeOrders={d.activeOrders} />

      {/* AI Command */}
      <AICommandBar />

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[380px]">
        <InventoryRisk products={d.lowStockProducts.slice(0, 6)} />
        <FinanceInsights />
        <OperationsFeed activities={d.activities} />
      </div>
    </div>
  );
}

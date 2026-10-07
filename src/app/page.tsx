import { StatCards } from "@/components/dashboard/StatCards";
import { OperationsFeed } from "@/components/dashboard/OperationsFeed";
import { InventoryRisk } from "@/components/dashboard/InventoryRisk";
import { FinanceInsights } from "@/components/dashboard/FinanceInsights";
import { AICommandBar } from "@/components/dashboard/AICommandBar";
import { InitialSetupScreen } from "@/components/dashboard/InitialSetupScreen";
import { supabase, getBusinessProfile } from "@/lib/supabase";
import Link from "next/link";
import { Settings } from "lucide-react";

export const revalidate = 0;
const BIZ = "biz_demo_001";

async function getData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Real paid invoices for today
  const { data: ti } = await supabase
    .from("invoices")
    .select("*")
    .eq("businessId", BIZ)
    .eq("status", "PAID")
    .gte("paidAt", today.toISOString());
  const tr = (ti || []).reduce((s: number, i: any) => s + (i.total || 0), 0);

  // Real paid invoices for yesterday
  const { data: yi } = await supabase
    .from("invoices")
    .select("*")
    .eq("businessId", BIZ)
    .eq("status", "PAID")
    .gte("paidAt", yesterday.toISOString())
    .lt("paidAt", today.toISOString());
  const yr = (yi || []).reduce((s: number, i: any) => s + (i.total || 0), 0);

  let rc = 0;
  if (yr > 0) rc = Math.round(((tr - yr) / yr) * 100);
  else if (tr > 0) rc = 100;

  // Real active products and low stock calculations
  const { data: prods } = await supabase
    .from("products")
    .select("*, vendor:vendors(*)")
    .eq("businessId", BIZ)
    .eq("isActive", true);
  const low = (prods || [])
    .filter((p: any) => p.currentStock <= p.reorderThreshold)
    .sort((a: any, b: any) => a.currentStock - b.currentStock);

  // Real overdue invoices
  const { data: od } = await supabase
    .from("invoices")
    .select("*")
    .eq("businessId", BIZ)
    .eq("status", "OVERDUE");
  const ot = (od || []).reduce((s: number, i: any) => s + (i.total || 0), 0);

  // Active POs
  const { count: ao } = await supabase
    .from("purchase_orders")
    .select("*", { count: "exact", head: true })
    .eq("businessId", BIZ)
    .in("status", ["DRAFT", "SENT"]);

  // Real activity events
  const { data: acts } = await supabase
    .from("ai_activities")
    .select("*")
    .eq("businessId", BIZ)
    .order("createdAt", { ascending: false })
    .limit(15);

  // All invoices for finance chart
  const { data: allInvoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("businessId", BIZ);

  return {
    revenue: { amount: tr, change: rc },
    lowStockCount: low.length,
    overdueInvoices: { count: (od || []).length, total: ot },
    activeOrders: ao || 0,
    activities: acts || [],
    lowStockProducts: low,
    allInvoices: allInvoices || [],
    totalProductsCount: (prods || []).length,
  };
}

export default async function DashboardPage() {
  const profile = getBusinessProfile();

  // If the user has not configured their details yet, show the focused initial setup screen first!
  if (!profile || !profile.isConfigured) {
    return <InitialSetupScreen initialProfile={profile} />;
  }

  // Once configured, display the spacious, real dashboard!
  const d = await getData();
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const hour = today.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const operatorDisplay = profile.operatorName || "Operator";
  const businessDisplay = profile.businessName || "My Workspace";
  const currencySymbol = profile.currencySymbol || "₹";

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-12 space-y-10 sm:space-y-12 animate-fade-in">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <h1 className="text-[30px] sm:text-[34px] font-extrabold tracking-tight text-slate-900 leading-tight">
            <span className="text-emerald-700">{greeting}</span>, {operatorDisplay}
          </h1>
          <p className="text-[15px] sm:text-[16px] text-slate-500 font-medium">
            {dateStr}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200/90 rounded-full shadow-xs text-[14px] font-semibold text-slate-700">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span>{businessDisplay} · All systems operational</span>
          </div>

          <Link
            href="/settings"
            title="Edit Workspace Settings"
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-xs"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 2. Metric KPI Cards */}
      <section className="space-y-3">
        <StatCards
          revenue={d.revenue}
          lowStockCount={d.lowStockCount}
          overdueInvoices={d.overdueInvoices}
          activeOrders={d.activeOrders}
          currencySymbol={currencySymbol}
        />
      </section>

      {/* 3. Autonomous AI Command Section */}
      <section className="space-y-3">
        <AICommandBar />
      </section>

      {/* 4. Operations Overview Grid */}
      <section className="space-y-5 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">
            Operations Overview
          </h2>
          <span className="text-[12px] font-medium text-slate-400">
            Real-time feed & catalog telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 sm:gap-8 min-h-[440px]">
          <InventoryRisk
            products={d.lowStockProducts.slice(0, 6)}
            totalProductsCount={d.totalProductsCount}
          />
          <FinanceInsights
            invoices={d.allInvoices}
            currencySymbol={currencySymbol}
          />
          <OperationsFeed
            activities={d.activities}
          />
        </div>
      </section>
    </div>
  );
}

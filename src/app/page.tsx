import { StatCards } from "@/components/dashboard/StatCards";
import { OperationsFeed } from "@/components/dashboard/OperationsFeed";
import { InventoryRisk } from "@/components/dashboard/InventoryRisk";
import { FinanceInsights } from "@/components/dashboard/FinanceInsights";
import { AICommandBar } from "@/components/dashboard/AICommandBar";
import { InitialSetupScreen } from "@/components/dashboard/InitialSetupScreen";
import { supabase, getBusinessProfile } from "@/lib/supabase";
import Link from "next/link";
import { Settings, Plus, Package, FileText, Sparkles, BarChart3, ArrowUpRight } from "lucide-react";

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

  // If unconfigured, display focused initial setup screen first
  if (!profile || !profile.isConfigured) {
    return <InitialSetupScreen initialProfile={profile} />;
  }

  // Once configured, render the modern 2-column cockpit workspace
  const d = await getData();
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const hour = today.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const operatorDisplay = profile.operatorName || "Operator";
  const businessDisplay = profile.businessName || "My Workspace";
  const workspaceSlug = businessDisplay.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
  const currencySymbol = profile.currencySymbol || "₹";

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-7 space-y-7 animate-fade-in">
      {/* 1. Executive Apple Minimalist Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/70">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium">
            <span>{dateStr}</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-700 font-semibold">{businessDisplay}</span>
          </div>
          <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-slate-900 leading-tight">
            {greeting}, {operatorDisplay}
          </h1>
        </div>

        {/* Action Shortcuts Toolbar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/finance"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-medium rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Invoice</span>
          </Link>

          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 text-[13px] font-medium rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            <Package className="w-4 h-4 text-emerald-700" />
            <span>Add Product</span>
          </Link>

          <Link
            href="/settings"
            title="Workspace Settings"
            className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all shadow-2xs"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 2. Asymmetric Cockpit Grid (Left: 8 cols = 67%, Right: 4 cols = 33%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Main Column: Command Bar + Financial Health + Operations Stream */}
        <div className="lg:col-span-8 space-y-7">
          {/* AI Command Spotlight Cockpit */}
          <AICommandBar />

          {/* Financial Health Chart */}
          <FinanceInsights
            invoices={d.allInvoices}
            currencySymbol={currencySymbol}
          />

          {/* Live Operations Stream */}
          <OperationsFeed
            activities={d.activities}
          />
        </div>

        {/* Right Dock: Compact KPI Digest + Urgent Attention + Fast Shortcuts */}
        <div className="lg:col-span-4 space-y-7">
          {/* Executive KPI Digest (2x2 Compact Grid) */}
          <div className="space-y-2.5">
            <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider pl-1">
              Executive Digest
            </h3>
            <StatCards
              revenue={d.revenue}
              lowStockCount={d.lowStockCount}
              overdueInvoices={d.overdueInvoices}
              activeOrders={d.activeOrders}
              currencySymbol={currencySymbol}
              compact={true}
            />
          </div>

          {/* Urgent Attention / Stock Risks */}
          <InventoryRisk
            products={d.lowStockProducts.slice(0, 5)}
            totalProductsCount={d.totalProductsCount}
          />

          {/* Quick Workspaces Shortcuts */}
          <div className="card-surface p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-3">
            <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Shortcuts
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[12px] font-semibold text-slate-700">
              <Link
                href="/inventory"
                className="p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/50 flex items-center gap-2 transition-all"
              >
                <Package className="w-4 h-4 text-emerald-700" />
                <span>Inventory</span>
              </Link>
              <Link
                href="/finance"
                className="p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/50 flex items-center gap-2 transition-all"
              >
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Invoices</span>
              </Link>
              <Link
                href="/ai"
                className="p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/50 flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>AI Cockpit</span>
              </Link>
              <Link
                href="/reports"
                className="p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/50 flex items-center gap-2 transition-all"
              >
                <BarChart3 className="w-4 h-4 text-emerald-700" />
                <span>Reports</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

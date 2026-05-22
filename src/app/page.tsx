import { StatCards } from "@/components/dashboard/StatCards";
import { OperationsFeed } from "@/components/dashboard/OperationsFeed";
import { InventoryRisk } from "@/components/dashboard/InventoryRisk";
import { FinanceInsights } from "@/components/dashboard/FinanceInsights";
import { AICommandBar } from "@/components/dashboard/AICommandBar";
import { supabase } from "@/lib/supabase";

// Revalidate every 60 seconds or on demand
export const revalidate = 60;

const BUSINESS_ID = "biz_demo_001";

async function getDashboardData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // 1. Revenue
  const { data: todayInvoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("businessId", BUSINESS_ID)
    .eq("status", "PAID")
    .gte("paidAt", today.toISOString());
    
  const todayRevenue = (todayInvoices || []).reduce((sum, inv) => sum + inv.total, 0);

  const { data: yesterdayInvoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("businessId", BUSINESS_ID)
    .eq("status", "PAID")
    .gte("paidAt", yesterday.toISOString())
    .lt("paidAt", today.toISOString());

  const yesterdayRevenue = (yesterdayInvoices || []).reduce((sum, inv) => sum + inv.total, 0);
  
  let revenueChange = 0;
  if (yesterdayRevenue > 0) {
    revenueChange = Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100);
  } else if (todayRevenue > 0) {
    revenueChange = 100;
  }

  // 2. Low Stock
  const { data: allProducts } = await supabase
    .from("products")
    .select("*, vendor:vendors(*)")
    .eq("businessId", BUSINESS_ID)
    .eq("isActive", true);
    
  const lowStockProducts = (allProducts || [])
    .filter(p => p.currentStock <= p.reorderThreshold)
    .sort((a, b) => a.currentStock - b.currentStock);

  // 3. Overdue Invoices
  const { data: overdueInvoicesData } = await supabase
    .from("invoices")
    .select("*")
    .eq("businessId", BUSINESS_ID)
    .eq("status", "OVERDUE");
    
  const overdueTotal = (overdueInvoicesData || []).reduce((sum, inv) => sum + inv.total, 0);

  // 4. Active Orders
  const { count: activeOrdersCount } = await supabase
    .from("purchase_orders")
    .select("*", { count: "exact", head: true })
    .eq("businessId", BUSINESS_ID)
    .in("status", ["DRAFT", "SENT"]);

  // 5. Activities
  const { data: activities } = await supabase
    .from("ai_activities")
    .select("*")
    .eq("businessId", BUSINESS_ID)
    .order("createdAt", { ascending: false })
    .limit(15);

  return {
    revenue: { amount: todayRevenue || 12450, change: revenueChange || 12 },
    lowStockCount: lowStockProducts.length,
    overdueInvoices: { count: (overdueInvoicesData || []).length, total: overdueTotal },
    activeOrders: activeOrdersCount || 0,
    activities: activities || [],
    lowStockProducts
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
<<<<<<< HEAD
    <div className="px-6 md:px-8 py-8 w-full max-w-[1600px] mx-auto space-y-8 min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Operations Overview</h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">Review your business operations and insights for today.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 rounded-md text-[13px] font-medium hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-subtle)] shadow-sm">
            Manual Override
          </button>
          <button className="bg-[var(--text-primary)] text-[var(--bg-base)] px-3 py-1.5 rounded-md text-[13px] font-medium hover:bg-white shadow-sm transition-all">
=======
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">Operations Overview</h1>
          <p className="text-[var(--text-secondary)] mt-1.5 text-sm">Review your business operations and insights for today.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-md text-sm font-medium hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-default)]">
            Manual Override
          </button>
          <button className="bg-[var(--text-primary)] text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-white shadow-sm transition-all">
>>>>>>> cc131e69d7b544ffbf288f7ac8c855fbdcb15055
            Generate Report
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <div className="shrink-0">
        <StatCards 
          revenue={data.revenue}
          lowStockCount={data.lowStockCount}
          overdueInvoices={data.overdueInvoices}
          activeOrders={data.activeOrders}
        />
      </div>

<<<<<<< HEAD
      {/* AI Command Bar */}
      <div className="w-full shrink-0">
        <AICommandBar />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 pb-8 min-h-[400px]">
        {/* Left Column: Intelligence */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[320px]">
            <InventoryRisk products={data.lowStockProducts.slice(0, 5)} />
            <FinanceInsights />
          </div>
=======
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[600px] pb-6">
        {/* Left Column: AI Command Center & Inventory */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
          <div className="flex-1 min-h-[300px]">
            <AICommandCenter />
          </div>
          <div className="flex-1 min-h-[250px]">
            <InventoryTable products={data.lowStockProducts.slice(0, 3)} />
          </div>
        </div>

        {/* Right Column: Operations Feed */}
        <div className="h-full">
          <OperationsFeed activities={data.activities} />
>>>>>>> cc131e69d7b544ffbf288f7ac8c855fbdcb15055
        </div>

        {/* Right Column: Operations Feed */}
        <div className="h-[320px] lg:h-full">
          <OperationsFeed activities={data.activities} />
        </div>
      </div>
    </div>
  );
}

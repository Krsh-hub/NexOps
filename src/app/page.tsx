import { StatCards } from "@/components/dashboard/StatCards";
import { OperationsFeed } from "@/components/dashboard/OperationsFeed";
import { InventoryTable } from "@/components/dashboard/InventoryTable";
import { AICommandCenter } from "@/components/dashboard/AICommandCenter";
import { prisma } from "@/lib/prisma";

// Revalidate every 60 seconds or on demand
export const revalidate = 60;

const BUSINESS_ID = "biz_demo_001";

async function getDashboardData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // 1. Revenue
  const todayInvoices = await prisma.invoice.findMany({
    where: {
      businessId: BUSINESS_ID,
      status: "PAID",
      paidAt: { gte: today }
    }
  });
  const todayRevenue = todayInvoices.reduce((sum, inv) => sum + inv.total, 0);

  const yesterdayInvoices = await prisma.invoice.findMany({
    where: {
      businessId: BUSINESS_ID,
      status: "PAID",
      paidAt: { gte: yesterday, lt: today }
    }
  });
  const yesterdayRevenue = yesterdayInvoices.reduce((sum, inv) => sum + inv.total, 0);
  
  let revenueChange = 0;
  if (yesterdayRevenue > 0) {
    revenueChange = Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100);
  } else if (todayRevenue > 0) {
    revenueChange = 100; // 100% increase if yesterday was 0
  }

  // 2. Low Stock
  const lowStockProducts = await prisma.product.findMany({
    where: {
      businessId: BUSINESS_ID,
      isActive: true,
      currentStock: { lte: prisma.product.fields.reorderThreshold }
    },
    include: { vendor: true },
    orderBy: { currentStock: 'asc' }
  });

  // 3. Overdue Invoices
  const overdueInvoicesData = await prisma.invoice.findMany({
    where: {
      businessId: BUSINESS_ID,
      status: "OVERDUE"
    }
  });
  const overdueTotal = overdueInvoicesData.reduce((sum, inv) => sum + inv.total, 0);

  // 4. Active Orders
  const activeOrdersCount = await prisma.purchaseOrder.count({
    where: {
      businessId: BUSINESS_ID,
      status: { in: ["DRAFT", "SENT"] }
    }
  });

  // 5. Activities
  const activities = await prisma.aIActivity.findMany({
    where: { businessId: BUSINESS_ID },
    orderBy: { createdAt: 'desc' },
    take: 15
  });

  return {
    revenue: { amount: todayRevenue || 12450, change: revenueChange || 12 }, // Fallbacks for demo
    lowStockCount: lowStockProducts.length,
    overdueInvoices: { count: overdueInvoicesData.length, total: overdueTotal },
    activeOrders: activeOrdersCount,
    activities,
    lowStockProducts
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white p-4 md:p-8 font-sans bg-grid">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] shadow-[var(--shadow-glow)] animate-pulse-glow"></div>
              <span className="text-[var(--accent-primary)] font-medium text-sm tracking-wider uppercase">NexOps AI Platform</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-glow">Operations Overview</h1>
            <p className="text-[var(--text-muted)] mt-1">Brew & Bite Café — Autonomous Mode Active</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="glass px-4 py-2 rounded-full text-sm font-medium hover:bg-white/5 transition-colors border border-[var(--border-default)]">
              Manual Override
            </button>
            <button className="bg-[var(--accent-primary)] text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-[var(--accent-primary-dim)] shadow-[var(--shadow-glow)] transition-all">
              Generate Report
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <StatCards 
          revenue={data.revenue}
          lowStockCount={data.lowStockCount}
          overdueInvoices={data.overdueInvoices}
          activeOrders={data.activeOrders}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Left Column: AI Command Center & Inventory */}
          <div className="lg:col-span-2 flex flex-col gap-6 h-full">
            <div className="flex-1 min-h-0">
              <AICommandCenter />
            </div>
            <div className="h-1/3 min-h-[200px]">
              <InventoryTable products={data.lowStockProducts.slice(0, 3)} />
            </div>
          </div>

          {/* Right Column: Operations Feed */}
          <div className="h-full">
            <OperationsFeed activities={data.activities} />
          </div>
        </div>
      </div>
    </div>
  );
}

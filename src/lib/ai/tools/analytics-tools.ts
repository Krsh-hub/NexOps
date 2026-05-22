// ============================================
// NexOps Analytics Tool Implementations
// ============================================

import { prisma } from "@/lib/prisma";

const BUSINESS_ID = "biz_demo_001";

export async function generateSummary(args: {
  period?: string;
}): Promise<string> {
  const now = new Date();
  const period = args.period || "daily";
  
  const startDate = period === "weekly"
    ? new Date(now.getTime() - 7 * 86400000)
    : new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Revenue data
  const paidInvoices = await prisma.invoice.findMany({
    where: {
      businessId: BUSINESS_ID,
      status: "PAID",
      paidAt: { gte: startDate },
    },
  });

  const totalRevenue = paidInvoices.reduce((sum, i) => sum + i.total, 0);

  // Previous period for comparison
  const prevStart = period === "weekly"
    ? new Date(startDate.getTime() - 7 * 86400000)
    : new Date(startDate.getTime() - 86400000);

  const prevPaidInvoices = await prisma.invoice.findMany({
    where: {
      businessId: BUSINESS_ID,
      status: "PAID",
      paidAt: { gte: prevStart, lt: startDate },
    },
  });

  const prevRevenue = prevPaidInvoices.reduce((sum, i) => sum + i.total, 0);
  const revenueChange = prevRevenue > 0
    ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100)
    : 0;

  // Expenses
  const expenses = await prisma.expense.findMany({
    where: {
      businessId: BUSINESS_ID,
      date: { gte: startDate },
    },
  });
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Overdue invoices
  const overdueInvoices = await prisma.invoice.findMany({
    where: { businessId: BUSINESS_ID, status: "OVERDUE" },
  });
  const overdueTotal = overdueInvoices.reduce((sum, i) => sum + i.total, 0);

  // Low stock items
  const lowStockProducts = await prisma.product.findMany({
    where: {
      businessId: BUSINESS_ID,
      isActive: true,
      reorderThreshold: { gt: 0 },
    },
  });
  const criticalItems = lowStockProducts.filter(
    (p) => p.currentStock <= p.reorderThreshold
  );

  // Recent activities
  const activities = await prisma.aIActivity.findMany({
    where: {
      businessId: BUSINESS_ID,
      createdAt: { gte: startDate },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const summary = {
    period,
    revenue: {
      total: totalRevenue,
      change: revenueChange,
      invoiceCount: paidInvoices.length,
    },
    expenses: {
      total: totalExpenses,
    },
    profit: totalRevenue - totalExpenses,
    overdueInvoices: {
      count: overdueInvoices.length,
      total: overdueTotal,
    },
    inventoryAlerts: {
      criticalItems: criticalItems.length,
      items: criticalItems.map((p) => ({
        name: p.name,
        stock: `${p.currentStock} ${p.unit}`,
        threshold: p.reorderThreshold,
      })),
    },
    activityCount: activities.length,
    highlights: [] as string[],
  };

  // Generate highlight bullets
  if (revenueChange > 0) {
    summary.highlights.push(`Revenue ${revenueChange > 0 ? "increased" : "decreased"} ${Math.abs(revenueChange)}% ${period === "daily" ? "today" : "this week"}.`);
  }
  if (overdueInvoices.length > 0) {
    summary.highlights.push(`${overdueInvoices.length} invoice(s) overdue — ₹${overdueTotal.toLocaleString("en-IN")} outstanding.`);
  }
  if (criticalItems.length > 0) {
    summary.highlights.push(`${criticalItems.length} item(s) need restocking: ${criticalItems.map((p) => p.name).join(", ")}.`);
  }

  // Log AI activity
  await prisma.aIActivity.create({
    data: {
      type: "DAILY_SUMMARY",
      status: "COMPLETED",
      title: `${period === "weekly" ? "Weekly" : "Daily"} operations summary`,
      description: summary.highlights.join(" "),
      toolUsed: "generate_summary",
      businessId: BUSINESS_ID,
    },
  });

  return JSON.stringify(summary);
}

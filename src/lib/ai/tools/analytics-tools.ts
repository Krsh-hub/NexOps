// ============================================
// NexOps Analytics Tool Implementations
// ============================================

import { supabase } from "@/lib/supabase";

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
  const { data: paidInvoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("businessId", BUSINESS_ID)
    .eq("status", "PAID")
    .gte("paidAt", startDate.toISOString());

  const totalRevenue = (paidInvoices || []).reduce((sum: number, i: any) => sum + i.total, 0);

  // Previous period for comparison
  const prevStart = period === "weekly"
    ? new Date(startDate.getTime() - 7 * 86400000)
    : new Date(startDate.getTime() - 86400000);

  const { data: prevPaidInvoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("businessId", BUSINESS_ID)
    .eq("status", "PAID")
    .gte("paidAt", prevStart.toISOString())
    .lt("paidAt", startDate.toISOString());

  const prevRevenue = (prevPaidInvoices || []).reduce((sum: number, i: any) => sum + i.total, 0);
  const revenueChange = prevRevenue > 0
    ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100)
    : 0;

  // Expenses
  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .eq("businessId", BUSINESS_ID)
    .gte("date", startDate.toISOString());
    
  const totalExpenses = (expenses || []).reduce((sum: number, e: any) => sum + e.amount, 0);

  // Overdue invoices
  const { data: overdueInvoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("businessId", BUSINESS_ID)
    .eq("status", "OVERDUE");
    
  const overdueTotal = (overdueInvoices || []).reduce((sum: number, i: any) => sum + i.total, 0);

  // Low stock items
  const { data: lowStockProducts } = await supabase
    .from("products")
    .select("*")
    .eq("businessId", BUSINESS_ID)
    .eq("isActive", true)
    .gt("reorderThreshold", 0);
    
  const criticalItems = (lowStockProducts || []).filter(
    (p: any) => p.currentStock <= p.reorderThreshold
  );

  // Recent activities
  const { data: activities } = await supabase
    .from("ai_activities")
    .select("*")
    .eq("businessId", BUSINESS_ID)
    .gte("createdAt", startDate.toISOString())
    .order("createdAt", { ascending: false })
    .limit(10);

  const summary = {
    period,
    revenue: {
      total: totalRevenue,
      change: revenueChange,
      invoiceCount: (paidInvoices || []).length,
    },
    expenses: {
      total: totalExpenses,
    },
    profit: totalRevenue - totalExpenses,
    overdueInvoices: {
      count: (overdueInvoices || []).length,
      total: overdueTotal,
    },
    inventoryAlerts: {
      criticalItems: criticalItems.length,
      items: criticalItems.map((p: any) => ({
        name: p.name,
        stock: `${p.currentStock} ${p.unit}`,
        threshold: p.reorderThreshold,
      })),
    },
    activityCount: (activities || []).length,
    highlights: [] as string[],
  };

  // Generate highlight bullets
  if (revenueChange > 0) {
    summary.highlights.push(`Revenue ${revenueChange > 0 ? "increased" : "decreased"} ${Math.abs(revenueChange)}% ${period === "daily" ? "today" : "this week"}.`);
  }
  if (overdueInvoices && overdueInvoices.length > 0) {
    summary.highlights.push(`${overdueInvoices.length} invoice(s) overdue — ₹${overdueTotal.toLocaleString("en-IN")} outstanding.`);
  }
  if (criticalItems.length > 0) {
    summary.highlights.push(`${criticalItems.length} item(s) need restocking: ${criticalItems.map((p: any) => p.name).join(", ")}.`);
  }

  // Log AI activity
  await supabase.from("ai_activities").insert({
    type: "DAILY_SUMMARY",
    status: "COMPLETED",
    title: `${period === "weekly" ? "Weekly" : "Daily"} operations summary`,
    description: summary.highlights.join(" "),
    toolUsed: "generate_summary",
    businessId: BUSINESS_ID,
  });

  return JSON.stringify(summary);
}

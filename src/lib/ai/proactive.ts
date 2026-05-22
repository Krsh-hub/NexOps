// ============================================
// NexOps Proactive Engine
// Runs background checks and generates autonomous alerts
// ============================================

import { supabase } from "../supabase";

const BUSINESS_ID = "biz_demo_001";

export async function runProactiveChecks() {
  console.log("🔍 Running proactive operations checks...");
  
  const alerts: string[] = [];

  // 1. Check Low Stock
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("businessId", BUSINESS_ID)
    .eq("isActive", true)
    .gt("reorderThreshold", 0);

  const lowStockProducts = (products || []).filter(p => p.currentStock <= p.reorderThreshold);
  
  if (lowStockProducts.length > 0) {
    const details = lowStockProducts.map(p => `${p.name} (${p.currentStock} ${p.unit} left)`).join(", ");
    
    await supabase.from("notifications").insert({
      type: "WARNING",
      title: "Low Stock Alert",
      message: `${lowStockProducts.length} items are below reorder threshold: ${details}`,
      businessId: BUSINESS_ID,
    });

    alerts.push(`Generated low stock alert for ${lowStockProducts.length} items.`);
  }

  // 2. Check Overdue Invoices
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: overdueInvoices } = await supabase
    .from("invoices")
    .select("*, customer:customers(*)")
    .eq("businessId", BUSINESS_ID)
    .lt("dueDate", today.toISOString())
    .not("status", "in", '("PAID","CANCELLED")');

  if (overdueInvoices && overdueInvoices.length > 0) {
    // Update status to OVERDUE if they were SENT or DRAFT
    for (const inv of overdueInvoices) {
      if (inv.status !== "OVERDUE") {
        await supabase.from("invoices")
          .update({ status: "OVERDUE", updatedAt: new Date().toISOString() })
          .eq("id", inv.id);
      }
    }

    const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);

    await supabase.from("notifications").insert({
      type: "CRITICAL",
      title: "Overdue Invoices Detected",
      message: `${overdueInvoices.length} invoices are overdue totaling ₹${totalOverdue.toLocaleString("en-IN")}.`,
      businessId: BUSINESS_ID,
    });

    alerts.push(`Found ${overdueInvoices.length} overdue invoices.`);
  }

  // Record activity if we found something
  if (alerts.length > 0) {
    await supabase.from("ai_activities").insert({
      type: "PROACTIVE_SCAN",
      status: "COMPLETED",
      title: "Proactive Operations Scan",
      description: alerts.join(" "),
      businessId: BUSINESS_ID,
    });
  }

  return { success: true, alerts };
}

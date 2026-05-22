// ============================================
// NexOps Proactive Engine
// Runs background checks and generates autonomous alerts
// ============================================

import { prisma } from "../prisma";

const BUSINESS_ID = "biz_demo_001";

export async function runProactiveChecks() {
  console.log("🔍 Running proactive operations checks...");
  
  const alerts: string[] = [];

  // 1. Check Low Stock
  const products = await prisma.product.findMany({
    where: {
      businessId: BUSINESS_ID,
      isActive: true,
      reorderThreshold: { gt: 0 }
    }
  });

  const lowStockProducts = products.filter(p => p.currentStock <= p.reorderThreshold);
  
  if (lowStockProducts.length > 0) {
    const details = lowStockProducts.map(p => `${p.name} (${p.currentStock} ${p.unit} left)`).join(", ");
    
    await prisma.notification.create({
      data: {
        type: "WARNING",
        title: "Low Stock Alert",
        message: `${lowStockProducts.length} items are below reorder threshold: ${details}`,
        businessId: BUSINESS_ID,
      }
    });

    alerts.push(`Generated low stock alert for ${lowStockProducts.length} items.`);
  }

  // 2. Check Overdue Invoices
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueInvoices = await prisma.invoice.findMany({
    where: {
      businessId: BUSINESS_ID,
      status: { notIn: ["PAID", "CANCELLED"] },
      dueDate: { lt: today }
    },
    include: { customer: true }
  });

  if (overdueInvoices.length > 0) {
    // Update status to OVERDUE if they were SENT or DRAFT
    for (const inv of overdueInvoices) {
      if (inv.status !== "OVERDUE") {
        await prisma.invoice.update({
          where: { id: inv.id },
          data: { status: "OVERDUE" }
        });
      }
    }

    const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);

    await prisma.notification.create({
      data: {
        type: "CRITICAL",
        title: "Overdue Invoices Detected",
        message: `${overdueInvoices.length} invoices are overdue totaling ₹${totalOverdue.toLocaleString("en-IN")}.`,
        businessId: BUSINESS_ID,
      }
    });

    alerts.push(`Found ${overdueInvoices.length} overdue invoices.`);
  }

  // Record activity if we found something
  if (alerts.length > 0) {
    await prisma.aIActivity.create({
      data: {
        type: "PROACTIVE_SCAN",
        status: "COMPLETED",
        title: "Proactive Operations Scan",
        description: alerts.join(" "),
        businessId: BUSINESS_ID,
      }
    });
  }

  return { success: true, alerts };
}

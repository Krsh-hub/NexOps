// ============================================
// NexOps Finance Tool Implementations
// ============================================

import { prisma } from "@/lib/prisma";

const BUSINESS_ID = "biz_demo_001";

export async function createInvoice(args: {
  customerName: string;
  items: string;
  dueInDays?: string;
}): Promise<string> {
  // Find or create customer
  let customer = await prisma.customer.findFirst({
    where: {
      businessId: BUSINESS_ID,
      name: { contains: args.customerName },
    },
  });

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        name: args.customerName,
        businessId: BUSINESS_ID,
      },
    });
  }

  // Parse items
  let parsedItems: Array<{ productName: string; quantity: number }>;
  try {
    parsedItems = JSON.parse(args.items);
  } catch {
    return JSON.stringify({ error: "Invalid items format. Expected JSON array." });
  }

  // Get invoice count for numbering
  const invoiceCount = await prisma.invoice.count({ where: { businessId: BUSINESS_ID } });
  const invoiceNumber = `INV-2026-${String(invoiceCount + 1).padStart(3, "0")}`;

  const dueInDays = parseInt(args.dueInDays || "7");
  const dueDate = new Date(Date.now() + dueInDays * 86400000);

  // Resolve products and calculate totals
  const invoiceItems: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    total: number;
    productName: string;
  }> = [];

  for (const item of parsedItems) {
    const product = await prisma.product.findFirst({
      where: {
        businessId: BUSINESS_ID,
        name: { contains: item.productName },
      },
    });

    if (!product) {
      return JSON.stringify({ error: `Product "${item.productName}" not found` });
    }

    const unitPrice = product.sellingPrice || product.costPrice;
    invoiceItems.push({
      productId: product.id,
      quantity: item.quantity,
      unitPrice,
      total: unitPrice * item.quantity,
      productName: product.name,
    });
  }

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + tax;

  // Create invoice with items
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      status: "SENT",
      subtotal,
      tax,
      total,
      dueDate,
      customerId: customer.id,
      businessId: BUSINESS_ID,
      items: {
        create: invoiceItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        })),
      },
    },
    include: { items: true, customer: true },
  });

  // Update inventory (reduce ingredient stock for made-to-order items)
  const inventoryUpdates: string[] = [];
  for (const item of invoiceItems) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (product && product.currentStock > 0) {
      // For raw materials, reduce stock
      const newStock = Math.max(0, product.currentStock - item.quantity);
      await prisma.product.update({
        where: { id: product.id },
        data: { currentStock: newStock },
      });
      await prisma.inventoryTransaction.create({
        data: {
          productId: product.id,
          type: "OUT",
          quantity: item.quantity,
          reason: `Invoice ${invoiceNumber} - sold to ${customer.name}`,
          businessId: BUSINESS_ID,
        },
      });
      inventoryUpdates.push(`${product.name}: -${item.quantity} ${product.unit}`);
    }
  }

  // Log AI activity
  await prisma.aIActivity.create({
    data: {
      type: "INVOICE_CREATED",
      status: "COMPLETED",
      title: `Invoice ${invoiceNumber} created`,
      description: `Created invoice for ${customer.name}: ${invoiceItems.map((i) => `${i.quantity}x ${i.productName}`).join(", ")}. Total: ₹${total.toLocaleString("en-IN")}`,
      toolUsed: "create_invoice",
      businessId: BUSINESS_ID,
    },
  });

  if (inventoryUpdates.length > 0) {
    await prisma.aIActivity.create({
      data: {
        type: "INVENTORY_UPDATED",
        status: "COMPLETED",
        title: `Inventory adjusted for ${invoiceNumber}`,
        description: `Auto-updated: ${inventoryUpdates.join(", ")}`,
        toolUsed: "update_inventory",
        businessId: BUSINESS_ID,
      },
    });
  }

  return JSON.stringify({
    success: true,
    invoice: {
      invoiceNumber,
      customer: customer.name,
      items: invoiceItems.map((i) => ({
        product: i.productName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        total: i.total,
      })),
      subtotal,
      tax,
      total,
      dueDate: dueDate.toISOString().split("T")[0],
      status: "SENT",
    },
    inventoryUpdates,
  });
}

export async function getFinancialOverview(args: {
  period?: string;
}): Promise<string> {
  const now = new Date();
  const period = args.period || "week";
  
  let startDate: Date;
  switch (period) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    default: // week
      startDate = new Date(now.getTime() - 7 * 86400000);
  }

  const invoices = await prisma.invoice.findMany({
    where: {
      businessId: BUSINESS_ID,
      createdAt: { gte: startDate },
    },
    include: { customer: true, payments: true },
  });

  const expenses = await prisma.expense.findMany({
    where: {
      businessId: BUSINESS_ID,
      date: { gte: startDate },
    },
  });

  const paidInvoices = invoices.filter((i) => i.status === "PAID");
  const overdueInvoices = invoices.filter((i) => i.status === "OVERDUE");
  const pendingInvoices = invoices.filter((i) => i.status === "SENT" || i.status === "DRAFT");

  const totalRevenue = paidInvoices.reduce((sum, i) => sum + i.total, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalOverdue = overdueInvoices.reduce((sum, i) => sum + i.total, 0);
  const totalPending = pendingInvoices.reduce((sum, i) => sum + i.total, 0);

  return JSON.stringify({
    period,
    revenue: totalRevenue,
    expenses: totalExpenses,
    profit: totalRevenue - totalExpenses,
    invoicesSummary: {
      total: invoices.length,
      paid: paidInvoices.length,
      overdue: overdueInvoices.length,
      pending: pendingInvoices.length,
    },
    overdueAmount: totalOverdue,
    pendingAmount: totalPending,
    topExpenseCategories: expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>),
    overdueDetails: overdueInvoices.map((i) => ({
      invoiceNumber: i.invoiceNumber,
      customer: i.customer.name,
      amount: i.total,
      daysOverdue: Math.floor((now.getTime() - i.dueDate.getTime()) / 86400000),
    })),
  });
}

export async function getOverdueInvoices(): Promise<string> {
  const now = new Date();
  const invoices = await prisma.invoice.findMany({
    where: {
      businessId: BUSINESS_ID,
      status: "OVERDUE",
    },
    include: { customer: true, items: { include: { product: true } } },
    orderBy: { dueDate: "asc" },
  });

  return JSON.stringify({
    count: invoices.length,
    totalAmount: invoices.reduce((sum, i) => sum + i.total, 0),
    invoices: invoices.map((inv) => ({
      invoiceNumber: inv.invoiceNumber,
      customer: inv.customer.name,
      total: inv.total,
      dueDate: inv.dueDate.toISOString().split("T")[0],
      daysOverdue: Math.floor((now.getTime() - inv.dueDate.getTime()) / 86400000),
      items: inv.items.map((item) => `${item.quantity}x ${item.product.name}`),
    })),
  });
}

export async function createPurchaseOrder(args: {
  vendorName: string;
  items: string;
}): Promise<string> {
  const vendor = await prisma.vendor.findFirst({
    where: {
      businessId: BUSINESS_ID,
      name: { contains: args.vendorName },
    },
  });

  if (!vendor) {
    return JSON.stringify({ error: `Vendor "${args.vendorName}" not found` });
  }

  let parsedItems: Array<{ productName: string; quantity: number }>;
  try {
    parsedItems = JSON.parse(args.items);
  } catch {
    return JSON.stringify({ error: "Invalid items format" });
  }

  const poCount = await prisma.purchaseOrder.count({ where: { businessId: BUSINESS_ID } });
  const orderNumber = `PO-2026-${String(poCount + 1).padStart(3, "0")}`;

  const poItems: Array<{
    productId: string;
    quantity: number;
    unitCost: number;
    total: number;
    productName: string;
  }> = [];

  for (const item of parsedItems) {
    const product = await prisma.product.findFirst({
      where: {
        businessId: BUSINESS_ID,
        name: { contains: item.productName },
      },
    });

    if (!product) {
      return JSON.stringify({ error: `Product "${item.productName}" not found` });
    }

    poItems.push({
      productId: product.id,
      quantity: item.quantity,
      unitCost: product.costPrice,
      total: product.costPrice * item.quantity,
      productName: product.name,
    });
  }

  const total = poItems.reduce((sum, item) => sum + item.total, 0);

  const po = await prisma.purchaseOrder.create({
    data: {
      orderNumber,
      status: "DRAFT",
      total,
      vendorId: vendor.id,
      businessId: BUSINESS_ID,
      items: {
        create: poItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitCost: item.unitCost,
          total: item.total,
        })),
      },
    },
  });

  await prisma.aIActivity.create({
    data: {
      type: "PURCHASE_ORDER",
      status: "COMPLETED",
      title: `Purchase order ${orderNumber} drafted`,
      description: `Drafted PO for ${vendor.name}: ${poItems.map((i) => `${i.quantity} ${i.productName}`).join(", ")}. Total: ₹${total.toLocaleString("en-IN")}`,
      toolUsed: "create_purchase_order",
      businessId: BUSINESS_ID,
    },
  });

  await prisma.notification.create({
    data: {
      type: "INFO",
      title: `Purchase order drafted`,
      message: `PO ${orderNumber} for ${vendor.name} — ₹${total.toLocaleString("en-IN")}. Review and approve.`,
      businessId: BUSINESS_ID,
    },
  });

  return JSON.stringify({
    success: true,
    purchaseOrder: {
      orderNumber,
      vendor: vendor.name,
      items: poItems.map((i) => ({
        product: i.productName,
        quantity: i.quantity,
        unitCost: i.unitCost,
        total: i.total,
      })),
      total,
      status: "DRAFT",
    },
  });
}

export async function sendPaymentReminder(args: {
  invoiceNumber?: string;
}): Promise<string> {
  let invoices;

  if (args.invoiceNumber) {
    invoices = await prisma.invoice.findMany({
      where: {
        businessId: BUSINESS_ID,
        invoiceNumber: args.invoiceNumber,
        status: "OVERDUE",
      },
      include: { customer: true },
    });
  } else {
    invoices = await prisma.invoice.findMany({
      where: {
        businessId: BUSINESS_ID,
        status: "OVERDUE",
      },
      include: { customer: true },
    });
  }

  if (invoices.length === 0) {
    return JSON.stringify({ message: "No overdue invoices found." });
  }

  const reminders = [];
  for (const inv of invoices) {
    const daysOverdue = Math.floor((Date.now() - inv.dueDate.getTime()) / 86400000);
    reminders.push({
      invoiceNumber: inv.invoiceNumber,
      customer: inv.customer.name,
      amount: inv.total,
      daysOverdue,
    });

    await prisma.aIActivity.create({
      data: {
        type: "PAYMENT_REMINDER",
        status: "COMPLETED",
        title: `Payment reminder: ${inv.invoiceNumber}`,
        description: `Sent reminder to ${inv.customer.name} for ₹${inv.total.toLocaleString("en-IN")} (${daysOverdue} days overdue)`,
        toolUsed: "send_payment_reminder",
        businessId: BUSINESS_ID,
      },
    });
  }

  return JSON.stringify({
    success: true,
    remindersSent: reminders.length,
    reminders,
  });
}

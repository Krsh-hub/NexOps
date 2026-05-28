// ============================================
// NexOps Finance Tool Implementations
// ============================================

import { supabase } from "@/lib/supabase";

const BUSINESS_ID = "biz_demo_001";

export async function createInvoice(args: {
  customerName: string;
  items: string;
  dueInDays?: string;
}): Promise<string> {
  // Find or create customer
  let { data: customers } = await supabase
    .from("customers")
    .select("*")
    .eq("businessId", BUSINESS_ID)
    .ilike("name", `%${args.customerName}%`)
    .limit(1);

  let customer = customers?.[0];

  if (!customer) {
    const { data: newCustomer } = await supabase
      .from("customers")
      .insert({
        name: args.customerName,
        businessId: BUSINESS_ID,
      })
      .select("*")
      .single();
    customer = newCustomer;
  }

  // Parse items
  let parsedItems: Array<{ productName: string; quantity: number }>;
  try {
    parsedItems = JSON.parse(args.items);
  } catch {
    return JSON.stringify({ error: "Invalid items format. Expected JSON array." });
  }

  // Get invoice count for numbering
  const { count: invoiceCount } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true })
    .eq("businessId", BUSINESS_ID);
    
  const orderCount = invoiceCount || 0;
  const invoiceNumber = `INV-2026-${String(orderCount + 1).padStart(3, "0")}`;

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
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .eq("businessId", BUSINESS_ID)
      .ilike("name", `%${item.productName}%`)
      .limit(1);
      
    const product = products?.[0];

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

  const subtotal = invoiceItems.reduce((sum: number, item: any) => sum + item.total, 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + tax;

  // Create invoice
  const { data: invoice } = await supabase
    .from("invoices")
    .insert({
      invoiceNumber,
      status: "SENT",
      subtotal,
      tax,
      total,
      dueDate: dueDate.toISOString(),
      customerId: customer.id,
      businessId: BUSINESS_ID,
    })
    .select("*")
    .single();

  if (!invoice) {
    return JSON.stringify({ error: "Failed to create invoice" });
  }

  // Create invoice items
  for (const item of invoiceItems) {
    await supabase.from("invoice_items").insert({
      invoiceId: invoice.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
    });
  }

  // Update inventory (reduce ingredient stock for made-to-order items)
  const inventoryUpdates: string[] = [];
  for (const item of invoiceItems) {
    const { data: product } = await supabase.from("products").select("*").eq("id", item.productId).single();
    if (product && product.currentStock > 0) {
      // For raw materials, reduce stock
      const newStock = Math.max(0, product.currentStock - item.quantity);
      
      await supabase.from("products").update({ currentStock: newStock }).eq("id", product.id);
      
      await supabase.from("inventory_transactions").insert({
        productId: product.id,
        type: "OUT",
        quantity: item.quantity,
        reason: `Invoice ${invoiceNumber} - sold to ${customer.name}`,
        businessId: BUSINESS_ID,
      });
      inventoryUpdates.push(`${product.name}: -${item.quantity} ${product.unit}`);
    }
  }

  // Log AI activity
  await supabase.from("ai_activities").insert({
    type: "INVOICE_CREATED",
    status: "COMPLETED",
    title: `Invoice ${invoiceNumber} created`,
    description: `Created invoice for ${customer.name}: ${invoiceItems.map((i) => `${i.quantity}x ${i.productName}`).join(", ")}. Total: ₹${total.toLocaleString("en-IN")}`,
    toolUsed: "create_invoice",
    businessId: BUSINESS_ID,
  });

  if (inventoryUpdates.length > 0) {
    await supabase.from("ai_activities").insert({
      type: "INVENTORY_UPDATED",
      status: "COMPLETED",
      title: `Inventory adjusted for ${invoiceNumber}`,
      description: `Auto-updated: ${inventoryUpdates.join(", ")}`,
      toolUsed: "update_inventory",
      businessId: BUSINESS_ID,
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

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, customer:customers(*), payments:payments(*)")
    .eq("businessId", BUSINESS_ID)
    .gte("createdAt", startDate.toISOString());

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .eq("businessId", BUSINESS_ID)
    .gte("date", startDate.toISOString());

  const validInvoices = invoices || [];
  const validExpenses = expenses || [];

  const paidInvoices = validInvoices.filter((i: any) => i.status === "PAID");
  const overdueInvoices = validInvoices.filter((i: any) => i.status === "OVERDUE");
  const pendingInvoices = validInvoices.filter((i: any) => i.status === "SENT" || i.status === "DRAFT");

  const totalRevenue = paidInvoices.reduce((sum: number, i: any) => sum + i.total, 0);
  const totalExpenses = validExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);
  const totalOverdue = overdueInvoices.reduce((sum: number, i: any) => sum + i.total, 0);
  const totalPending = pendingInvoices.reduce((sum: number, i: any) => sum + i.total, 0);

  return JSON.stringify({
    period,
    revenue: totalRevenue,
    expenses: totalExpenses,
    profit: totalRevenue - totalExpenses,
    invoicesSummary: {
      total: validInvoices.length,
      paid: paidInvoices.length,
      overdue: overdueInvoices.length,
      pending: pendingInvoices.length,
    },
    overdueAmount: totalOverdue,
    pendingAmount: totalPending,
    topExpenseCategories: validExpenses.reduce((acc: Record<string, number>, e: any) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>),
    overdueDetails: overdueInvoices.map((i: any) => ({
      invoiceNumber: i.invoiceNumber,
      customer: i.customer.name,
      amount: i.total,
      daysOverdue: Math.floor((now.getTime() - new Date(i.dueDate).getTime()) / 86400000),
    })),
  });
}

export async function getOverdueInvoices(): Promise<string> {
  const now = new Date();
  
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, customer:customers(*), items:invoice_items(*, product:products(*))")
    .eq("businessId", BUSINESS_ID)
    .eq("status", "OVERDUE")
    .order("dueDate", { ascending: true });

  const validInvoices = invoices || [];

  return JSON.stringify({
    count: validInvoices.length,
    totalAmount: validInvoices.reduce((sum: number, i: any) => sum + i.total, 0),
    invoices: validInvoices.map((inv: any) => ({
      invoiceNumber: inv.invoiceNumber,
      customer: inv.customer.name,
      total: inv.total,
      dueDate: new Date(inv.dueDate).toISOString().split("T")[0],
      daysOverdue: Math.floor((now.getTime() - new Date(inv.dueDate).getTime()) / 86400000),
      items: (inv.items || []).map((item: any) => `${item.quantity}x ${item.product?.name}`),
    })),
  });
}

export async function createPurchaseOrder(args: {
  vendorName: string;
  items: string;
}): Promise<string> {
  const { data: vendors } = await supabase
    .from("vendors")
    .select("*")
    .eq("businessId", BUSINESS_ID)
    .ilike("name", `%${args.vendorName}%`)
    .limit(1);

  const vendor = vendors?.[0];

  if (!vendor) {
    return JSON.stringify({ error: `Vendor "${args.vendorName}" not found` });
  }

  let parsedItems: Array<{ productName: string; quantity: number }>;
  try {
    parsedItems = JSON.parse(args.items);
  } catch {
    return JSON.stringify({ error: "Invalid items format" });
  }

  const { count: poCount } = await supabase
    .from("purchase_orders")
    .select("*", { count: "exact", head: true })
    .eq("businessId", BUSINESS_ID);
    
  const orderNumber = `PO-2026-${String((poCount || 0) + 1).padStart(3, "0")}`;

  const poItems: Array<{
    productId: string;
    quantity: number;
    unitCost: number;
    total: number;
    productName: string;
  }> = [];

  for (const item of parsedItems) {
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .eq("businessId", BUSINESS_ID)
      .ilike("name", `%${item.productName}%`)
      .limit(1);
      
    const product = products?.[0];

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

  const total = poItems.reduce((sum: number, item: any) => sum + item.total, 0);

  // Create PO
  const { data: po } = await supabase
    .from("purchase_orders")
    .insert({
      orderNumber,
      status: "DRAFT",
      total,
      vendorId: vendor.id,
      businessId: BUSINESS_ID,
    })
    .select("*")
    .single();

  if (!po) {
    return JSON.stringify({ error: "Failed to create PO" });
  }

  // Create PO Items
  for (const item of poItems) {
    await supabase.from("purchase_order_items").insert({
      purchaseOrderId: po.id,
      productId: item.productId,
      quantity: item.quantity,
      unitCost: item.unitCost,
      total: item.total,
    });
  }

  await supabase.from("ai_activities").insert({
    type: "PURCHASE_ORDER",
    status: "COMPLETED",
    title: `Purchase order ${orderNumber} drafted`,
    description: `Drafted PO for ${vendor.name}: ${poItems.map((i) => `${i.quantity} ${i.productName}`).join(", ")}. Total: ₹${total.toLocaleString("en-IN")}`,
    toolUsed: "create_purchase_order",
    businessId: BUSINESS_ID,
  });

  await supabase.from("notifications").insert({
    type: "INFO",
    title: `Purchase order drafted`,
    message: `PO ${orderNumber} for ${vendor.name} — ₹${total.toLocaleString("en-IN")}. Review and approve.`,
    businessId: BUSINESS_ID,
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
  let invoicesQuery = supabase
    .from("invoices")
    .select("*, customer:customers(*)")
    .eq("businessId", BUSINESS_ID)
    .eq("status", "OVERDUE");

  if (args.invoiceNumber) {
    invoicesQuery = invoicesQuery.eq("invoiceNumber", args.invoiceNumber);
  }

  const { data: invoices } = await invoicesQuery;
  const validInvoices = invoices || [];

  if (validInvoices.length === 0) {
    return JSON.stringify({ message: "No overdue invoices found." });
  }

  const reminders = [];
  for (const inv of validInvoices) {
    const daysOverdue = Math.floor((Date.now() - new Date(inv.dueDate).getTime()) / 86400000);
    reminders.push({
      invoiceNumber: inv.invoiceNumber,
      customer: inv.customer.name,
      amount: inv.total,
      daysOverdue,
    });

    await supabase.from("ai_activities").insert({
      type: "PAYMENT_REMINDER",
      status: "COMPLETED",
      title: `Payment reminder: ${inv.invoiceNumber}`,
      description: `Sent reminder to ${inv.customer.name} for ₹${inv.total.toLocaleString("en-IN")} (${daysOverdue} days overdue)`,
      toolUsed: "send_payment_reminder",
      businessId: BUSINESS_ID,
    });
  }

  return JSON.stringify({
    success: true,
    remindersSent: reminders.length,
    reminders,
  });
}

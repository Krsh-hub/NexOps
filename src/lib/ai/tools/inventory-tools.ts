// ============================================
// NexOps Inventory Tool Implementations
// ============================================

import { supabase } from "@/lib/supabase";

const BUSINESS_ID = "biz_demo_001";

export async function updateInventory(args: {
  productName: string;
  quantity: string;
  reason: string;
}): Promise<string> {
  const qty = parseFloat(args.quantity);
  
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("businessId", BUSINESS_ID)
    .ilike("name", `%${args.productName}%`)
    .limit(1);

  const product = products?.[0];

  if (!product) {
    return JSON.stringify({ error: `Product "${args.productName}" not found` });
  }

  const newStock = product.currentStock + qty;
  
  await supabase
    .from("products")
    .update({ currentStock: Math.max(0, newStock), updatedAt: new Date().toISOString() })
    .eq("id", product.id);

  await supabase.from("inventory_transactions").insert({
    productId: product.id,
    type: qty > 0 ? "IN" : "OUT",
    quantity: Math.abs(qty),
    reason: args.reason,
    businessId: BUSINESS_ID,
  });

  await supabase.from("ai_activities").insert({
    type: "INVENTORY_UPDATED",
    status: "COMPLETED",
    title: `Inventory updated: ${product.name}`,
    description: `${qty > 0 ? "Added" : "Removed"} ${Math.abs(qty)} ${product.unit} of ${product.name}. New stock: ${Math.max(0, newStock)} ${product.unit}. Reason: ${args.reason}`,
    toolUsed: "update_inventory",
    businessId: BUSINESS_ID,
  });

  return JSON.stringify({
    success: true,
    product: product.name,
    previousStock: product.currentStock,
    newStock: Math.max(0, newStock),
    unit: product.unit,
    change: qty,
  });
}

export async function detectLowStock(): Promise<string> {
  const { data: products } = await supabase
    .from("products")
    .select("*, vendor:vendors(*)")
    .eq("businessId", BUSINESS_ID)
    .eq("isActive", true)
    .gt("reorderThreshold", 0);

  const lowStockItems = ((products as any[]) || [])
    .filter((p) => p.currentStock <= p.reorderThreshold)
    .map((p) => ({
      name: p.name,
      currentStock: p.currentStock,
      reorderThreshold: p.reorderThreshold,
      reorderQuantity: p.reorderQuantity,
      unit: p.unit,
      vendor: p.vendor?.name || "No vendor assigned",
      estimatedDaysLeft: p.currentStock > 0 ? Math.round((p.currentStock / (p.reorderThreshold * 0.5)) * 10) / 10 : 0,
      severity: p.currentStock <= p.reorderThreshold * 0.3 ? "CRITICAL" : "WARNING",
    }));

  if (lowStockItems.length > 0) {
    for (const item of lowStockItems) {
      if (item.severity === "CRITICAL") {
        await supabase.from("notifications").insert({
          type: "CRITICAL",
          title: `Critical: ${item.name} stock`,
          message: `${item.name} is at ${item.currentStock} ${item.unit} — ${item.estimatedDaysLeft} days until depletion.`,
          businessId: BUSINESS_ID,
        });
      }
    }
  }

  return JSON.stringify({
    totalProducts: (products || []).length,
    lowStockCount: lowStockItems.length,
    items: lowStockItems,
  });
}

export async function getInventoryStatus(args: {
  productName?: string;
}): Promise<string> {
  if (args.productName) {
    const { data: products } = await supabase
      .from("products")
      .select("*, vendor:vendors(*)")
      .eq("businessId", BUSINESS_ID)
      .ilike("name", `%${args.productName}%`)
      .limit(1);

    const product = products?.[0];

    if (!product) {
      return JSON.stringify({ error: `Product "${args.productName}" not found` });
    }

    const { data: recentTransactions } = await supabase
      .from("inventory_transactions")
      .select("*")
      .eq("productId", product.id)
      .order("createdAt", { ascending: false })
      .limit(5);

    return JSON.stringify({
      product: {
        name: product.name,
        sku: product.sku,
        category: product.category,
        currentStock: product.currentStock,
        unit: product.unit,
        reorderThreshold: product.reorderThreshold,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        vendor: product.vendor?.name,
        status: product.currentStock <= 0 ? "OUT_OF_STOCK"
          : product.currentStock <= product.reorderThreshold * 0.3 ? "CRITICAL"
          : product.currentStock <= product.reorderThreshold ? "LOW"
          : "HEALTHY",
      },
      recentTransactions: ((recentTransactions as any[]) || []).map((t) => ({
        type: t.type,
        quantity: t.quantity,
        reason: t.reason,
        date: t.createdAt,
      })),
    });
  }

  const { data: products } = await supabase
    .from("products")
    .select("*, vendor:vendors(*)")
    .eq("businessId", BUSINESS_ID)
    .eq("isActive", true)
    .order("name", { ascending: true });
    
  const validProducts = (products as any[]) || [];

  const summary = {
    totalProducts: validProducts.length,
    healthyStock: validProducts.filter((p) => p.reorderThreshold === 0 || p.currentStock > p.reorderThreshold).length,
    lowStock: validProducts.filter((p) => p.reorderThreshold > 0 && p.currentStock > 0 && p.currentStock <= p.reorderThreshold).length,
    criticalStock: validProducts.filter((p) => p.reorderThreshold > 0 && p.currentStock > 0 && p.currentStock <= p.reorderThreshold * 0.3).length,
    outOfStock: validProducts.filter((p) => p.reorderThreshold > 0 && p.currentStock <= 0).length,
    products: validProducts.map((p) => ({
      name: p.name,
      stock: `${p.currentStock} ${p.unit}`,
      status: p.reorderThreshold === 0 ? "N/A"
        : p.currentStock <= 0 ? "OUT_OF_STOCK"
        : p.currentStock <= p.reorderThreshold * 0.3 ? "CRITICAL"
        : p.currentStock <= p.reorderThreshold ? "LOW"
        : "HEALTHY",
    })),
  };

  return JSON.stringify(summary);
}

export async function searchProducts(args: { query: string }): Promise<string> {
  // Using an OR clause for multiple fields using postgrest or syntax
  const { data: products } = await supabase
    .from("products")
    .select("*, vendor:vendors(*)")
    .eq("businessId", BUSINESS_ID)
    .eq("isActive", true)
    .or(`name.ilike.%${args.query}%,category.ilike.%${args.query}%,sku.ilike.%${args.query}%`);

  return JSON.stringify({
    count: (products || []).length,
    products: ((products as any[]) || []).map((p) => ({
      name: p.name,
      sku: p.sku,
      category: p.category,
      currentStock: `${p.currentStock} ${p.unit}`,
      costPrice: p.costPrice,
      sellingPrice: p.sellingPrice,
      vendor: p.vendor?.name,
    })),
  });
}

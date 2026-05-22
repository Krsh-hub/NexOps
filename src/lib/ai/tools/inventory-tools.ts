// ============================================
// NexOps Inventory Tool Implementations
// ============================================

import { prisma } from "@/lib/prisma";

const BUSINESS_ID = "biz_demo_001";

export async function updateInventory(args: {
  productName: string;
  quantity: string;
  reason: string;
}): Promise<string> {
  const qty = parseFloat(args.quantity);
  
  const product = await prisma.product.findFirst({
    where: {
      businessId: BUSINESS_ID,
      name: { contains: args.productName },
    },
  });

  if (!product) {
    return JSON.stringify({ error: `Product "${args.productName}" not found` });
  }

  const newStock = product.currentStock + qty;
  
  await prisma.product.update({
    where: { id: product.id },
    data: { currentStock: Math.max(0, newStock) },
  });

  await prisma.inventoryTransaction.create({
    data: {
      productId: product.id,
      type: qty > 0 ? "IN" : "OUT",
      quantity: Math.abs(qty),
      reason: args.reason,
      businessId: BUSINESS_ID,
    },
  });

  await prisma.aIActivity.create({
    data: {
      type: "INVENTORY_UPDATED",
      status: "COMPLETED",
      title: `Inventory updated: ${product.name}`,
      description: `${qty > 0 ? "Added" : "Removed"} ${Math.abs(qty)} ${product.unit} of ${product.name}. New stock: ${Math.max(0, newStock)} ${product.unit}. Reason: ${args.reason}`,
      toolUsed: "update_inventory",
      businessId: BUSINESS_ID,
    },
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
  const products = await prisma.product.findMany({
    where: {
      businessId: BUSINESS_ID,
      isActive: true,
      reorderThreshold: { gt: 0 },
    },
    include: { vendor: true },
  });

  const lowStockItems = products
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
        await prisma.notification.create({
          data: {
            type: "CRITICAL",
            title: `Critical: ${item.name} stock`,
            message: `${item.name} is at ${item.currentStock} ${item.unit} — ${item.estimatedDaysLeft} days until depletion.`,
            businessId: BUSINESS_ID,
          },
        });
      }
    }
  }

  return JSON.stringify({
    totalProducts: products.length,
    lowStockCount: lowStockItems.length,
    items: lowStockItems,
  });
}

export async function getInventoryStatus(args: {
  productName?: string;
}): Promise<string> {
  if (args.productName) {
    const product = await prisma.product.findFirst({
      where: {
        businessId: BUSINESS_ID,
        name: { contains: args.productName },
      },
      include: { vendor: true },
    });

    if (!product) {
      return JSON.stringify({ error: `Product "${args.productName}" not found` });
    }

    const recentTransactions = await prisma.inventoryTransaction.findMany({
      where: { productId: product.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

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
      recentTransactions: recentTransactions.map((t) => ({
        type: t.type,
        quantity: t.quantity,
        reason: t.reason,
        date: t.createdAt.toISOString(),
      })),
    });
  }

  const products = await prisma.product.findMany({
    where: { businessId: BUSINESS_ID, isActive: true },
    include: { vendor: true },
    orderBy: { name: "asc" },
  });

  const summary = {
    totalProducts: products.length,
    healthyStock: products.filter((p) => p.reorderThreshold === 0 || p.currentStock > p.reorderThreshold).length,
    lowStock: products.filter((p) => p.reorderThreshold > 0 && p.currentStock > 0 && p.currentStock <= p.reorderThreshold).length,
    criticalStock: products.filter((p) => p.reorderThreshold > 0 && p.currentStock > 0 && p.currentStock <= p.reorderThreshold * 0.3).length,
    outOfStock: products.filter((p) => p.reorderThreshold > 0 && p.currentStock <= 0).length,
    products: products.map((p) => ({
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
  const products = await prisma.product.findMany({
    where: {
      businessId: BUSINESS_ID,
      isActive: true,
      OR: [
        { name: { contains: args.query } },
        { category: { contains: args.query } },
        { sku: { contains: args.query } },
      ],
    },
    include: { vendor: true },
  });

  return JSON.stringify({
    count: products.length,
    products: products.map((p) => ({
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

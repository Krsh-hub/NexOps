import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient({ log: ["error"] });

async function main() {
  console.log("🌱 Seeding NexOps database...");

  // Clean existing data
  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.purchaseOrderItem.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.inventoryTransaction.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.aIActivity.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.business.deleteMany();

  // Create Business
  const business = await prisma.business.create({
    data: {
      id: "biz_demo_001",
      name: "Brew & Bite Café",
      type: "cafe",
      currency: "INR",
    },
  });

  console.log("✅ Business created:", business.name);

  // Create Vendors
  const vendors = await Promise.all([
    prisma.vendor.create({
      data: {
        id: "vendor_001",
        name: "Fresh Dairy Farms",
        email: "orders@freshdairy.in",
        phone: "+91 98765 43210",
        address: "Plot 12, Dairy Lane, Anand, Gujarat",
        businessId: business.id,
      },
    }),
    prisma.vendor.create({
      data: {
        id: "vendor_002",
        name: "Premium Coffee Traders",
        email: "supply@premiumcoffee.in",
        phone: "+91 98765 43211",
        address: "23, Coffee Board Layout, Chikmagalur",
        businessId: business.id,
      },
    }),
    prisma.vendor.create({
      data: {
        id: "vendor_003",
        name: "Metro Packaging Co.",
        email: "sales@metropack.in",
        phone: "+91 98765 43212",
        address: "Industrial Area Phase 2, Pune",
        businessId: business.id,
      },
    }),
    prisma.vendor.create({
      data: {
        id: "vendor_004",
        name: "Spice Route Suppliers",
        email: "info@spiceroute.in",
        phone: "+91 98765 43213",
        address: "Fort Kochi, Ernakulam, Kerala",
        businessId: business.id,
      },
    }),
  ]);

  console.log("✅ Vendors created:", vendors.length);

  // Create Products with realistic café inventory
  const products = await Promise.all([
    // Beverages - Ingredients
    prisma.product.create({
      data: {
        id: "prod_001",
        name: "Whole Milk",
        sku: "BEV-MLK-001",
        category: "Dairy",
        unit: "liters",
        currentStock: 18, // Intentionally low for demo
        reorderThreshold: 20,
        reorderQuantity: 100,
        costPrice: 56,
        sellingPrice: 0,
        businessId: business.id,
        vendorId: vendors[0].id,
      },
    }),
    prisma.product.create({
      data: {
        id: "prod_002",
        name: "Coffee Powder (Arabica)",
        sku: "BEV-COF-001",
        category: "Coffee",
        unit: "kg",
        currentStock: 8,
        reorderThreshold: 5,
        reorderQuantity: 25,
        costPrice: 800,
        sellingPrice: 0,
        businessId: business.id,
        vendorId: vendors[1].id,
      },
    }),
    prisma.product.create({
      data: {
        id: "prod_003",
        name: "Sugar",
        sku: "BEV-SUG-001",
        category: "Essentials",
        unit: "kg",
        currentStock: 25,
        reorderThreshold: 10,
        reorderQuantity: 50,
        costPrice: 42,
        sellingPrice: 0,
        businessId: business.id,
        vendorId: vendors[3].id,
      },
    }),
    prisma.product.create({
      data: {
        id: "prod_004",
        name: "Chocolate Syrup",
        sku: "BEV-CHO-001",
        category: "Syrups",
        unit: "liters",
        currentStock: 3, // Critical low
        reorderThreshold: 5,
        reorderQuantity: 20,
        costPrice: 350,
        sellingPrice: 0,
        businessId: business.id,
        vendorId: vendors[3].id,
      },
    }),
    prisma.product.create({
      data: {
        id: "prod_005",
        name: "Vanilla Extract",
        sku: "BEV-VAN-001",
        category: "Syrups",
        unit: "liters",
        currentStock: 2, // Critical low
        reorderThreshold: 3,
        reorderQuantity: 10,
        costPrice: 1200,
        sellingPrice: 0,
        businessId: business.id,
        vendorId: vendors[3].id,
      },
    }),

    // Finished Products (for selling)
    prisma.product.create({
      data: {
        id: "prod_006",
        name: "Cold Coffee",
        sku: "FIN-CC-001",
        category: "Beverages",
        unit: "cups",
        currentStock: 0, // Made to order
        reorderThreshold: 0,
        reorderQuantity: 0,
        costPrice: 35,
        sellingPrice: 150,
        businessId: business.id,
      },
    }),
    prisma.product.create({
      data: {
        id: "prod_007",
        name: "Espresso",
        sku: "FIN-ESP-001",
        category: "Beverages",
        unit: "cups",
        currentStock: 0,
        reorderThreshold: 0,
        reorderQuantity: 0,
        costPrice: 20,
        sellingPrice: 120,
        businessId: business.id,
      },
    }),
    prisma.product.create({
      data: {
        id: "prod_008",
        name: "Cappuccino",
        sku: "FIN-CAP-001",
        category: "Beverages",
        unit: "cups",
        currentStock: 0,
        reorderThreshold: 0,
        reorderQuantity: 0,
        costPrice: 30,
        sellingPrice: 160,
        businessId: business.id,
      },
    }),
    prisma.product.create({
      data: {
        id: "prod_009",
        name: "Hot Chocolate",
        sku: "FIN-HC-001",
        category: "Beverages",
        unit: "cups",
        currentStock: 0,
        reorderThreshold: 0,
        reorderQuantity: 0,
        costPrice: 40,
        sellingPrice: 170,
        businessId: business.id,
      },
    }),

    // Food Items
    prisma.product.create({
      data: {
        id: "prod_010",
        name: "Paneer Sandwich",
        sku: "FD-PS-001",
        category: "Food",
        unit: "pcs",
        currentStock: 15,
        reorderThreshold: 10,
        reorderQuantity: 30,
        costPrice: 60,
        sellingPrice: 180,
        businessId: business.id,
      },
    }),
    prisma.product.create({
      data: {
        id: "prod_011",
        name: "Chocolate Brownie",
        sku: "FD-CB-001",
        category: "Bakery",
        unit: "pcs",
        currentStock: 22,
        reorderThreshold: 15,
        reorderQuantity: 40,
        costPrice: 45,
        sellingPrice: 150,
        businessId: business.id,
      },
    }),
    prisma.product.create({
      data: {
        id: "prod_012",
        name: "Croissant",
        sku: "FD-CR-001",
        category: "Bakery",
        unit: "pcs",
        currentStock: 8, // Low
        reorderThreshold: 12,
        reorderQuantity: 36,
        costPrice: 35,
        sellingPrice: 120,
        businessId: business.id,
      },
    }),

    // Packaging
    prisma.product.create({
      data: {
        id: "prod_013",
        name: "Paper Cups (12oz)",
        sku: "PKG-PC-001",
        category: "Packaging",
        unit: "pcs",
        currentStock: 450,
        reorderThreshold: 200,
        reorderQuantity: 1000,
        costPrice: 3,
        sellingPrice: 0,
        businessId: business.id,
        vendorId: vendors[2].id,
      },
    }),
    prisma.product.create({
      data: {
        id: "prod_014",
        name: "Takeaway Boxes",
        sku: "PKG-TB-001",
        category: "Packaging",
        unit: "pcs",
        currentStock: 180,
        reorderThreshold: 100,
        reorderQuantity: 500,
        costPrice: 8,
        sellingPrice: 0,
        businessId: business.id,
        vendorId: vendors[2].id,
      },
    }),
    prisma.product.create({
      data: {
        id: "prod_015",
        name: "Napkins",
        sku: "PKG-NP-001",
        category: "Packaging",
        unit: "pcs",
        currentStock: 800,
        reorderThreshold: 300,
        reorderQuantity: 2000,
        costPrice: 0.5,
        sellingPrice: 0,
        businessId: business.id,
        vendorId: vendors[2].id,
      },
    }),
  ]);

  console.log("✅ Products created:", products.length);

  // Create Customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        id: "cust_001",
        name: "XYZ Cafe",
        email: "orders@xyzcafe.in",
        phone: "+91 99887 76655",
        address: "MG Road, Bangalore",
        businessId: business.id,
      },
    }),
    prisma.customer.create({
      data: {
        id: "cust_002",
        name: "Downtown Bistro",
        email: "manager@downtownbistro.in",
        phone: "+91 99887 76656",
        address: "Indiranagar, Bangalore",
        businessId: business.id,
      },
    }),
    prisma.customer.create({
      data: {
        id: "cust_003",
        name: "CloudKitchen Co.",
        email: "procurement@cloudkitchen.in",
        phone: "+91 99887 76657",
        address: "HSR Layout, Bangalore",
        businessId: business.id,
      },
    }),
    prisma.customer.create({
      data: {
        id: "cust_004",
        name: "Office Pantry Solutions",
        email: "orders@officepantry.in",
        phone: "+91 99887 76658",
        address: "Whitefield, Bangalore",
        businessId: business.id,
      },
    }),
    prisma.customer.create({
      data: {
        id: "cust_005",
        name: "Green Valley Resort",
        email: "fb@greenvalley.in",
        phone: "+91 99887 76659",
        address: "Coorg, Karnataka",
        businessId: business.id,
      },
    }),
  ]);

  console.log("✅ Customers created:", customers.length);

  // Create recent Invoices
  const today = new Date();
  const invoices = await Promise.all([
    // Paid invoice - 3 days ago
    prisma.invoice.create({
      data: {
        id: "inv_001",
        invoiceNumber: "INV-2026-001",
        status: "PAID",
        subtotal: 6000,
        tax: 1080,
        total: 7080,
        dueDate: new Date(today.getTime() - 1 * 86400000),
        paidAt: new Date(today.getTime() - 2 * 86400000),
        customerId: customers[0].id,
        businessId: business.id,
        createdAt: new Date(today.getTime() - 3 * 86400000),
        items: {
          create: [
            { productId: "prod_006", quantity: 20, unitPrice: 150, total: 3000 },
            { productId: "prod_007", quantity: 25, unitPrice: 120, total: 3000 },
          ],
        },
        payments: {
          create: [
            { amount: 7080, method: "UPI", paidAt: new Date(today.getTime() - 2 * 86400000) },
          ],
        },
      },
    }),
    // Paid invoice - 2 days ago
    prisma.invoice.create({
      data: {
        id: "inv_002",
        invoiceNumber: "INV-2026-002",
        status: "PAID",
        subtotal: 8400,
        tax: 1512,
        total: 9912,
        dueDate: new Date(today.getTime() + 5 * 86400000),
        paidAt: new Date(today.getTime() - 1 * 86400000),
        customerId: customers[1].id,
        businessId: business.id,
        createdAt: new Date(today.getTime() - 2 * 86400000),
        items: {
          create: [
            { productId: "prod_008", quantity: 30, unitPrice: 160, total: 4800 },
            { productId: "prod_010", quantity: 20, unitPrice: 180, total: 3600 },
          ],
        },
        payments: {
          create: [
            { amount: 9912, method: "BANK_TRANSFER", paidAt: new Date(today.getTime() - 1 * 86400000) },
          ],
        },
      },
    }),
    // Overdue invoice - 18 days old
    prisma.invoice.create({
      data: {
        id: "inv_003",
        invoiceNumber: "INV-2026-003",
        status: "OVERDUE",
        subtotal: 24000,
        tax: 4320,
        total: 28320,
        dueDate: new Date(today.getTime() - 3 * 86400000),
        customerId: customers[2].id,
        businessId: business.id,
        createdAt: new Date(today.getTime() - 18 * 86400000),
        items: {
          create: [
            { productId: "prod_006", quantity: 80, unitPrice: 150, total: 12000 },
            { productId: "prod_008", quantity: 50, unitPrice: 160, total: 8000 },
            { productId: "prod_011", quantity: 40, unitPrice: 100, total: 4000 },
          ],
        },
      },
    }),
    // Overdue invoice - 20 days old
    prisma.invoice.create({
      data: {
        id: "inv_004",
        invoiceNumber: "INV-2026-004",
        status: "OVERDUE",
        subtotal: 36000,
        tax: 6480,
        total: 42480,
        dueDate: new Date(today.getTime() - 5 * 86400000),
        customerId: customers[3].id,
        businessId: business.id,
        createdAt: new Date(today.getTime() - 20 * 86400000),
        items: {
          create: [
            { productId: "prod_006", quantity: 100, unitPrice: 150, total: 15000 },
            { productId: "prod_007", quantity: 100, unitPrice: 120, total: 12000 },
            { productId: "prod_009", quantity: 50, unitPrice: 170, total: 8500 },
          ],
        },
      },
    }),
    // Sent invoice - yesterday
    prisma.invoice.create({
      data: {
        id: "inv_005",
        invoiceNumber: "INV-2026-005",
        status: "SENT",
        subtotal: 12000,
        tax: 2160,
        total: 14160,
        dueDate: new Date(today.getTime() + 7 * 86400000),
        customerId: customers[4].id,
        businessId: business.id,
        createdAt: new Date(today.getTime() - 1 * 86400000),
        items: {
          create: [
            { productId: "prod_006", quantity: 40, unitPrice: 150, total: 6000 },
            { productId: "prod_008", quantity: 20, unitPrice: 160, total: 3200 },
            { productId: "prod_010", quantity: 15, unitPrice: 180, total: 2700 },
          ],
        },
      },
    }),
  ]);

  console.log("✅ Invoices created:", invoices.length);

  // Create Inventory Transactions
  const now = Date.now();
  await Promise.all([
    prisma.inventoryTransaction.create({
      data: {
        productId: "prod_001",
        type: "IN",
        quantity: 100,
        reason: "Vendor delivery - Fresh Dairy Farms",
        businessId: business.id,
        createdAt: new Date(now - 5 * 86400000),
      },
    }),
    prisma.inventoryTransaction.create({
      data: {
        productId: "prod_001",
        type: "OUT",
        quantity: 82,
        reason: "Daily consumption - beverages",
        businessId: business.id,
        createdAt: new Date(now - 1 * 86400000),
      },
    }),
    prisma.inventoryTransaction.create({
      data: {
        productId: "prod_002",
        type: "IN",
        quantity: 20,
        reason: "Vendor delivery - Premium Coffee Traders",
        businessId: business.id,
        createdAt: new Date(now - 7 * 86400000),
      },
    }),
    prisma.inventoryTransaction.create({
      data: {
        productId: "prod_002",
        type: "OUT",
        quantity: 12,
        reason: "Weekly consumption",
        businessId: business.id,
        createdAt: new Date(now - 1 * 86400000),
      },
    }),
    prisma.inventoryTransaction.create({
      data: {
        productId: "prod_004",
        type: "OUT",
        quantity: 7,
        reason: "Hot chocolate & dessert preparation",
        businessId: business.id,
        createdAt: new Date(now - 2 * 86400000),
      },
    }),
  ]);

  console.log("✅ Inventory transactions created");

  // Create Expenses
  await Promise.all([
    prisma.expense.create({
      data: {
        category: "Rent",
        description: "Monthly shop rent",
        amount: 45000,
        date: new Date(today.getFullYear(), today.getMonth(), 1),
        businessId: business.id,
      },
    }),
    prisma.expense.create({
      data: {
        category: "Utilities",
        description: "Electricity bill",
        amount: 8500,
        date: new Date(now - 5 * 86400000),
        businessId: business.id,
      },
    }),
    prisma.expense.create({
      data: {
        category: "Salaries",
        description: "Staff salaries - May 2026",
        amount: 120000,
        date: new Date(today.getFullYear(), today.getMonth(), 1),
        businessId: business.id,
      },
    }),
    prisma.expense.create({
      data: {
        category: "Maintenance",
        description: "Coffee machine servicing",
        amount: 5500,
        date: new Date(now - 3 * 86400000),
        businessId: business.id,
      },
    }),
    prisma.expense.create({
      data: {
        category: "Marketing",
        description: "Social media campaign",
        amount: 15000,
        date: new Date(now - 7 * 86400000),
        businessId: business.id,
      },
    }),
  ]);

  console.log("✅ Expenses created");

  // Create AI Activities
  await Promise.all([
    prisma.aIActivity.create({
      data: {
        type: "LOW_STOCK_ALERT",
        status: "COMPLETED",
        title: "Low stock detected: Chocolate Syrup",
        description: "Chocolate Syrup inventory is at 3 liters, below the reorder threshold of 5 liters. Estimated depletion in 1.5 days.",
        toolUsed: "detect_low_stock",
        businessId: business.id,
        createdAt: new Date(now - 2 * 3600000),
      },
    }),
    prisma.aIActivity.create({
      data: {
        type: "INVOICE_CREATED",
        status: "COMPLETED",
        title: "Invoice INV-2026-005 created",
        description: "Created invoice for Green Valley Resort: 40 Cold Coffees, 20 Cappuccinos, 15 Paneer Sandwiches. Total: ₹14,160",
        toolUsed: "create_invoice",
        businessId: business.id,
        createdAt: new Date(now - 4 * 3600000),
      },
    }),
    prisma.aIActivity.create({
      data: {
        type: "PAYMENT_REMINDER",
        status: "COMPLETED",
        title: "Payment reminder sent",
        description: "Sent overdue payment reminder to CloudKitchen Co. for Invoice INV-2026-003 (₹28,320, 18 days overdue)",
        toolUsed: "send_payment_reminder",
        businessId: business.id,
        createdAt: new Date(now - 6 * 3600000),
      },
    }),
    prisma.aIActivity.create({
      data: {
        type: "DAILY_SUMMARY",
        status: "COMPLETED",
        title: "Daily operations summary",
        description: "Revenue today: ₹16,992 (+12% vs yesterday). 5 invoices processed. 2 overdue invoices flagged. Milk stock running low.",
        toolUsed: "generate_summary",
        businessId: business.id,
        createdAt: new Date(now - 8 * 3600000),
      },
    }),
    prisma.aIActivity.create({
      data: {
        type: "INVENTORY_UPDATED",
        status: "COMPLETED",
        title: "Inventory auto-adjusted",
        description: "Reduced Whole Milk by 8.2L, Coffee Powder by 1.2kg, Sugar by 3kg based on invoice INV-2026-005",
        toolUsed: "update_inventory",
        businessId: business.id,
        createdAt: new Date(now - 4 * 3600000),
      },
    }),
    prisma.aIActivity.create({
      data: {
        type: "ANOMALY_DETECTED",
        status: "COMPLETED",
        title: "Unusual consumption pattern",
        description: "Coffee powder consumption increased 18% this week compared to the 30-day average. This may indicate increased demand or waste.",
        toolUsed: "generate_summary",
        businessId: business.id,
        createdAt: new Date(now - 12 * 3600000),
      },
    }),
  ]);

  console.log("✅ AI Activities created");

  // Create Notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        type: "CRITICAL",
        title: "Milk inventory critical",
        message: "Whole Milk stock is at 18L — below reorder threshold of 20L. May run out in 2 days based on current demand.",
        read: false,
        businessId: business.id,
        createdAt: new Date(now - 1 * 3600000),
      },
    }),
    prisma.notification.create({
      data: {
        type: "WARNING",
        title: "2 invoices overdue",
        message: "INV-2026-003 (₹28,320) and INV-2026-004 (₹42,480) are overdue. Total outstanding: ₹70,800.",
        read: false,
        businessId: business.id,
        createdAt: new Date(now - 3 * 3600000),
      },
    }),
    prisma.notification.create({
      data: {
        type: "SUCCESS",
        title: "Revenue milestone reached",
        message: "Daily revenue crossed ₹15,000 today — a 12% increase from yesterday. Keep up the momentum!",
        read: false,
        businessId: business.id,
        createdAt: new Date(now - 5 * 3600000),
      },
    }),
    prisma.notification.create({
      data: {
        type: "WARNING",
        title: "Chocolate Syrup running low",
        message: "Only 3L remaining. Consider placing a reorder with Spice Route Suppliers.",
        read: true,
        businessId: business.id,
        createdAt: new Date(now - 8 * 3600000),
      },
    }),
    prisma.notification.create({
      data: {
        type: "INFO",
        title: "Purchase order drafted",
        message: "AI has drafted PO for Whole Milk (100L) from Fresh Dairy Farms. Review and approve.",
        read: false,
        businessId: business.id,
        createdAt: new Date(now - 1 * 3600000),
      },
    }),
  ]);

  console.log("✅ Notifications created");
  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

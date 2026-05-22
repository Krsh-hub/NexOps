import { PrismaClient } from "../src/generated/prisma/index.js";

// @ts-ignore
const prisma = new PrismaClient({ log: ["error"] });

async function main() {
  console.log("🌱 Seeding NexOps database...");

  const businessId = "biz_demo_001";

  // Clean existing data
  await prisma.aiActivity.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.expense.deleteMany({});
  await prisma.vendor.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.inventoryTransaction.deleteMany({});
  await prisma.product.deleteMany({});

  console.log("Cleared existing data.");

  // Products
  const coffeeBeans = await prisma.product.create({
    data: {
      businessId,
      name: "Premium Arabica Beans",
      sku: "CFF-ARB-01",
      currentStock: 45,
      reorderThreshold: 50,
      unit: "kg",
      unitPrice: 24.99,
    },
  });

  const oatMilk = await prisma.product.create({
    data: {
      businessId,
      name: "Barista Oat Milk",
      sku: "MLK-OAT-01",
      currentStock: 12, // Critically low!
      reorderThreshold: 24,
      unit: "carton",
      unitPrice: 4.5,
    },
  });

  console.log("Created products.");

  // Customer
  const cafeCustomer = await prisma.customer.create({
    data: {
      businessId,
      name: "Downtown Cafe",
      email: "billing@downtowncafe.com",
    },
  });

  // Invoices
  // Overdue Invoice
  await prisma.invoice.create({
    data: {
      businessId,
      customerId: cafeCustomer.id,
      amount: 1250.0,
      status: "OVERDUE",
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  });

  // Paid Invoice (Revenue)
  await prisma.invoice.create({
    data: {
      businessId,
      customerId: cafeCustomer.id,
      amount: 450.0,
      status: "PAID",
      dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  });

  // Vendor
  const beanSupplier = await prisma.vendor.create({
    data: {
      businessId,
      name: "Global Beans Supply",
      email: "orders@globalbeans.com",
    },
  });

  // Expense
  await prisma.expense.create({
    data: {
      businessId,
      vendorId: beanSupplier.id,
      amount: 850.0,
      category: "INVENTORY",
      date: new Date(),
      status: "PENDING",
    },
  });

  console.log("Created financial records.");

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

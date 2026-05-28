import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy";

// Base real client
const realSupabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// NexOps Reactive Local Mock Database
// ============================================

const BIZ = "biz_demo_001";

// Relative times to make mock data dynamic and realistic
const now = new Date();
const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
const yesterday = new Date(now.getTime() - 86400000).toISOString();
const threeDaysAgo = new Date(now.getTime() - 3 * 86400000).toISOString();
const fiveDaysHence = new Date(now.getTime() + 5 * 86400000).toISOString();
const sevenDaysHence = new Date(now.getTime() + 7 * 86400000).toISOString();
const tenDaysAgo = new Date(now.getTime() - 10 * 86400000).toISOString();

let mockDb: any = null;

function getMockDb() {
  if (mockDb) return mockDb;

  const defaultDb = {
    vendors: [
      { id: "v1", name: "Artisan Roasters Co.", contactPerson: "Carlos Rivera", email: "carlos@artisanroasters.in", phone: "+91 98765 43210", address: "Indiranagar, Bangalore", businessId: BIZ },
      { id: "v2", name: "Daily Fresh Dairy", contactPerson: "Priya Sharma", email: "orders@dailyfresh.in", phone: "+91 87654 32109", address: "Ooty Hills, Tamil Nadu", businessId: BIZ },
      { id: "v3", name: "Bakers & Co.", contactPerson: "Amit Patel", email: "amit@bakersco.com", phone: "+91 76543 21098", address: "Mysore Industrial Area", businessId: BIZ },
      { id: "v4", name: "Organic Packagings", contactPerson: "Sneha Reddy", email: "support@organicpack.in", phone: "+91 65432 10987", address: "Gachibowli, Hyderabad", businessId: BIZ }
    ],
    customers: [
      { id: "c1", name: "XYZ Cafe", businessId: BIZ },
      { id: "c2", name: "Vikas Sen", businessId: BIZ },
      { id: "c3", name: "Himalayan Bistro", businessId: BIZ },
      { id: "c4", name: "Greenwood Cafe", businessId: BIZ },
      { id: "c5", name: "Downtown Coffee House", businessId: BIZ }
    ],
    products: [
      { id: "p1", name: "Artisanal Espresso Blend", sku: "COF-ESP-01", category: "Coffee", currentStock: 12.5, reorderThreshold: 10.0, reorderQuantity: 20.0, unit: "kg", costPrice: 800, sellingPrice: 1200, isActive: true, vendorId: "v1", businessId: BIZ },
      { id: "p2", name: "Organic Whole Milk", sku: "DAI-MIL-02", category: "Dairy", currentStock: 140, reorderThreshold: 50, reorderQuantity: 100, unit: "L", costPrice: 52, sellingPrice: 75, isActive: true, vendorId: "v2", businessId: BIZ },
      { id: "p3", name: "Gourmet Cold Brew", sku: "COF-CLD-03", category: "Coffee", currentStock: 4, reorderThreshold: 20, reorderQuantity: 30, unit: "L", costPrice: 120, sellingPrice: 240, isActive: true, vendorId: "v1", businessId: BIZ }, // Low stock
      { id: "p4", name: "French Croissant", sku: "BAK-CRO-04", category: "Bakery", currentStock: 35, reorderThreshold: 15, reorderQuantity: 40, unit: "units", costPrice: 58, sellingPrice: 110, isActive: true, vendorId: "v3", businessId: BIZ },
      { id: "p5", name: "Avocado Toast Mix", sku: "BAK-AVO-05", category: "Bakery", currentStock: 0, reorderThreshold: 5, reorderQuantity: 10, unit: "kg", costPrice: 320, sellingPrice: 550, isActive: true, vendorId: "v2", businessId: BIZ }, // Out of stock
      { id: "p6", name: "Double Chocolate Brownie", sku: "BAK-BRW-06", category: "Bakery", currentStock: 28, reorderThreshold: 10, reorderQuantity: 25, unit: "units", costPrice: 45, sellingPrice: 95, isActive: true, vendorId: "v3", businessId: BIZ },
      { id: "p7", name: "Organic Brown Sugar", sku: "ING-SGR-07", category: "Ingredients", currentStock: 45, reorderThreshold: 15, reorderQuantity: 30, unit: "kg", costPrice: 85, sellingPrice: 120, isActive: true, vendorId: "v4", businessId: BIZ },
      { id: "p8", name: "Biodegradable Hot Cups", sku: "PKG-CUP-08", category: "Packaging", currentStock: 1500, reorderThreshold: 500, reorderQuantity: 1000, unit: "units", costPrice: 3, sellingPrice: 5, isActive: true, vendorId: "v4", businessId: BIZ },
      { id: "p9", name: "Caramel Syrup", sku: "ING-SYR-09", category: "Ingredients", currentStock: 2, reorderThreshold: 10, reorderQuantity: 12, unit: "bottles", costPrice: 240, sellingPrice: 420, isActive: true, vendorId: "v1", businessId: BIZ }, // Critical stock
      { id: "p10", name: "Almond Milk", sku: "DAI-ALM-10", category: "Dairy", currentStock: 38, reorderThreshold: 15, reorderQuantity: 30, unit: "L", costPrice: 110, sellingPrice: 175, isActive: true, vendorId: "v2", businessId: BIZ }
    ],
    invoices: [
      { id: "i1", invoiceNumber: "INV-2026-001", customerName: "XYZ Cafe", customerId: "c1", total: 14200, subtotal: 12034, tax: 2166, status: "PAID", dueDate: fiveDaysHence, paidAt: now.toISOString(), createdAt: now.toISOString(), businessId: BIZ },
      { id: "i2", invoiceNumber: "INV-2026-002", customerName: "Greenwood Cafe", customerId: "c4", total: 6500, subtotal: 5508, tax: 992, status: "OVERDUE", dueDate: threeDaysAgo, paidAt: null, createdAt: tenDaysAgo, businessId: BIZ },
      { id: "i3", invoiceNumber: "INV-2026-003", customerName: "Himalayan Bistro", customerId: "c3", total: 4800, subtotal: 4068, tax: 732, status: "PENDING", dueDate: fiveDaysHence, paidAt: null, createdAt: now.toISOString(), businessId: BIZ },
      { id: "i4", invoiceNumber: "INV-2026-004", customerName: "Vikas Sen", customerId: "c2", total: 12450, subtotal: 10550, tax: 1900, status: "PAID", dueDate: yesterday, paidAt: yesterday, createdAt: yesterday, businessId: BIZ },
      { id: "i5", invoiceNumber: "INV-2026-005", customerName: "Downtown Coffee House", customerId: "c5", total: 9800, subtotal: 8305, tax: 1495, status: "OVERDUE", dueDate: tenDaysAgo, paidAt: null, createdAt: tenDaysAgo, businessId: BIZ },
      { id: "i6", invoiceNumber: "INV-2026-006", customerName: "XYZ Cafe", customerId: "c1", total: 3200, subtotal: 2712, tax: 488, status: "SENT", dueDate: sevenDaysHence, paidAt: null, createdAt: now.toISOString(), businessId: BIZ }
    ],
    invoice_items: [
      { id: "ii1", invoiceId: "i1", productId: "p1", quantity: 10, unitPrice: 1200, total: 12000 },
      { id: "ii2", invoiceId: "i1", productId: "p4", quantity: 20, unitPrice: 110, total: 2200 }
    ],
    expenses: [
      { id: "e1", category: "Raw Materials", amount: 15400, date: tenDaysAgo, businessId: BIZ },
      { id: "e2", category: "Utilities", amount: 3500, date: tenDaysAgo, businessId: BIZ },
      { id: "e3", category: "Logistics", amount: 1200, date: tenDaysAgo, businessId: BIZ }
    ],
    purchase_orders: [
      { id: "po1", orderNumber: "PO-2026-001", vendorId: "v1", total: 8000, status: "DRAFT", businessId: BIZ, createdAt: now.toISOString() },
      { id: "po2", orderNumber: "PO-2026-002", vendorId: "v2", total: 5200, status: "SENT", businessId: BIZ, createdAt: now.toISOString() }
    ],
    purchase_order_items: [],
    inventory_transactions: [],
    notifications: [],
    ai_activities: [
      { id: "a1", type: "PROACTIVE_SCAN", status: "COMPLETED", title: "Automated Operations Scan", description: "Checked inventory stock levels. Flagged 'Avocado Toast Mix' as out of stock.", toolUsed: "detect_low_stock", createdAt: yesterday, businessId: BIZ },
      { id: "a2", type: "INVOICE_CREATED", status: "COMPLETED", title: "Invoice INV-2026-004 created", description: "Auto-generated invoice for Vikas Sen. Total: ₹12,450", toolUsed: "create_invoice", createdAt: yesterday, businessId: BIZ },
      { id: "a3", type: "PAYMENT_REMINDER", status: "COMPLETED", title: "Payment reminder sent for INV-2026-002", description: "Sent overdue email alert to Greenwood Cafe. ₹6,500 due.", toolUsed: "send_payment_reminder", createdAt: threeDaysAgo, businessId: BIZ }
    ]
  };

  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("nexops_mock_db");
    if (saved) {
      try {
        mockDb = JSON.parse(saved);
        return mockDb;
      } catch {
        // Fallback
      }
    }
    mockDb = defaultDb;
    localStorage.setItem("nexops_mock_db", JSON.stringify(mockDb));
  } else {
    mockDb = defaultDb;
  }
  return mockDb;
}

function saveMockDb(db: any) {
  mockDb = db;
  if (typeof window !== "undefined") {
    localStorage.setItem("nexops_mock_db", JSON.stringify(db));
  }
}

class MockQueryBuilder {
  private tableName: string;
  private filters: Array<(item: any) => boolean> = [];
  private orderField: string | null = null;
  private orderAscending = true;
  private limitCount: number | null = null;
  private isSingle = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(fields?: string, options?: any) {
    return this;
  }

  eq(field: string, value: any) {
    this.filters.push((item) => {
      if (field === "id") return item.id === value;
      return item[field] === value;
    });
    return this;
  }

  neq(field: string, value: any) {
    this.filters.push((item) => item[field] !== value);
    return this;
  }

  ilike(field: string, pattern: string) {
    const cleanPattern = pattern.replace(/%/g, "").toLowerCase();
    this.filters.push((item) => {
      const val = item[field];
      if (typeof val !== "string") return false;
      return val.toLowerCase().includes(cleanPattern);
    });
    return this;
  }

  or(queryStr: string) {
    const parts = queryStr.split(",");
    this.filters.push((item) => {
      return parts.some(part => {
        const [field, op, val] = part.split(".");
        if (op === "ilike") {
          const cleanVal = val.replace(/%/g, "").toLowerCase();
          return String(item[field] || "").toLowerCase().includes(cleanVal);
        }
        return false;
      });
    });
    return this;
  }

  not(field: string, op: string, val: string) {
    if (op === "in") {
      const cleaned = val.replace(/[()"]/g, "").split(",");
      this.filters.push((item) => !cleaned.includes(item[field]));
    }
    return this;
  }

  in(field: string, values: any[]) {
    this.filters.push((item) => values.includes(item[field]));
    return this;
  }

  gte(field: string, value: any) {
    this.filters.push((item) => {
      if (!item[field]) return false;
      return new Date(item[field]) >= new Date(value);
    });
    return this;
  }

  gt(field: string, value: any) {
    this.filters.push((item) => {
      const val = item[field];
      if (typeof val === "number") return val > Number(value);
      return new Date(val) > new Date(value);
    });
    return this;
  }

  lte(field: string, value: any) {
    this.filters.push((item) => {
      if (!item[field]) return false;
      return new Date(item[field]) <= new Date(value);
    });
    return this;
  }

  lt(field: string, value: any) {
    this.filters.push((item) => {
      if (!item[field]) return false;
      return new Date(item[field]) < new Date(value);
    });
    return this;
  }

  order(field: string, options?: { ascending: boolean }) {
    this.orderField = field;
    this.orderAscending = options?.ascending ?? true;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  async insert(data: any) {
    const db = getMockDb();
    const table = db[this.tableName] || [];
    
    const itemsToInsert = Array.isArray(data) ? data : [data];
    const insertedItems = itemsToInsert.map(item => {
      const newItem = {
        id: item.id || `mock_${Math.random().toString(36).substring(2, 9)}`,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
        ...item
      };
      table.push(newItem);
      return newItem;
    });

    db[this.tableName] = table;
    saveMockDb(db);

    const result = this.isSingle || !Array.isArray(data) ? insertedItems[0] : insertedItems;
    return { data: result, error: null };
  }

  async update(data: any) {
    const db = getMockDb();
    const table = db[this.tableName] || [];

    let updatedCount = 0;
    const updatedItems: any[] = [];

    const updatedTable = table.map((item: any) => {
      const matches = this.filters.every(filter => filter(item));
      if (matches) {
        updatedCount++;
        const updatedItem = {
          ...item,
          ...data,
          updatedAt: new Date().toISOString()
        };
        updatedItems.push(updatedItem);
        return updatedItem;
      }
      return item;
    });

    db[this.tableName] = updatedTable;
    saveMockDb(db);

    const result = this.isSingle ? updatedItems[0] : updatedItems;
    return { data: result, count: updatedCount, error: null };
  }

  async delete() {
    const db = getMockDb();
    const table = db[this.tableName] || [];

    const deletedItems: any[] = [];
    const remainingTable = table.filter((item: any) => {
      const matches = this.filters.every(filter => filter(item));
      if (matches) {
        deletedItems.push(item);
        return false;
      }
      return true;
    });

    db[this.tableName] = remainingTable;
    saveMockDb(db);

    return { data: deletedItems, error: null };
  }

  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      const db = getMockDb();
      let items = [...(db[this.tableName] || [])];

      // 1. Filter
      this.filters.forEach(filter => {
        items = items.filter(filter);
      });

      // 2. Resolve Joins
      if (this.tableName === "products") {
        items = items.map(p => {
          const vendors = db.vendors || [];
          const v = vendors.find((vend: any) => vend.id === p.vendorId);
          return {
            ...p,
            vendor: v ? { ...v } : null
          };
        });
      } else if (this.tableName === "invoices") {
        items = items.map(inv => {
          const customers = db.customers || [];
          const c = customers.find((cust: any) => cust.id === inv.customerId);
          return {
            ...inv,
            customer: c ? { ...c } : { id: inv.customerId, name: inv.customerName || "Customer" }
          };
        });
      } else if (this.tableName === "purchase_orders") {
        items = items.map(po => {
          const vendors = db.vendors || [];
          const v = vendors.find((vend: any) => vend.id === po.vendorId);
          return {
            ...po,
            vendor: v ? { ...v } : null
          };
        });
      }

      // 3. Sort
      if (this.orderField) {
        const field = this.orderField;
        const asc = this.orderAscending;
        items.sort((a, b) => {
          const valA = a[field];
          const valB = b[field];
          if (valA === undefined || valB === undefined) return 0;
          if (typeof valA === "string") {
            return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
          }
          return asc ? valA - valB : valB - valA;
        });
      }

      // 4. Limit
      if (this.limitCount !== null) {
        items = items.slice(0, this.limitCount);
      }

      const result = this.isSingle ? (items[0] || null) : items;
      const response = { data: result, count: items.length, error: null };
      return onfulfilled ? onfulfilled(response) : response;
    } catch (err: any) {
      const response = { data: null, count: 0, error: err.message || err };
      return onfulfilled ? onfulfilled(response) : response;
    }
  }
}

// Fluent Mock Client
const mockSupabase = {
  from(tableName: string) {
    return new MockQueryBuilder(tableName);
  }
};

// Check configuration to determine whether to use the mock client
const useMock = supabaseUrl === "https://dummy.supabase.co" || supabaseKey === "dummy";

export const supabase: any = useMock ? mockSupabase : realSupabase;

// Utility for handling Supabase single row fetches that might throw
export async function getOne<T>(query: Promise<{ data: T | null; error: any }>): Promise<T | null> {
  const { data, error } = await query;
  if (error) {
    console.error("Supabase Query Error:", error);
    return null;
  }
  return data;
}

export async function getMany<T>(query: Promise<{ data: T[] | null; error: any }>): Promise<T[]> {
  const { data, error } = await query;
  if (error) {
    console.error("Supabase Query Error:", error);
    return [];
  }
  return data || [];
}

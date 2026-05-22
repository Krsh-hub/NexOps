// Database interfaces corresponding to PostgreSQL schema generated previously by Prisma

export interface Business {
  id: string;
  name: string;
  type: string;
  currency: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  currentStock: number;
  reorderThreshold: number;
  reorderQuantity: number;
  costPrice: number;
  sellingPrice: number;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  businessId: string;
  vendorId: string | null;
}

export interface InventoryTransaction {
  id: string;
  type: string; // IN, OUT, ADJUSTMENT
  quantity: number;
  reason: string;
  notes: string | null;
  createdAt: string | Date;
  productId: string;
  businessId: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string | Date;
  businessId: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  status: string; // DRAFT, SENT, RECEIVED, CANCELLED
  total: number;
  notes: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  vendorId: string;
  businessId: string;
}

export interface PurchaseOrderItem {
  id: string;
  quantity: number;
  unitCost: number;
  total: number;
  purchaseOrderId: string;
  productId: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string | Date;
  businessId: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string; // DRAFT, SENT, PAID, OVERDUE, CANCELLED
  subtotal: number;
  tax: number;
  total: number;
  dueDate: string | Date;
  paidAt: string | Date | null;
  notes: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  customerId: string;
  businessId: string;
}

export interface InvoiceItem {
  id: string;
  quantity: number;
  unitPrice: number;
  total: number;
  invoiceId: string;
  productId: string;
}

export interface Payment {
  id: string;
  amount: number;
  method: string;
  paidAt: string | Date;
  notes: string | null;
  invoiceId: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string | Date;
  createdAt: string | Date;
  businessId: string;
}

export interface AIActivity {
  id: string;
  type: string;
  status: string;
  title: string;
  description: string;
  toolUsed: string | null;
  result: string | null;
  metadata: string | null;
  createdAt: string | Date;
  businessId: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  actionUrl: string | null;
  createdAt: string | Date;
  businessId: string;
}

// ============================================
// NexOps Type Definitions
// ============================================

// Enums
export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";
export type TransactionType = "IN" | "OUT" | "ADJUSTMENT";
export type ActivityType = "INVOICE_CREATED" | "INVENTORY_UPDATED" | "LOW_STOCK_ALERT" | "PURCHASE_ORDER" | "PAYMENT_REMINDER" | "DAILY_SUMMARY" | "ANOMALY_DETECTED" | "RECOMMENDATION";
export type ActivityStatus = "PENDING" | "EXECUTING" | "COMPLETED" | "FAILED";
export type NotificationType = "INFO" | "WARNING" | "CRITICAL" | "SUCCESS";
export type PurchaseOrderStatus = "DRAFT" | "SENT" | "RECEIVED" | "CANCELLED";

// Core Entities
export interface Business {
  id: string;
  name: string;
  type: string;
  currency: string;
  createdAt: Date;
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
  businessId: string;
  vendorId?: string;
  vendor?: Vendor;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vendor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  businessId: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  businessId: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer?: Customer;
  businessId: string;
  status: InvoiceStatus;
  subtotal: number;
  tax: number;
  total: number;
  dueDate: Date;
  paidAt?: Date;
  items: InvoiceItem[];
  payments: Payment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: string;
  paidAt: Date;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  product?: Product;
  type: TransactionType;
  quantity: number;
  reason: string;
  businessId: string;
  createdAt: Date;
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  vendor?: Vendor;
  businessId: string;
  status: PurchaseOrderStatus;
  total: number;
  items: PurchaseOrderItem[];
  createdAt: Date;
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  businessId: string;
  createdAt: Date;
}

export interface AIActivity {
  id: string;
  type: ActivityType;
  status: ActivityStatus;
  title: string;
  description: string;
  toolUsed?: string;
  result?: string;
  businessId: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  businessId: string;
  createdAt: Date;
}

// Dashboard Types
export interface DashboardKPI {
  label: string;
  value: number;
  formattedValue: string;
  change: number; // percentage change
  trend: "up" | "down" | "neutral";
  icon: string;
}

export interface InventoryHealth {
  totalProducts: number;
  healthyStock: number;
  warningStock: number;
  criticalStock: number;
  outOfStock: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
}

// AI Types
export interface AIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  toolCalls?: AIToolCall[];
  timestamp: Date;
}

export interface AIToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
  status: "pending" | "executing" | "completed" | "failed";
}

export interface AIInsight {
  id: string;
  type: "warning" | "recommendation" | "info" | "critical";
  title: string;
  description: string;
  actions?: AIInsightAction[];
  createdAt: Date;
  dismissed: boolean;
}

export interface AIInsightAction {
  label: string;
  action: string;
  variant: "default" | "destructive" | "outline";
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DashboardData {
  kpis: DashboardKPI[];
  inventoryHealth: InventoryHealth;
  revenueData: RevenueData[];
  recentActivities: AIActivity[];
  notifications: Notification[];
  insights: AIInsight[];
  criticalStock: Product[];
  overdueInvoices: Invoice[];
}

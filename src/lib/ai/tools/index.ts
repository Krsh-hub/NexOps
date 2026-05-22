// ============================================
// NexOps AI Tool Definitions
// Defines all tools available to the AI agent
// ============================================

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
    required: string[];
  };
}

export const AI_TOOLS: ToolDefinition[] = [
  {
    name: "create_invoice",
    description: "Creates a new invoice for a customer with specified items. Automatically updates inventory and revenue records.",
    parameters: {
      type: "object",
      properties: {
        customerName: {
          type: "string",
          description: "Name of the customer to invoice",
        },
        items: {
          type: "string",
          description: "JSON array of items, each with productName (string), quantity (number). Example: [{\"productName\":\"Cold Coffee\",\"quantity\":40}]",
        },
        dueInDays: {
          type: "string",
          description: "Number of days until payment is due. Default: 7",
        },
      },
      required: ["customerName", "items"],
    },
  },
  {
    name: "update_inventory",
    description: "Adjusts stock levels for a product. Use for manual adjustments, receiving deliveries, or recording consumption.",
    parameters: {
      type: "object",
      properties: {
        productName: {
          type: "string",
          description: "Name of the product to update",
        },
        quantity: {
          type: "string",
          description: "Quantity to add (positive) or remove (negative)",
        },
        reason: {
          type: "string",
          description: "Reason for the adjustment",
        },
      },
      required: ["productName", "quantity", "reason"],
    },
  },
  {
    name: "detect_low_stock",
    description: "Scans all products and identifies items with stock below their reorder threshold. Returns critical stock alerts.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "get_inventory_status",
    description: "Gets current stock levels and status for all products or a specific product.",
    parameters: {
      type: "object",
      properties: {
        productName: {
          type: "string",
          description: "Optional: specific product name to check. If empty, returns all products.",
        },
      },
      required: [],
    },
  },
  {
    name: "get_financial_overview",
    description: "Gets financial overview including revenue, expenses, pending payments, and overdue invoices.",
    parameters: {
      type: "object",
      properties: {
        period: {
          type: "string",
          description: "Time period: 'today', 'week', 'month'",
          enum: ["today", "week", "month"],
        },
      },
      required: [],
    },
  },
  {
    name: "get_overdue_invoices",
    description: "Lists all overdue invoices with customer details and amounts.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "create_purchase_order",
    description: "Creates a draft purchase order for restocking items from a vendor.",
    parameters: {
      type: "object",
      properties: {
        vendorName: {
          type: "string",
          description: "Name of the vendor to order from",
        },
        items: {
          type: "string",
          description: "JSON array of items, each with productName (string), quantity (number). Example: [{\"productName\":\"Whole Milk\",\"quantity\":100}]",
        },
      },
      required: ["vendorName", "items"],
    },
  },
  {
    name: "generate_summary",
    description: "Generates a daily or weekly operational summary including revenue, inventory status, key metrics, and recommendations.",
    parameters: {
      type: "object",
      properties: {
        period: {
          type: "string",
          description: "Summary period: 'daily' or 'weekly'",
          enum: ["daily", "weekly"],
        },
      },
      required: [],
    },
  },
  {
    name: "send_payment_reminder",
    description: "Sends payment reminders for overdue invoices. Logs the reminder as an AI activity.",
    parameters: {
      type: "object",
      properties: {
        invoiceNumber: {
          type: "string",
          description: "Optional: specific invoice number. If empty, sends reminders for all overdue invoices.",
        },
      },
      required: [],
    },
  },
  {
    name: "search_products",
    description: "Search products by name or category.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query for product name or category",
        },
      },
      required: ["query"],
    },
  },
];

// Convert our tools to OpenAI function format
export function getOpenAITools() {
  return AI_TOOLS.map((tool) => ({
    type: "function" as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  }));
}

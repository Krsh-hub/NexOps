// ============================================
// NexOps AI Agent — Core Orchestrator
// Think-Act-Observe loop with tool calling
// Powered by Groq (Llama 3.3 70B) via OpenAI-compatible API
// ============================================

import { updateInventory, detectLowStock, getInventoryStatus, searchProducts } from "./tools/inventory-tools";
import { createInvoice, getFinancialOverview, getOverdueInvoices, createPurchaseOrder, sendPaymentReminder } from "./tools/finance-tools";
import { generateSummary } from "./tools/analytics-tools";
import { getOpenAITools } from "./tools";

// Tool executor map
const toolExecutors: Record<string, (args: Record<string, string>) => Promise<string>> = {
  create_invoice: (args) => createInvoice(args as { customerName: string; items: string; dueInDays?: string }),
  update_inventory: (args) => updateInventory(args as { productName: string; quantity: string; reason: string }),
  detect_low_stock: () => detectLowStock(),
  get_inventory_status: (args) => getInventoryStatus(args as { productName?: string }),
  get_financial_overview: (args) => getFinancialOverview(args as { period?: string }),
  get_overdue_invoices: () => getOverdueInvoices(),
  create_purchase_order: (args) => createPurchaseOrder(args as { vendorName: string; items: string }),
  generate_summary: (args) => generateSummary(args as { period?: string }),
  send_payment_reminder: (args) => sendPaymentReminder(args as { invoiceNumber?: string }),
  search_products: (args) => searchProducts(args as { query: string }),
};

const SYSTEM_PROMPT = `You are NexOps AI — an autonomous operations agent for "Brew & Bite Café", a modern café business.

Your role is to act as a smart operations manager:
- Execute operational workflows proactively
- Manage inventory and finances autonomously
- Provide concise, business-focused insights
- Chain multiple tools when a single task requires multiple steps

Communication style:
- Be concise and action-oriented
- Use business terminology
- Report results clearly with numbers
- Highlight risks and opportunities
- Never be verbose or overly conversational

When creating invoices:
- Always update inventory after creating an invoice
- Check for low stock after inventory changes
- Suggest reorders when stock is critical

When analyzing finances:
- Highlight overdue invoices
- Note revenue trends
- Flag unusual patterns

Always format currency in INR (₹).
Always end with a brief status update or recommendation.`;

export interface AgentMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_call_id?: string;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: {
      name: string;
      arguments: string;
    };
  }>;
}

export interface AgentResponse {
  message: string;
  toolCalls: Array<{
    id: string;
    name: string;
    args: Record<string, unknown>;
    result: unknown;
    status: "completed" | "failed";
  }>;
}

export async function runAgent(userMessage: string, conversationHistory: AgentMessage[] = []): Promise<AgentResponse> {
  const messages: AgentMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...conversationHistory,
    { role: "user", content: userMessage },
  ];

  const tools = getOpenAITools();
  const allToolCalls: AgentResponse["toolCalls"] = [];

  // Check if Groq API is available
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    // Mock mode — use pattern matching for demo
    return runMockAgent(userMessage);
  }

  // Real Groq agent loop (OpenAI-compatible API)
  const { default: OpenAI } = await import("openai");
  const groq = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });

  let maxIterations = 5; // Prevent infinite loops
  
  while (maxIterations > 0) {
    maxIterations--;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages as Parameters<typeof groq.chat.completions.create>[0]["messages"],
      tools,
      tool_choice: "auto",
    });

    const choice = response.choices[0];
    const assistantMessage = choice.message;

    // Add assistant message to history
    messages.push({
      role: "assistant",
      content: assistantMessage.content || "",
      tool_calls: assistantMessage.tool_calls?.map((tc: any) => ({
        id: tc.id,
        type: "function" as const,
        function: {
          name: tc.function.name,
          arguments: tc.function.arguments,
        },
      })),
    });

    // If no tool calls, we have our final response
    if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
      return {
        message: assistantMessage.content || "Done.",
        toolCalls: allToolCalls,
      };
    }

    // Execute tool calls
    for (const toolCall of assistantMessage.tool_calls as any[]) {
      const toolName = toolCall.function.name;
      const toolArgs = JSON.parse(toolCall.function.arguments);
      
      let result: string;
      let status: "completed" | "failed" = "completed";

      try {
        const executor = toolExecutors[toolName];
        if (!executor) {
          result = JSON.stringify({ error: `Unknown tool: ${toolName}` });
          status = "failed";
        } else {
          result = await executor(toolArgs);
        }
      } catch (error) {
        result = JSON.stringify({ error: String(error) });
        status = "failed";
      }

      allToolCalls.push({
        id: toolCall.id,
        name: toolName,
        args: toolArgs,
        result: JSON.parse(result),
        status,
      });

      // Add tool result to messages
      messages.push({
        role: "tool",
        content: result,
        tool_call_id: toolCall.id,
      });
    }
  }

  return {
    message: "Completed operations.",
    toolCalls: allToolCalls,
  };
}

// ============================================
// Mock Agent for Demo (no OpenAI key needed)
// ============================================

async function runMockAgent(userMessage: string): Promise<AgentResponse> {
  const msg = userMessage.toLowerCase();
  const toolCalls: AgentResponse["toolCalls"] = [];

  // Invoice creation pattern
  if (msg.includes("invoice") || msg.includes("bill")) {
    const quantityMatch = msg.match(/(\d+)/);
    const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 10;
    
    // Extract product name
    let productName = "Cold Coffee";
    if (msg.includes("espresso")) productName = "Espresso";
    if (msg.includes("cappuccino")) productName = "Cappuccino";
    if (msg.includes("hot chocolate")) productName = "Hot Chocolate";
    if (msg.includes("sandwich")) productName = "Paneer Sandwich";
    if (msg.includes("brownie")) productName = "Chocolate Brownie";
    if (msg.includes("cold coffee")) productName = "Cold Coffee";

    // Extract customer name
    let customerName = "XYZ Cafe";
    const toMatch = msg.match(/to\s+(.+?)(?:\s*\.|$)/i);
    if (toMatch) {
      customerName = toMatch[1].trim().replace(/['"]/g, "");
      // Capitalize
      customerName = customerName.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }

    // Execute create_invoice
    const invoiceResult = await createInvoice({
      customerName,
      items: JSON.stringify([{ productName, quantity }]),
    });
    
    const parsed = JSON.parse(invoiceResult);
    toolCalls.push({
      id: "tc_1",
      name: "create_invoice",
      args: { customerName, items: [{ productName, quantity }] },
      result: parsed,
      status: parsed.success ? "completed" : "failed",
    });

    // Check low stock after invoice
    const lowStockResult = await detectLowStock();
    const lowStock = JSON.parse(lowStockResult);
    toolCalls.push({
      id: "tc_2",
      name: "detect_low_stock",
      args: {},
      result: lowStock,
      status: "completed",
    });

    let response = "";
    if (parsed.success) {
      const inv = parsed.invoice;
      response = `✅ **Invoice ${inv.invoiceNumber}** created for **${inv.customer}**\n\n`;
      response += `| Item | Qty | Price | Total |\n|------|-----|-------|-------|\n`;
      for (const item of inv.items) {
        response += `| ${item.product} | ${item.quantity} | ₹${item.unitPrice} | ₹${item.total.toLocaleString("en-IN")} |\n`;
      }
      response += `\n**Subtotal:** ₹${inv.subtotal.toLocaleString("en-IN")} · **GST:** ₹${inv.tax.toLocaleString("en-IN")} · **Total:** ₹${inv.total.toLocaleString("en-IN")}`;
      response += `\n**Due:** ${inv.dueDate}`;

      if (parsed.inventoryUpdates?.length > 0) {
        response += `\n\n📦 Inventory auto-updated: ${parsed.inventoryUpdates.join(", ")}`;
      }
    } else {
      response = `❌ Failed to create invoice: ${parsed.error}`;
    }

    if (lowStock.lowStockCount > 0) {
      response += `\n\n⚠️ **Stock Alert:** ${lowStock.lowStockCount} item(s) below reorder threshold:`;
      for (const item of lowStock.items) {
        const icon = item.severity === "CRITICAL" ? "🔴" : "🟡";
        response += `\n${icon} **${item.name}** — ${item.currentStock} ${item.unit} remaining (~${item.estimatedDaysLeft} days)`;
      }
    }

    return { message: response, toolCalls };
  }

  // Stock/Inventory check
  if (msg.includes("stock") || msg.includes("inventory")) {
    if (msg.includes("low") || msg.includes("alert") || msg.includes("critical")) {
      const result = await detectLowStock();
      const parsed = JSON.parse(result);
      toolCalls.push({ id: "tc_1", name: "detect_low_stock", args: {}, result: parsed, status: "completed" });

      let response = `📊 **Inventory Scan Complete**\n\n`;
      if (parsed.lowStockCount === 0) {
        response += "✅ All stock levels healthy.";
      } else {
        response += `⚠️ **${parsed.lowStockCount}** item(s) need attention:\n`;
        for (const item of parsed.items) {
          const icon = item.severity === "CRITICAL" ? "🔴" : "🟡";
          response += `\n${icon} **${item.name}** — ${item.currentStock} ${item.unit} (threshold: ${item.reorderThreshold})\n   └ Vendor: ${item.vendor} · ~${item.estimatedDaysLeft} days left`;
        }
      }
      return { message: response, toolCalls };
    }

    // General inventory status
    const result = await getInventoryStatus({});
    const parsed = JSON.parse(result);
    toolCalls.push({ id: "tc_1", name: "get_inventory_status", args: {}, result: parsed, status: "completed" });

    let response = `📦 **Inventory Overview** — ${parsed.totalProducts} products\n\n`;
    response += `✅ Healthy: ${parsed.healthyStock} · 🟡 Low: ${parsed.lowStock} · 🔴 Critical: ${parsed.criticalStock}\n\n`;
    response += `| Product | Stock | Status |\n|---------|-------|--------|\n`;
    for (const p of parsed.products.slice(0, 10)) {
      const statusIcon = p.status === "HEALTHY" ? "✅" : p.status === "LOW" ? "🟡" : p.status === "CRITICAL" ? "🔴" : p.status === "OUT_OF_STOCK" ? "⛔" : "➖";
      response += `| ${p.name} | ${p.stock} | ${statusIcon} ${p.status} |\n`;
    }
    return { message: response, toolCalls };
  }

  // Financial queries
  if (msg.includes("revenue") || msg.includes("financ") || msg.includes("money") || msg.includes("profit") || msg.includes("expense")) {
    const period = msg.includes("today") ? "today" : msg.includes("month") ? "month" : "week";
    const result = await getFinancialOverview({ period });
    const parsed = JSON.parse(result);
    toolCalls.push({ id: "tc_1", name: "get_financial_overview", args: { period }, result: parsed, status: "completed" });

    let response = `💰 **Financial Overview** — ${period}\n\n`;
    response += `**Revenue:** ₹${parsed.revenue.toLocaleString("en-IN")}\n`;
    response += `**Expenses:** ₹${parsed.expenses.toLocaleString("en-IN")}\n`;
    response += `**Profit:** ₹${parsed.profit.toLocaleString("en-IN")}\n\n`;
    response += `📄 Invoices: ${parsed.invoicesSummary.paid} paid, ${parsed.invoicesSummary.pending} pending, ${parsed.invoicesSummary.overdue} overdue\n`;
    if (parsed.overdueAmount > 0) {
      response += `\n⚠️ **Overdue:** ₹${parsed.overdueAmount.toLocaleString("en-IN")} across ${parsed.invoicesSummary.overdue} invoices`;
    }
    return { message: response, toolCalls };
  }

  // Overdue invoices
  if (msg.includes("overdue") || msg.includes("unpaid") || msg.includes("pending")) {
    const result = await getOverdueInvoices();
    const parsed = JSON.parse(result);
    toolCalls.push({ id: "tc_1", name: "get_overdue_invoices", args: {}, result: parsed, status: "completed" });

    let response = `📋 **Overdue Invoices** — ${parsed.count} invoice(s), ₹${parsed.totalAmount.toLocaleString("en-IN")} total\n\n`;
    for (const inv of parsed.invoices) {
      response += `🔴 **${inv.invoiceNumber}** — ${inv.customer}\n   ₹${inv.total.toLocaleString("en-IN")} · ${inv.daysOverdue} days overdue\n\n`;
    }
    return { message: response, toolCalls };
  }

  // Purchase order
  if (msg.includes("purchase order") || msg.includes("reorder") || msg.includes("restock") || msg.includes("order from")) {
    // Try to extract vendor and items from message
    let vendorName = "Fresh Dairy Farms";
    let items = [{ productName: "Whole Milk", quantity: 100 }];

    if (msg.includes("coffee")) {
      vendorName = "Premium Coffee Traders";
      items = [{ productName: "Coffee Powder", quantity: 25 }];
    }

    const result = await createPurchaseOrder({
      vendorName,
      items: JSON.stringify(items),
    });
    const parsed = JSON.parse(result);
    toolCalls.push({ id: "tc_1", name: "create_purchase_order", args: { vendorName, items }, result: parsed, status: "completed" });

    if (parsed.success) {
      let response = `📝 **Purchase Order ${parsed.purchaseOrder.orderNumber}** drafted\n\n`;
      response += `**Vendor:** ${parsed.purchaseOrder.vendor}\n`;
      response += `| Item | Qty | Unit Cost | Total |\n|------|-----|-----------|-------|\n`;
      for (const item of parsed.purchaseOrder.items) {
        response += `| ${item.product} | ${item.quantity} | ₹${item.unitCost} | ₹${item.total.toLocaleString("en-IN")} |\n`;
      }
      response += `\n**Total:** ₹${parsed.purchaseOrder.total.toLocaleString("en-IN")} · Status: Draft`;
      return { message: response, toolCalls };
    }
    return { message: `❌ ${parsed.error}`, toolCalls };
  }

  // Summary
  if (msg.includes("summary") || msg.includes("report") || msg.includes("overview") || msg.includes("how are things") || msg.includes("status")) {
    const period = msg.includes("week") ? "weekly" : "daily";
    const result = await generateSummary({ period });
    const parsed = JSON.parse(result);
    toolCalls.push({ id: "tc_1", name: "generate_summary", args: { period }, result: parsed, status: "completed" });

    let response = `📊 **${period === "weekly" ? "Weekly" : "Daily"} Operations Summary**\n\n`;
    response += `💰 Revenue: ₹${parsed.revenue.total.toLocaleString("en-IN")} (${parsed.revenue.change > 0 ? "+" : ""}${parsed.revenue.change}%)\n`;
    response += `💸 Expenses: ₹${parsed.expenses.total.toLocaleString("en-IN")}\n`;
    response += `📈 Profit: ₹${parsed.profit.toLocaleString("en-IN")}\n\n`;

    if (parsed.highlights.length > 0) {
      response += `**Key Highlights:**\n`;
      for (const h of parsed.highlights) {
        response += `• ${h}\n`;
      }
    }
    return { message: response, toolCalls };
  }

  // Payment reminder
  if (msg.includes("remind") || msg.includes("payment reminder")) {
    const result = await sendPaymentReminder({});
    const parsed = JSON.parse(result);
    toolCalls.push({ id: "tc_1", name: "send_payment_reminder", args: {}, result: parsed, status: "completed" });

    if (parsed.remindersSent > 0) {
      let response = `📧 **${parsed.remindersSent} payment reminder(s) sent**\n\n`;
      for (const r of parsed.reminders) {
        response += `• ${r.invoiceNumber} → ${r.customer}: ₹${r.amount.toLocaleString("en-IN")} (${r.daysOverdue} days overdue)\n`;
      }
      return { message: response, toolCalls };
    }
    return { message: "✅ No overdue invoices. All payments are on track.", toolCalls };
  }

  // Default response
  return {
    message: `I can help you with:\n\n• **Create invoices** — "Create invoice for 40 cold coffees to XYZ Cafe"\n• **Check inventory** — "Show inventory status" or "Low stock alerts"\n• **Financial overview** — "Show revenue this week"\n• **Overdue invoices** — "Show overdue invoices"\n• **Purchase orders** — "Create purchase order for milk"\n• **Summaries** — "Give me a daily summary"\n• **Payment reminders** — "Send payment reminders"\n\nWhat would you like me to do?`,
    toolCalls: [],
  };
}

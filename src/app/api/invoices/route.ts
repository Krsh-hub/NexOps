import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createInvoice } from "@/lib/ai/tools/finance-tools";

const BUSINESS_ID = "biz_demo_001";

export async function GET() {
  try {
    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("*, customer:customers(*)")
      .eq("businessId", BUSINESS_ID)
      .order("createdAt", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ invoices: invoices || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, items, dueInDays } = body;

    if (!customerName || !items) {
      return NextResponse.json(
        { error: "Customer name and items are required" },
        { status: 400 }
      );
    }

    const resultStr = await createInvoice({
      customerName,
      items: typeof items === "string" ? items : JSON.stringify(items),
      dueInDays: String(dueInDays || 7),
    });

    const parsed = JSON.parse(resultStr);
    if (parsed.error) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, invoice: parsed });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Invoice ID and new status are required" },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (status === "PAID") {
      updates.paidAt = new Date().toISOString();
    }

    const { error } = await supabase
      .from("invoices")
      .update(updates)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Add activity log
    await supabase.from("ai_activities").insert({
      type: "INVOICE_CREATED",
      status: "COMPLETED",
      title: `Invoice status updated to ${status}`,
      description: `Invoice ID: ${id} updated to status ${status}.`,
      toolUsed: "manual_update",
      businessId: BUSINESS_ID,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getMockDb, resetMockDb } from "@/lib/supabase";

export async function GET() {
  try {
    const db = getMockDb();
    const stats = {
      status: "connected",
      storageType: "Local Persistent File Storage",
      location: "data/nexops_db.json",
      counts: {
        products: db.products?.length || 0,
        invoices: db.invoices?.length || 0,
        vendors: db.vendors?.length || 0,
        customers: db.customers?.length || 0,
        expenses: db.expenses?.length || 0,
        activities: db.ai_activities?.length || 0,
      },
    };
    return NextResponse.json(stats);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    if (body.action === "reset") {
      const freshDb = resetMockDb();
      return NextResponse.json({
        success: true,
        message: "Database successfully reset to demo data.",
        counts: {
          products: freshDb.products?.length || 0,
          invoices: freshDb.invoices?.length || 0,
          vendors: freshDb.vendors?.length || 0,
        },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

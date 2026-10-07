import { NextRequest, NextResponse } from "next/server";
import { updateInventory } from "@/lib/ai/tools/inventory-tools";

export async function POST(req: NextRequest) {
  try {
    const { productName, quantity, reason } = await req.json();

    if (!productName || quantity === undefined) {
      return NextResponse.json(
        { error: "Product name and quantity are required" },
        { status: 400 }
      );
    }

    const resultStr = await updateInventory({
      productName,
      quantity: String(quantity),
      reason: reason || "Manual stock adjustment",
    });

    const parsed = JSON.parse(resultStr);
    if (parsed.error) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, result: parsed });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

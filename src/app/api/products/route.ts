import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

const BIZ = "biz_demo_001";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      sku,
      category,
      currentStock,
      reorderThreshold,
      reorderQuantity,
      unit,
      costPrice,
      sellingPrice,
      vendorId,
    } = body;

    // Basic validation
    if (!name || !sku || !category || currentStock == null || reorderThreshold == null || reorderQuantity == null || !unit || costPrice == null || sellingPrice == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProduct = {
      id: `p_${Date.now()}`,
      name,
      sku,
      category,
      currentStock: Number(currentStock),
      reorderThreshold: Number(reorderThreshold),
      reorderQuantity: Number(reorderQuantity),
      unit,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      vendorId: vendorId || null,
      isActive: true,
      businessId: BIZ,
    };

    const { data, error } = await supabase.from("products").insert(newProduct);

    if (error) {
      return NextResponse.json({ error: error.message || error }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

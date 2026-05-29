import { supabase } from "@/lib/supabase";

const BIZ = "biz_demo_001";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return Response.json({ error: "Vendor name is required." }, { status: 400 });
    }

    const vendor = {
      id: `v_${Date.now()}`,
      name: body.name.trim(),
      contactPerson: body.contactPerson || null,
      email: body.email || null,
      phone: body.phone || null,
      address: body.address || null,
      businessId: BIZ,
    };

    const { data, error } = await supabase.from("vendors").insert(vendor);

    if (error) {
      return Response.json({ error: "Failed to create vendor." }, { status: 500 });
    }

    return Response.json(data, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
}

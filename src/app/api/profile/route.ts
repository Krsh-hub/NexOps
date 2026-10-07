import { NextRequest, NextResponse } from "next/server";
import { getBusinessProfile, saveBusinessProfile, resetMockDb, getMockDb, saveMockDb } from "@/lib/supabase";

export async function GET() {
  try {
    const profile = getBusinessProfile();
    return NextResponse.json(profile);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load profile" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, businessName, businessType, operatorName, currencySymbol, currencyCode, mode } = body;

    if (action === "initialize_clean" || mode === "clean") {
      const updated = saveBusinessProfile(
        {
          businessName: businessName?.trim() || "My Business",
          businessType: businessType || "Business",
          operatorName: operatorName?.trim() || "Operator",
          currencySymbol: currencySymbol || "₹",
          currencyCode: currencyCode || "INR",
          mode: "clean",
          isConfigured: true,
        },
        true // clear dummy data!
      );
      return NextResponse.json({ success: true, profile: updated });
    }

    if (action === "initialize_sample" || mode === "sample") {
      // Reset to fresh demo data, but apply user's business name and currency
      resetMockDb();
      const updated = saveBusinessProfile(
        {
          businessName: businessName?.trim() || "Demo Business",
          businessType: businessType || "Business",
          operatorName: operatorName?.trim() || "Operator",
          currencySymbol: currencySymbol || "₹",
          currencyCode: currencyCode || "INR",
          mode: "sample",
          isConfigured: true,
        },
        false
      );
      return NextResponse.json({ success: true, profile: updated });
    }

    if (action === "update") {
      const updated = saveBusinessProfile(
        {
          ...(businessName && { businessName: businessName.trim() }),
          ...(businessType && { businessType }),
          ...(operatorName && { operatorName: operatorName.trim() }),
          ...(currencySymbol && { currencySymbol }),
          ...(currencyCode && { currencyCode }),
        },
        false
      );
      return NextResponse.json({ success: true, profile: updated });
    }

    if (action === "reset_unconfigured") {
      const db = getMockDb();
      db.business_profile = {
        isConfigured: false,
        businessName: "",
        businessType: "Business",
        operatorName: "Operator",
        currencySymbol: "₹",
        currencyCode: "INR",
        mode: "unconfigured"
      };
      saveMockDb(db);
      return NextResponse.json({ success: true, profile: db.business_profile });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update profile" }, { status: 500 });
  }
}

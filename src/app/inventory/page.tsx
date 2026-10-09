import { supabase } from "@/lib/supabase";
import { InventoryManager } from "@/components/dashboard/InventoryManager";

export const revalidate = 0;
const BIZ = "biz_demo_001";

async function getProducts() {
  const { data } = await supabase
    .from("products")
    .select("*, vendor:vendors(*)")
    .eq("businessId", BIZ)
    .eq("isActive", true)
    .order("name");
  return data || [];
}

async function getVendors() {
  const { data } = await supabase
    .from("vendors")
    .select("id, name")
    .eq("businessId", BIZ)
    .order("name");
  return (data || []) as Array<{ id: string; name: string }>;
}

export default async function InventoryPage() {
  const [products, vendors] = await Promise.all([getProducts(), getVendors()]);

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-7 space-y-7 animate-fade-in flex-1 flex flex-col">
      <div>
        <h1 className="text-[22px] font-bold text-[var(--text-primary)] tracking-tight">
          Inventory Control Center
        </h1>
        <p className="text-[14px] text-[var(--text-tertiary)] mt-1 font-medium">
          Real-time catalog levels, reorder thresholds, vendor linkages, and quick stock adjustments
        </p>
      </div>

      <InventoryManager initialProducts={products} vendors={vendors} />
    </div>
  );
}

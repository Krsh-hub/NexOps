import { supabase } from "@/lib/supabase";
import { InvoicesManager } from "@/components/dashboard/InvoicesManager";

export const revalidate = 0;
const BIZ = "biz_demo_001";

async function getFinanceData() {
  const [{ data: inv }, { data: prods }] = await Promise.all([
    supabase
      .from("invoices")
      .select("*, customer:customers(*)")
      .eq("businessId", BIZ)
      .order("createdAt", { ascending: false }),
    supabase
      .from("products")
      .select("id, name, sellingPrice, unit")
      .eq("businessId", BIZ)
      .eq("isActive", true),
  ]);

  return {
    invoices: inv || [],
    products: prods || [],
  };
}

export default async function FinancePage() {
  const { invoices, products } = await getFinanceData();

  return (
    <div className="w-full px-6 sm:px-8 lg:px-10 py-7 space-y-7 animate-fade-in flex-1 flex flex-col">
      <div>
        <h1 className="text-[22px] font-bold text-[var(--text-primary)] tracking-tight">
          Finance & Invoicing Cockpit
        </h1>
        <p className="text-[14px] text-[var(--text-tertiary)] mt-1 font-medium">
          Manage invoices, receivables, settlements, and AI payment collection triggers
        </p>
      </div>

      <InvoicesManager initialInvoices={invoices} products={products} />
    </div>
  );
}

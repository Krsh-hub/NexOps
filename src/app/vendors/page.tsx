import { Plus, Mail, Phone, MapPin, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const revalidate = 60;
const BIZ = "biz_demo_001";

async function getVendors() {
  const { data } = await supabase.from("vendors").select("*").eq("businessId", BIZ).order("name");
  return data || [];
}

export default async function VendorsPage() {
  const vendors = await getVendors();

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-[var(--text-primary)] tracking-tight">Vendors</h1>
          <p className="text-[15px] text-[var(--text-tertiary)] mt-1">{vendors.length} registered suppliers</p>
        </div>
        <button className="inline-flex items-center gap-2 h-9 px-4 rounded-[10px] text-[15px] font-medium bg-[var(--accent)] text-white hover:brightness-110 transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Add Vendor
        </button>
      </div>

      {vendors.length === 0 ? (
        <div className="card-surface p-16 text-center">
          <Users className="w-8 h-8 mx-auto mb-3 text-[var(--text-quaternary)]" strokeWidth={1.5} />
          <p className="text-[15px] text-[var(--text-quaternary)]">No vendors yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {vendors.map((v: any) => (
            <div key={v.id} className="card-elevated p-5 flex flex-col gap-3">
              <div>
                <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">{v.name}</h3>
                {v.contactPerson && <p className="text-[16px] text-[var(--text-tertiary)] mt-0.5">{v.contactPerson}</p>}
              </div>
              <div className="space-y-1.5 text-[16px] text-[var(--text-secondary)]">
                {v.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[var(--text-quaternary)]" strokeWidth={1.8} />{v.email}</div>}
                {v.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[var(--text-quaternary)]" strokeWidth={1.8} />{v.phone}</div>}
                {v.address && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[var(--text-quaternary)]" strokeWidth={1.8} /><span className="line-clamp-1">{v.address}</span></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

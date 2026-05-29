"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddVendorModal from "./AddVendorModal";

export default function AddVendorButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 h-9 px-4 rounded-[10px] text-[15px] font-medium bg-[var(--accent)] text-white hover:brightness-110 transition-all shadow-sm"
      >
        <Plus className="w-4 h-4" /> Add Vendor
      </button>
      <AddVendorModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

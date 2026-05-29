"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddProductModal from "./AddProductModal";

interface AddProductButtonProps {
  vendors: Array<{ id: string; name: string }>;
}

export default function AddProductButton({ vendors }: AddProductButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 h-9 px-4 rounded-[10px] text-[15px] font-medium bg-[var(--accent)] text-white hover:brightness-110 transition-all shadow-sm"
      >
        <Plus className="w-4 h-4" /> Add Product
      </button>

      <AddProductModal
        open={open}
        onClose={() => setOpen(false)}
        vendors={vendors}
      />
    </>
  );
}

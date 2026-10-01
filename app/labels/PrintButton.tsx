"use client";

import { Printer } from "@phosphor-icons/react";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="flex h-12 items-center gap-2 rounded-full bg-ink px-5 text-[15px] font-bold text-cream">
      <Printer size={20} weight="light" /> Print labels
    </button>
  );
}

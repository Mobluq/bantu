import type { Metadata } from "next";
import { OnaApp } from "@/components/ona/OnaApp";

export const metadata: Metadata = {
  title: "ọ̀nà · Gallery kiosk",
  description: "The ọ̀nà museum guide in kiosk mode: no saved progress, resets after 90 seconds without a touch.",
};

/** For gallery tablets: open full screen, pin the browser to this page. */
export default function Kiosk() {
  return (
    <main className="min-h-[100dvh] bg-ink">
      <OnaApp bare kiosk />
    </main>
  );
}

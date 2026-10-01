import type { Metadata } from "next";
import { OnaApp } from "@/components/ona/OnaApp";

export const metadata: Metadata = {
  title: "ọ̀nà",
  description: "The ọ̀nà app: pick a guide, walk Ọ̀ṣun’s road, earn your first stamp.",
};

/** Full-screen app, no showcase chrome. This is the home-screen start URL. */
export default function AppPage() {
  return (
    <main className="min-h-[100dvh] bg-cream">
      <OnaApp bare />
    </main>
  );
}

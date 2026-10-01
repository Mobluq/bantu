import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OnaApp } from "@/components/ona/OnaApp";
import { OBJECTS, objectByCode } from "@/lib/ona/museum";

/** The address a QR code on a wall label points at: opens the app on that object. */
export function generateStaticParams() {
  return OBJECTS.map((o) => ({ code: o.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const o = objectByCode((await params).code);
  return o ? { title: `Nº ${o.code} · ${o.title} · ọ̀nà`, description: o.label } : {};
}

export default async function VisitObject({ params }: { params: Promise<{ code: string }> }) {
  const o = objectByCode((await params).code);
  if (!o) notFound();
  return (
    <main className="min-h-[100dvh] bg-cream">
      <OnaApp bare startObject={o.id} />
    </main>
  );
}

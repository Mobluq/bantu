import type { Metadata, Viewport } from "next";
import { Anybody, Archivo, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Every face below was checked to stack Yorùbá tone marks over underdots (ẹ̀, ọ̀).
const anybody = Anybody({
  variable: "--font-anybody",
  subsets: ["latin", "latin-ext", "vietnamese"],
  axes: ["wdth"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext", "vietnamese"],
  axes: ["wdth"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "latin-ext", "vietnamese"],
});

export const metadata: Metadata = {
  title: "ọ̀nà · a living almanac of Nigeria",
  description:
    "A map-first culture app for Nigeria, guided by the figures of its own traditions. Interactive prototype.",
  applicationName: "ọ̀nà",
  appleWebApp: { capable: true, title: "ọ̀nà", statusBarStyle: "black-translucent" },
  icons: { icon: [{ url: "/icon-192.png", sizes: "192x192" }], apple: "/apple-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#b3261b",
  viewportFit: "cover",
};

function Grain() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] h-full w-full opacity-40 mix-blend-multiply"
    >
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 .12  0 0 0 0 .08  0 0 0 0 .05  0 0 0 .55 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anybody.variable} ${archivo.variable} ${instrument.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="min-h-[100dvh]">
        {children}
        <Grain />
      </body>
    </html>
  );
}

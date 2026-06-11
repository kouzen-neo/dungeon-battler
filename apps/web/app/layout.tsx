import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientInit from "./ClientInit";

export const metadata: Metadata = {
  title: "Dungeon Crawler: Elemental Party",
  description: "Roguelite turn-based game",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Elemental Party",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black">
      <body className="antialiased select-none touch-manipulation">
        <ClientInit>{children}</ClientInit>
      </body>
    </html>
  );
}

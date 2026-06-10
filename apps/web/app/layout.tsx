import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientInit from "./ClientInit";

export const metadata: Metadata = {
  title: "Dungeon Battler",
  description: "Roguelite turn-based game",
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

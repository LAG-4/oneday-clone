import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brody Billings | Monument Solutions",
  description:
    "Entrepreneur, investor, operator, and systems builder helping founder-led companies improve operations, capital discipline, and AI execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body>{children}</body>
    </html>
  );
}

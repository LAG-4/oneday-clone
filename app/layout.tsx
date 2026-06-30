import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "day one® Run",
  description:
    "day one® unites runners through community runs, performance apparel, and the belief that every day is day one.",
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

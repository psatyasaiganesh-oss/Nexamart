import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexaMart | Everyday discoveries",
  description: "Shop electronics, fashion and accessories at NexaMart.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

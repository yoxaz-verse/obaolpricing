import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./provider";

export const metadata: Metadata = {
  title: "Cardamom Intelligence | Market Rates & Analytics",
  description: "Automated cardamom auction extraction with derived market rates, live pricing, and trend analytics. Premium B2B dashboard.",
  keywords: ["cardamom", "auction", "pricing", "b2b", "market rates", "commodity rates", "OBAOL"],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: "Cardamom Intelligence | Premium Market Data",
    description: "Automated cardamom commodity market tracking & insights portal.",
    type: "website",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

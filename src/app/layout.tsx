import "../styles/global.css";
import type { Metadata } from "next";
import { Providers } from "./provider";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Commodity Pricing Platform - Real-Time Market Rates",
  description:
    "Real-time pricing platform for premium spices including cardamom, pepper, cinnamon, nutmeg, mace, honey, and tea. Live updates from authorized auction centers with accurate market insights.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" style={{}}>
      <body className={`${inter.className} `} style={{ overflowX: "hidden" }}>
        {/* <AuthProvider> */}
        <Providers>{children}</Providers>
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}

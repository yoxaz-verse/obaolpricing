import "../styles/global.css";
import type { Metadata } from "next";
import { Providers } from "./provider";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cardamom Live Rate",
  description:
    "Only panel which provides market rate of cardamom and purchase on that rate.",
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
    <html lang="en" style={{}}>
      <body
        className={inter.className + "bg-slate-900"}
        style={{ overflowX: "hidden" }}
      >
        {/* <AuthProvider> */}
        <Providers>{children}</Providers>
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}

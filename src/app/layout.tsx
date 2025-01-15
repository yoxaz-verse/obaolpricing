import "../styles/global.css";
import type { Metadata } from "next";
import { Providers } from "./provider";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Obaol Cardamom",
  description: "Obaol Cardamom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{}}>
      <body className={inter.className} style={{ overflowX: "hidden" }}>
        {/* <AuthProvider> */}
        <Providers>{children}</Providers>
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}

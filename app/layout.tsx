import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "A Arte da Renovação | Luxury Remodeling",
  description: "Transformamos visões em lares extraordinários.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}

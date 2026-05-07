import type { Metadata } from "next";
import { Pinyon_Script, Inter } from "next/font/google";
import "./globals.css";

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lyndon Johnson",
  description: "Art gallery of Lyndon Johnson",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pinyon.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}

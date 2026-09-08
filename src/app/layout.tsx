import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "shorra",
  description: "Minimalist onboarding",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu" className={`${inter.variable} font-sans h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-zinc-900">{children}</body>
    </html>
  );
}

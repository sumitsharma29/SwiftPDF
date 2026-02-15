import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: "SwiftPDF - Free & Secure PDF Tools",
  description: "Merge, Split, and Convert PDFs instantly with SwiftPDF.",
  manifest: "/manifest.json",
};

import { ToastProvider } from "@/components/ToastProvider";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative`}>
        <AnimatedBackground />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

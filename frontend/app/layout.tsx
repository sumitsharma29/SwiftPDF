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
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans min-h-screen bg-[#050505] text-gray-100 relative selection:bg-cyan-500/30 selection:text-cyan-200`}>
        <AnimatedBackground />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

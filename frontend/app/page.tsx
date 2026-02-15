'use client';

import ToolCard from '@/components/ToolCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import {
  Combine,
  Scissors,
  Layers,
  Minimize2,
  Image,
  FileImage,
  Lock,
  Unlock,
  Stamp
} from 'lucide-react';

const tools = [
  {
    title: 'Merge PDF',
    description: 'Combine multiple PDFs into one unified document.',
    icon: Combine,
    href: '/tools/merge',
    color: 'from-red-500 to-orange-500 text-red-500',
  },
  {
    title: 'Split PDF',
    description: 'Extract pages from your PDF or save each page as a separate PDF.',
    icon: Scissors,
    href: '/tools/split',
    color: 'from-orange-500 to-yellow-500 text-orange-500',
  },
  {
    title: 'Organize PDF',
    description: 'Sort, add and delete PDF pages. Drag and drop the pages you want.',
    icon: Layers,
    href: '/tools/organize',
    color: 'from-yellow-400 to-orange-400 text-yellow-600',
  },
  {
    title: 'Compress PDF',
    description: 'Reduce the file size of your PDF while maintaining the best quality.',
    icon: Minimize2,
    href: '/tools/compress',
    color: 'from-green-500 to-emerald-500 text-green-500',
  },
  {
    title: 'PDF to JPG',
    description: 'Convert each PDF page into a JPG or extract all images.',
    icon: Image,
    href: '/tools/pdf-to-jpg',
    color: 'from-teal-500 to-cyan-500 text-teal-500',
  },
  {
    title: 'JPG to PDF',
    description: 'Convert JPG images to PDF in seconds. Easily adjust orientation.',
    icon: FileImage,
    href: '/tools/jpg-to-pdf',
    color: 'from-blue-500 to-indigo-500 text-blue-500',
  },
  {
    title: 'Lock PDF',
    description: 'Protect PDF files with a password. Encrypt PDF documents.',
    icon: Lock,
    href: '/tools/lock',
    color: 'from-indigo-500 to-purple-500 text-indigo-500',
  },
  {
    title: 'Unlock PDF',
    description: 'Remove PDF password security, giving you the freedom to use your PDFs.',
    icon: Unlock,
    href: '/tools/unlock',
    color: 'from-purple-500 to-pink-500 text-purple-500',
  },
  {
    title: 'Watermark PDF',
    description: 'Stamp an image or text over your PDF in seconds.',
    icon: Stamp,
    href: '/tools/watermark',
    color: 'from-pink-500 to-rose-500 text-pink-500',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24 relative"
        >
          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-3xl -z-10 animate-pulse" />

          <motion.span
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center py-1.5 px-4 rounded-full bg-white/50 border border-blue-200 text-blue-700 text-sm font-bold mb-6 shadow-sm backdrop-blur-sm"
          >
            🚀 100% Free, Secure & Private
          </motion.span>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight text-gray-900 mb-8 drop-shadow-sm leading-[1.1]">
            SwiftPDF <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 animate-gradient-x">
              Master Your Documents
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-600 leading-relaxed font-medium mb-10">
            Merge, split, compress, and convert PDFs with our professional-grade tools.
            <span className="block mt-2 text-gray-500 text-lg">No software installation required. Completely client-side secure.</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, index) => (
            <ToolCard key={tool.href} {...tool} index={index} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

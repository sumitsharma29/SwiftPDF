'use client';

import ToolCard from '@/components/ToolCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Combine,
  Scissors,
  Layers,
  Minimize2,
  Image,
  FileImage,
  Lock,
  Unlock,
  Stamp,
  Type,
  Wrench,
  Info,
  Hash,
  MessageSquareText,
  FileSignature,
  Eraser,
  GitCompare,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';

const tools = [
  {
    title: 'Merge PDF',
    description: 'Combine multiple PDF documents into a single, high-fidelity file with absolute structural integrity.',
    icon: Combine,
    href: '/tools/merge',
    color: 'from-red-500 to-orange-500 text-red-500',
  },
  {
    title: 'Split PDF',
    description: 'Deconstruct PDF documents into individual pages or specific ranges with surgical precision.',
    icon: Scissors,
    href: '/tools/split',
    color: 'from-orange-500 to-yellow-500 text-orange-500',
  },
  {
    title: 'Organize PDF',
    description: 'Architect your document flow. Reorder, rotate, and manage pages via an intuitive neural interface.',
    icon: Layers,
    href: '/tools/organize',
    color: 'from-yellow-400 to-orange-400 text-yellow-500',
  },
  {
    title: 'Compress PDF',
    description: 'Optimize file size using advanced compression algorithms without compromising visual clarity.',
    icon: Minimize2,
    href: '/tools/compress',
    color: 'from-green-500 to-emerald-500 text-emerald-500',
  },
  {
    title: 'PDF to JPG',
    description: 'Transform PDF pages into professional-grade JPEG images with optimized pixel density.',
    icon: Image,
    href: '/tools/pdf-to-jpg',
    color: 'from-teal-500 to-cyan-500 text-teal-500',
  },
  {
    title: 'JPG to PDF',
    description: 'Convert high-resolution images into standardized PDF documents with instant processing.',
    icon: FileImage,
    href: '/tools/jpg-to-pdf',
    color: 'from-blue-500 to-indigo-500 text-blue-500',
  },
  {
    title: 'Sign PDF',
    description: 'Authenticate and secure your documents with enterprise-grade digital signature overlays.',
    icon: FileSignature,
    href: '/tools/sign',
    color: 'from-purple-400 to-fuchsia-500 text-purple-400',
  },
  {
    title: 'Redact PDF',
    description: 'Permanently eliminate sensitive data from your documents using secure obfuscation protocols.',
    icon: Eraser,
    href: '/tools/redact',
    color: 'from-rose-500 to-red-600 text-rose-500',
  },
  {
    title: 'Compare PDFs',
    description: 'Execute a deep structural comparison between two documents to identify every variance.',
    icon: GitCompare,
    href: '/tools/compare',
    color: 'from-indigo-400 to-violet-500 text-indigo-400',
  },
  {
    title: 'Extract Text',
    description: 'Utilize high-accuracy OCR to harvest semantic content from any PDF source instantly.',
    icon: Type,
    href: '/tools/extract-text',
    color: 'from-cyan-500 to-blue-500 text-cyan-500',
  },
  {
    title: 'Repair PDF',
    description: 'Restore the structural integrity of corrupted or damaged PDF files using recovery algorithms.',
    icon: Wrench,
    href: '/tools/repair',
    color: 'from-emerald-500 to-teal-500 text-emerald-400',
  },
  {
    title: 'Edit Metadata',
    description: 'Modify internal document properties, authorship, and indexing keywords with full control.',
    icon: Info,
    href: '/tools/edit-metadata',
    color: 'from-slate-500 to-gray-600 text-slate-400',
  },
  {
    title: 'Page Numbers',
    description: 'Implement dynamic, sequential page indexing with customizable positioning and typography.',
    icon: Hash,
    href: '/tools/add-page-numbers',
    color: 'from-blue-600 to-indigo-700 text-blue-400',
  },
  {
    title: 'Lock PDF',
    description: 'Enforce military-grade AES encryption to protect your intellectual property and data.',
    icon: Lock,
    href: '/tools/lock',
    color: 'from-indigo-500 to-purple-500 text-indigo-500',
  },
  {
    title: 'Unlock PDF',
    description: 'Decrypt and remove security restrictions from authorized PDF documents seamlessly.',
    icon: Unlock,
    href: '/tools/unlock',
    color: 'from-purple-500 to-pink-500 text-purple-500',
  },
  {
    title: 'Watermark PDF',
    description: 'Embed secure identity markers and branding into your documents with variable opacity.',
    icon: Stamp,
    href: '/tools/watermark',
    color: 'from-pink-500 to-rose-500 text-pink-500',
  },
];


export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const filteredTools = tools.filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col relative">
      {/* Ultra Premium Background */}
      <div className="fixed inset-0 -z-20 bg-[#020202]">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 opacity-40"
        >
          <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[160px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[900px] h-[900px] bg-purple-600/10 rounded-full blur-[180px]" />
          <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[140px]" />
        </motion.div>
      </div>

      <Navbar />

      <main className="flex-grow pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-[100rem] mx-auto w-full relative">
        <section className="text-center mb-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-10"
          >
            <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full glass-panel border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              <Sparkles size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
              Next-Gen Intelligence Toolkit
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter text-white mb-10 leading-[0.9] text-gradient uppercase">
              SwiftPDF <br />
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">
                  Intelligence
                </span>
                <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto text-xl md:text-2xl text-gray-400 font-medium leading-relaxed mb-14"
          >
            Elevate your document workflow with SwiftPDF. Our suite provides 
            <span className="text-white"> enterprise-grade tools</span> for absolute precision, 
            <span className="text-white"> unyielding security</span>, and 
            <span className="text-white"> instant scalability</span>. 
            Engineered for professionals who demand excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 md:gap-12"
          >
            {[
              { icon: ShieldCheck, label: 'End-to-End Encryption' },
              { icon: Zap, label: 'Neural Processing' },
              { icon: Sparkles, label: 'Premium UX' }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-500 text-sm font-semibold uppercase tracking-widest">
                <feature.icon size={18} className="text-cyan-500/50" />
                {feature.label}
              </div>
            ))}
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 max-w-2xl mx-auto px-4"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-cyan-500/10 blur-2xl group-hover:bg-cyan-500/20 transition-all duration-500" />
              <div className="relative glass-panel rounded-2xl border border-white/10 flex items-center p-2 shadow-2xl">
                <div className="pl-4 text-gray-500 group-hover:text-cyan-400 transition-colors">
                  <Wrench size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="SEARCH INTELLIGENCE TOOLS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none px-4 py-3 text-white font-black text-xs uppercase tracking-widest placeholder:text-gray-600"
                />
                <div className="pr-4">
                  <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    {filteredTools.length} Tools
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <motion.div 
          id="tools"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        >
          <AnimatePresence>
            {filteredTools.map((tool, index) => (
              <ToolCard key={tool.href} {...tool} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredTools.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No intelligence protocols found for &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}


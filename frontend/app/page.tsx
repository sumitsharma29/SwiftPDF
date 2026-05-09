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
  Zap,
  Trash2,
  ExternalLink,
  Scan,
  FileText,
  Presentation,
  Table,
  Languages,
  Maximize,
  RotateCw,
  Crop,
  FileCode
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
  {
    title: 'Word to PDF',
    description: 'Convert Microsoft Word documents into standardized, high-fidelity PDF format instantly.',
    icon: FileText,
    href: '/tools/word-to-pdf',
    color: 'from-blue-600 to-blue-800 text-blue-500',
  },
  {
    title: 'Excel to PDF',
    description: 'Transform complex spreadsheets into professional PDF reports while maintaining formatting.',
    icon: Table,
    href: '/tools/excel-to-pdf',
    color: 'from-emerald-600 to-green-800 text-emerald-500',
  },
  {
    title: 'PPT to PDF',
    description: 'Convert presentation decks into portable PDF documents for seamless distribution.',
    icon: Presentation,
    href: '/tools/ppt-to-pdf',
    color: 'from-orange-600 to-red-700 text-orange-500',
  },
  {
    title: 'HTML to PDF',
    description: 'Render web pages or HTML source code into pixel-perfect PDF documents.',
    icon: FileCode,
    href: '/tools/html-to-pdf',
    color: 'from-gray-700 to-gray-900 text-gray-400',
  },
  {
    title: 'PDF to Word',
    description: 'Deconstruct PDF files back into editable Microsoft Word documents with AI layout preservation.',
    icon: FileText,
    href: '/tools/pdf-to-word',
    color: 'from-blue-400 to-blue-600 text-blue-400',
  },
  {
    title: 'Remove Pages',
    description: 'Surgically eliminate unwanted pages from your document with total precision.',
    icon: Trash2,
    href: '/tools/remove-pages',
    color: 'from-red-600 to-rose-800 text-red-500',
  },
  {
    title: 'Extract Pages',
    description: 'Isolate and extract specific page ranges into new, independent document assets.',
    icon: ExternalLink,
    href: '/tools/extract-pages',
    color: 'from-cyan-400 to-blue-600 text-cyan-400',
  },
  {
    title: 'Scan to PDF',
    description: 'Transform physical document captures into high-resolution, searchable PDF files.',
    icon: Scan,
    href: '/tools/scan-to-pdf',
    color: 'from-indigo-400 to-purple-600 text-indigo-400',
  },
  {
    title: 'Rotate PDF',
    description: 'Correct document orientation with precise 90-degree rotational control for every page.',
    icon: RotateCw,
    href: '/tools/rotate-pdf',
    color: 'from-yellow-500 to-orange-600 text-yellow-500',
  },
  {
    title: 'Crop PDF',
    description: 'Adjust document margins and crop page boundaries with geometric precision.',
    icon: Crop,
    href: '/tools/crop-pdf',
    color: 'from-teal-400 to-emerald-600 text-teal-400',
  },
  {
    title: 'PSD to PDF',
    description: 'Convert Adobe Photoshop documents into high-fidelity PDF assets locally.',
    icon: FileCode,
    href: '/tools/psd-to-pdf',
    color: 'from-blue-600 to-indigo-700 text-blue-500',
  },
  {
    title: 'TIFF to PDF',
    description: 'Transform multi-page TIFF images into professional PDF documents.',
    icon: FileImage,
    href: '/tools/tiff-to-pdf',
    color: 'from-teal-500 to-cyan-500 text-teal-500',
  },
  {
    title: 'PDF to TIFF',
    description: 'Convert PDF documents into high-quality TIFF image sequences.',
    icon: Image,
    href: '/tools/pdf-to-tiff',
    color: 'from-cyan-500 to-blue-500 text-cyan-500',
  },
  {
    title: 'JSON to PDF',
    description: 'Render structured JSON data into human-readable PDF reports.',
    icon: FileCode,
    href: '/tools/json-to-pdf',
    color: 'from-gray-600 to-gray-800 text-gray-400',
  },
  {
    title: 'Base64 to PDF',
    description: 'Convert Base64 encoded strings back into standard PDF documents.',
    icon: FileCode,
    href: '/tools/base64-to-pdf',
    color: 'from-gray-400 to-gray-600 text-gray-400',
  },
  {
    title: 'PDF to Base64',
    description: 'Encode your PDF files into Base64 strings for embedding or transmission.',
    icon: FileCode,
    href: '/tools/pdf-to-base64',
    color: 'from-gray-500 to-gray-700 text-gray-500',
  },
  {
    title: 'XML to PDF',
    description: 'Transform XML data structures into standardized PDF documentation.',
    icon: FileCode,
    href: '/tools/xml-to-pdf',
    color: 'from-gray-500 to-gray-700 text-gray-500',
  },
  {
    title: 'YAML to PDF',
    description: 'Convert YAML configuration files into professional PDF layouts.',
    icon: FileCode,
    href: '/tools/yaml-to-pdf',
    color: 'from-gray-400 to-gray-600 text-gray-600',
  },
  {
    title: 'PDF to JSON',
    description: 'Extract structured content from PDFs into machine-readable JSON format.',
    icon: FileCode,
    href: '/tools/pdf-to-json',
    color: 'from-orange-500 to-yellow-500 text-orange-500',
  },
  {
    title: 'PDF to XML',
    description: 'Extract document structure into standardized XML format for data interchange.',
    icon: FileCode,
    href: '/tools/pdf-to-xml',
    color: 'from-orange-500 to-yellow-600 text-orange-500',
  },
  {
    title: 'PDF to YAML',
    description: 'Convert document content into machine-readable YAML configuration files.',
    icon: FileCode,
    href: '/tools/pdf-to-yaml',
    color: 'from-orange-600 to-yellow-700 text-orange-600',
  },
  {
    title: 'PDF to Excel',
    description: 'Extract tabular data from PDF files into fully editable Excel spreadsheets.',
    icon: Table,
    href: '/tools/pdf-to-excel',
    color: 'from-emerald-400 to-green-600 text-emerald-400',
  },
  {
    title: 'OCR PDF',
    description: 'Execute local, high-accuracy optical character recognition to make PDFs searchable.',
    icon: Scan,
    href: '/tools/ocr',
    color: 'from-blue-400 to-indigo-600 text-blue-400',
  },
  {
    title: 'Remove BG',
    description: 'Eliminate document backgrounds using local neural processing for clean outputs.',
    icon: Eraser,
    href: '/tools/remove-bg',
    color: 'from-rose-400 to-red-600 text-rose-400',
  },
  {
    title: 'PDF to PDF/A',
    description: 'Convert documents to the ISO-standardized version for long-term archiving.',
    icon: ShieldCheck,
    href: '/tools/pdf-to-pdfa',
    color: 'from-emerald-500 to-teal-600 text-emerald-500',
  },
  {
    title: 'Swift Editor',
    description: 'The ultimate document workspace. Surgically modify content and inject new text layers with absolute visual precision.',
    icon: Type,
    href: '/tools/editor',
    color: 'from-cyan-500 to-blue-600 text-cyan-400',
  },
];


export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

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
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-600/5 rounded-full blur-[140px]" />
          <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />
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
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.href}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              >
                <ToolCard {...tool} index={index} />
              </motion.div>
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


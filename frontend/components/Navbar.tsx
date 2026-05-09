'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X, Sparkles, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import axios from 'axios';

const tools = [
    { name: 'Merge PDF', href: '/tools/merge', color: 'text-red-500' },
    { name: 'Split PDF', href: '/tools/split', color: 'text-orange-500' },
    { name: 'Organize PDF', href: '/tools/organize', color: 'text-yellow-500' },
    { name: 'Compress PDF', href: '/tools/compress', color: 'text-emerald-500' },
    { name: 'PDF to JPG', href: '/tools/pdf-to-jpg', color: 'text-teal-500' },
    { name: 'JPG to PDF', href: '/tools/jpg-to-pdf', color: 'text-blue-500' },
    { name: 'Sign PDF', href: '/tools/sign', color: 'text-purple-400' },
    { name: 'Redact PDF', href: '/tools/redact', color: 'text-rose-500' },
    { name: 'Compare PDF', href: '/tools/compare', color: 'text-indigo-400' },
    { name: 'OCR PDF', href: '/tools/ocr', color: 'text-blue-400' },
    { name: 'Remove BG', href: '/tools/remove-bg', color: 'text-rose-400' },
    { name: 'PDF to Excel', href: '/tools/pdf-to-excel', color: 'text-emerald-400' },
    { name: 'Word to PDF', href: '/tools/word-to-pdf', color: 'text-blue-500' },
    { name: 'PDF to Word', href: '/tools/pdf-to-word', color: 'text-blue-400' },
    { name: 'Excel to PDF', href: '/tools/excel-to-pdf', color: 'text-emerald-500' },
    { name: 'PPT to PDF', href: '/tools/ppt-to-pdf', color: 'text-orange-500' },
    { name: 'HTML to PDF', href: '/tools/html-to-pdf', color: 'text-gray-400' },
    { name: 'Remove Pages', href: '/tools/remove-pages', color: 'text-red-500' },
    { name: 'Extract Pages', href: '/tools/extract-pages', color: 'text-cyan-400' },
    { name: 'Rotate PDF', href: '/tools/rotate-pdf', color: 'text-yellow-500' },
    { name: 'Crop PDF', href: '/tools/crop-pdf', color: 'text-teal-400' },
    { name: 'Lock PDF', href: '/tools/lock', color: 'text-indigo-500' },
    { name: 'Unlock PDF', href: '/tools/unlock', color: 'text-purple-500' },
    { name: 'Watermark PDF', href: '/tools/watermark', color: 'text-pink-500' },
    { name: 'Repair PDF', href: '/tools/repair', color: 'text-emerald-400' },
    { name: 'Metadata', href: '/tools/edit-metadata', color: 'text-slate-400' },
    { name: 'Page Numbers', href: '/tools/add-page-numbers', color: 'text-blue-400' },
    { name: 'PSD to PDF', href: '/tools/psd-to-pdf', color: 'text-blue-500' },
    { name: 'TIFF to PDF', href: '/tools/tiff-to-pdf', color: 'text-teal-500' },
    { name: 'PDF to TIFF', href: '/tools/pdf-to-tiff', color: 'text-cyan-500' },
    { name: 'JSON to PDF', href: '/tools/json-to-pdf', color: 'text-gray-400' },
    { name: 'Base64/PDF', href: '/tools/base64-to-pdf', color: 'text-gray-500' },
    { name: 'PDF to JSON', href: '/tools/pdf-to-json', color: 'text-orange-500' },
    { name: 'PDF to XML', href: '/tools/pdf-to-xml', color: 'text-orange-600' },
    { name: 'PDF to YAML', href: '/tools/pdf-to-yaml', color: 'text-yellow-600' },
];

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        
        // Health check
        const checkBackend = async () => {
            try {
                // Use absolute URL to bypass Next.js rewrite for initial check if needed, 
                // but /api is usually rewritten correctly.
                await axios.get('/api');
                setBackendOnline(true);
            } catch (e) {
                setBackendOnline(false);
            }
        };
        checkBackend();
        const interval = setInterval(checkBackend, 10000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-4 sm:p-6 pointer-events-none">
            <motion.nav 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className={`
                    pointer-events-auto flex items-center justify-between w-full max-w-7xl 
                    px-4 py-2 sm:px-8 sm:py-3 rounded-full transition-all duration-700 ease-[0.23, 1, 0.32, 1]
                    ${scrolled ? 'glass-panel shadow-2xl backdrop-blur-2xl' : 'bg-transparent'}
                `}
            >
                <div className="flex items-center space-x-6">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all">
                                <Logo className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <span className="text-xl sm:text-2xl font-black tracking-tighter text-white">Swift<span className="text-cyan-500">PDF</span></span>
                    </Link>

                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border border-white/5 bg-white/2 ${backendOnline === true ? 'text-emerald-500' : backendOnline === false ? 'text-rose-500' : 'text-gray-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse bg-current`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {backendOnline === true ? 'Core Online' : backendOnline === false ? 'Core Offline' : 'Initializing'}
                        </span>
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-1">
                    <div className="relative group">
                        <button className="flex items-center space-x-2 px-6 py-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest">
                            <span>Intelligence Tools</span>
                            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                        </button>

                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform group-hover:translate-y-0 translate-y-4">
                            <div className="glass-panel rounded-3xl overflow-hidden p-4 shadow-3xl border border-white/10">
                                <div className="grid grid-cols-3 gap-2">
                                    {tools.map((tool) => (
                                        <Link
                                            key={tool.href}
                                            href={tool.href}
                                            className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-white/5 transition-all group/item"
                                        >
                                            <div className={`w-2 h-2 rounded-full ${tool.color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor] group-hover/item:scale-150 transition-transform`} />
                                            <span className="text-sm font-bold text-gray-300 group-hover/item:text-white">{tool.name}</span>
                                        </Link>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center px-2">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">All processing is local & secure</span>
                                    <Sparkles size={12} className="text-cyan-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <Link href="/about" className="px-6 py-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest">About</Link>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden p-3 text-gray-300 hover:bg-white/5 rounded-full transition-all active:scale-90"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="absolute top-full left-0 right-0 mt-4 p-2 md:hidden"
                        >
                            <div className="glass-panel rounded-3xl overflow-hidden p-4 shadow-3xl">
                                <div className="space-y-1">
                                    {tools.map((tool) => (
                                        <Link
                                            key={tool.href}
                                            href={tool.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center p-4 rounded-2xl hover:bg-white/5 transition-all group"
                                        >
                                            <div className={`w-3 h-3 rounded-full mr-4 ${tool.color.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor]`} />
                                            <span className="text-lg font-bold text-gray-200">{tool.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </header>
    );
}

